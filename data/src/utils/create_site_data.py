import glob
import os
import pandas
import country_converter as coco
import time

from src.constants.project_constants import BUILD_FOLDER, EVENT_LIST_FILE_PATH
from src.utils.create_json_file import create_json_file
from src.utils.convert_backyard_date import convert_backyard_date
from src.utils.name import convert_full_name, get_first_name, get_last_name

def create_site_data():
    print('Creating merged json file...')
    start_time = time.time()    

    joined_files = os.path.join(f'{BUILD_FOLDER}/events', "*.csv") 
    joined_list = glob.glob(joined_files) 
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)
    event_list_df = pandas.read_csv(EVENT_LIST_FILE_PATH)
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