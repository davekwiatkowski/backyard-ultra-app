from concurrent.futures import ThreadPoolExecutor
import os
import pandas
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
import csv
import time
from urllib.parse import urlparse
from urllib.parse import parse_qs

from src.utils.get_root import get_root
from data.src.utils.decode_string import decode_string
from src.constants.project_constants import (
    BUILD_FOLDER, 
    EVENT_LIST_FILE_PATH, 
    EVENTS_URL_ENCODED,
    RESULTS_HEADERS, 
    RESULTS_URL_ENCODED,
    WAIT_TIME,
)

from pathlib import Path

RESULTS_URL = decode_string(RESULTS_URL_ENCODED)
EVENTS_URL = decode_string(EVENTS_URL_ENCODED)

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
    driver.get(f'{RESULTS_URL}?event={event_id}')

    table = WebDriverWait(driver, WAIT_TIME).until(EC.visibility_of_element_located((By.ID, "Resultlist")))

    event_file_path = get_event_file_path(event_id)
    os.makedirs(os.path.dirname(event_file_path), exist_ok=True)
    with open(event_file_path, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(RESULTS_HEADERS)
        for tr in table.find_element(By.TAG_NAME, "tbody").find_elements(By.TAG_NAME, 'tr'):
            writer.writerow([event_id] + [td.text.strip() for td in tr.find_elements(By.TAG_NAME, 'td')])

    print(f'Finished scraping results for event {event_id}.')
    driver.close()

def write_results_for_events(limit=None):
    df = pandas.read_csv(EVENT_LIST_FILE_PATH)

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
        driver.get(f'{EVENTS_URL}?year=all&dist=all&country=all&surface=Backy&sort=1&page={page}')

        table = WebDriverWait(driver, WAIT_TIME).until(EC.visibility_of_element_located((By.ID, "Resultlist")))
        
        os.makedirs(os.path.dirname(EVENT_LIST_FILE_PATH), exist_ok=True)
        with open(EVENT_LIST_FILE_PATH, 'w' if page == 1 else 'a', newline='') as csv_file:
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