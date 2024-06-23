from concurrent.futures import ThreadPoolExecutor
import glob
import os
import pandas
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
import country_converter as coco
import csv
import time
from urllib.parse import urlparse
from urllib.parse import parse_qs

from src.constants.project_constants import BUILD_FOLDER, EVENT_LIST_FILE_NAME
from src.utils.get_root import get_root
from src.utils.create_json_file import create_json_file
from src.utils.convert_backyard_date import convert_backyard_date
from src.utils.name import convert_full_name, get_first_name, get_last_name

from pathlib import Path

def create_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    path =  f"{get_root()}/{BUILD_FOLDER}"
    options.add_experimental_option('prefs', {'download.default_directory' : path})
    return webdriver.Chrome(options=options)
    
def get_event_file_path(event_id):
    return f'{BUILD_FOLDER}/events/{event_id}.csv'
    
def should_skip_event_result(event_id):
    return Path(get_event_file_path(event_id)).is_file()

def write_results_for_event(event_id=83012):
    driver = create_driver()

    if should_skip_event_result(event_id):
        print(f'Skipping scraping for event {event_id}.')
        return

    print(f'Writing results for event {event_id}...')
    driver.get(f'https://statistik.d-u-v.org/getresultevent.php?event={event_id}')

    table = WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.ID, "Resultlist")))

    event_file_path = get_event_file_path(event_id)
    os.makedirs(os.path.dirname(event_file_path), exist_ok=True)
    with open(event_file_path, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['EventId', 'Rank','Performance', "Surname, first name" , 'Club', 'Nat.', 'YOB','M/F','Rank M/F','Cat','Cat. Rank','hours','Age graded performance'])
        for tr in table.find_element(By.TAG_NAME, "tbody").find_elements(By.TAG_NAME, 'tr'):
            writer.writerow([event_id] + [td.text.strip() for td in tr.find_elements(By.TAG_NAME, 'td')])

    print(f'Finished scraping results for event {event_id}.')

    driver.close()


def write_results_for_events(limit=None):
    csv_file_name = f'{BUILD_FOLDER}/{EVENT_LIST_FILE_NAME}.csv'
    df = pandas.read_csv(csv_file_name)

    start_time = time.time()    

    old_events_count = len([event_id for event_id in df['EventId'] if should_skip_event_result(event_id)])
    new_events = [event_id for event_id in df['EventId'] if not should_skip_event_result(event_id)]
    if limit:
        new_events = new_events[0:limit]
    events_count = len(new_events)

    if not events_count:
        print('There are no new events.')
        return
    
    print(f'Writing results for all new events ({events_count}) | Skipping over old events ({old_events_count})...')
    with ThreadPoolExecutor() as threads:
        threads.map(lambda event_id: write_results_for_event(event_id), new_events)
    print(f"Finished writing results for events ({events_count}) in {(time.time() - start_time)} seconds.")

def write_results_for_event_list():
    print('Writing results for event list...')
    start_time = time.time()    
    driver = create_driver()
    page = 1
    while True:
        print(f'Scraping page {page}...')
        driver.get(f'https://statistik.d-u-v.org/geteventlist.php?year=all&dist=all&country=all&surface=Backy&sort=1&page={page}')

        table = WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.ID, "Resultlist")))
        
        event_list_file_path = f'{BUILD_FOLDER}/{EVENT_LIST_FILE_NAME}.csv'
        os.makedirs(os.path.dirname(event_list_file_path), exist_ok=True)
        with open(event_list_file_path, 'w' if page == 1 else 'a', newline='') as csv_file:
            writer = csv.writer(csv_file)
            if page == 1:
                for tr in table.find_element(By.TAG_NAME, "thead").find_elements(By.TAG_NAME, 'tr'):
                    writer.writerow(['EventId'] + [th.text.strip() for th in tr.find_elements(By.TAG_NAME, 'th')])
            for tr in table.find_element(By.TAG_NAME, "tbody").find_elements(By.TAG_NAME, 'tr'):
                try:
                    url = tr.find_element(By.TAG_NAME, 'a').get_attribute('href')
                    parsed_url = urlparse(url)
                    event_id = parse_qs(parsed_url.query)['event'][0]
                    writer.writerow([event_id] + [td.text.strip() for td in tr.find_elements(By.XPATH, ".//td[not(@class='KategorieHeader')]")])
                except NoSuchElementException:
                    continue

        print(f'Finished scraping page {page}.')

        try:
            driver.find_element(By.XPATH, "//div[@class='pagination']/a[text()='>>']")
            page += 1
        except NoSuchElementException:
            print(f"Finished writing results for event list in {(time.time() - start_time)} seconds.")
            break

    driver.close()

def create_merged_json_file():
    print('Creating merged json file...')
    start_time = time.time()    

    joined_files = os.path.join(f'{BUILD_FOLDER}/events', "*.csv") 
    joined_list = glob.glob(joined_files) 
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)
    event_list_df = pandas.read_csv(f'{BUILD_FOLDER}/{EVENT_LIST_FILE_NAME}.csv')
    df = pandas.merge(df, event_list_df, on="EventId", how="outer")
    df = df.rename(columns={
        'EventId': 'eventId', 
        'Rank': 'eventRank',
        'Performance': 'distanceKm',
        'Surname, first name': 'name',
        'Club': 'club',
        'Nat.': 'nat3',
        'YOB': 'birthday',
        'M/F': 'gender',
        'Rank M/F': 'genderRank',
        'Cat': 'category',
        'Cat. Rank': 'categoryRank',
        'hours': 'yards',
        'Age graded performance': 'ageGradedPerformance',
        'Event': 'race',
        'Distance': 'eventDistance',
        'Finishers': 'eventFinishers',
        'Date': 'date'
    })
    df = df[df['name'].notnull()]
    df['firstName'] = df['name'].apply(lambda x: get_first_name(x))
    df['lastName'] = df['name'].apply(lambda x: get_last_name(x))
    df['name'] = df['name'].apply(lambda x: convert_full_name(x))
    df['distanceKm'] = pandas.to_numeric(df['distanceKm'].dropna().str.replace(' km', ''))
    
    cc = coco.CountryConverter()
    iso3_nat3s = ['GRL', 'MAC']
    ioc_nat3 = df[~df['nat3'].isin(iso3_nat3s)]['nat3'].dropna()
    iso3_nat3 = df[df['nat3'].isin(iso3_nat3s)]['nat3'].dropna()
    nat2_1 = cc.pandas_convert(series=ioc_nat3, to='ISO2', src='IOC')
    nat2_2 = cc.pandas_convert(series=iso3_nat3, to='ISO2', src='ISO3')
    df['nat2'] = pandas.concat([nat2_1, nat2_2])
    df['natFull'] = cc.pandas_convert(series=df['nat2'].dropna(), to='name_short', src='ISO2')
    
    df.loc[df['yards'] == 0, 'yards'] = (df['distanceKm'].dropna() / 6.7056).round(0).astype(int)
    df['date'] = df['date'].apply(lambda x: convert_backyard_date(x))
    df['rankResultAllTime'] = df['yards'].rank(ascending=False, method='min')
    df['eventPlace'] = df['eventRank'].apply(lambda x: 'Win' if x == 1 else 'Assist' if x == 2 else None)

    df['personId'] = df['name'].str.lower()

    df = df.drop(columns=['birthday', 'genderRank', 'eventDistance', 'eventFinishers', 'IAU-Label', 'Unnamed: 6', 'ageGradedPerformance', 'categoryRank' ])
    df = df.drop_duplicates()
    df = df.sort_values(by=['yards', 'eventPlace' ,'date'], ascending=[False, False, True])

    create_json_file(df, 'results')

    print(f"Finished creating merged JSON file in {(time.time() - start_time)} seconds.")

if __name__ == '__main__':
    write_results_for_event_list()
    write_results_for_events()
    create_merged_json_file()