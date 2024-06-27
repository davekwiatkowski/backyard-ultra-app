from datetime import datetime
import glob
import os
import numpy
import pandas
from pandas import DataFrame
import time

from src.utils.convert_nat3 import convert_nat3
from src.utils.convert_backyard_race import convert_backyard_race
from src.constants.project_constants import BUILD_FOLDER, EVENT_LIST_FILE_PATH
from src.utils.create_json_file import create_json_file, create_json_file_from_data
from src.utils.convert_backyard_date import convert_backyard_date
from src.utils.name import convert_full_name, get_first_name, get_last_name

def get_max_yards(group):
    return group.loc[group['yards'].idxmax()]

def add_personal_best(df: DataFrame, start_date=None, end_date=None, column_name='isPersonalBest', value=True):
    bests = df.copy()
    if start_date and end_date:
        bests = bests.loc[(bests['date'] >= start_date) & (bests['date'] <= end_date)]
    bests = bests.groupby('personId').apply(get_max_yards)
    bests.reset_index(drop = True, inplace = True)
    
    df.reset_index(drop = True, inplace = True)
    df = pandas.merge(df, bests, how='left', indicator=column_name)
    df[column_name] = numpy.where(df[column_name] == 'both', value, None)
    return df

def add_season_bests(df: DataFrame):
    dates = pandas.to_datetime(df['date'], format='%Y-%m-%d')
    min_date = dates.min()
    max_date = dates.max() + pandas.Timedelta(days=365 * 2)
    min_year = min_date.year
    max_year = max_date.year
    if max_date < datetime.strptime(f'{max_year}-08-16', '%Y-%m-%d'):
        max_year -= 1
    if min_date > datetime.strptime(f'{min_year}-08-16', '%Y-%m-%d'):
        min_year += 1
    
    columns = []
    seasons = []
    for year in range(min_year, max_year + 1):
        print(f'Adding season best for year: {year}')
        column_name = f'isSeasonBest{year}'
        df = add_personal_best(df, f'{year - 2}-08-16', f'{year}-08-15', column_name, year)
        columns.append(column_name)
        seasons.append(year)
    create_json_file_from_data(seasons, 'seasons')
    df['seasonBests'] = df[columns].values.tolist()
    df = df.drop(columns=columns)
    return df

def create_site_data():
    print('Creating merged json file...')
    start_time = time.time()    

    joined_files = os.path.join(f'{BUILD_FOLDER}/events', "*.csv") 
    joined_list = glob.glob(joined_files) 
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)
    event_list_df = pandas.read_csv(EVENT_LIST_FILE_PATH)
    df = pandas.merge(df, event_list_df, on="EventId", how="outer")

    df = df.drop(columns=['IAU-Label', 'Unnamed: 6'])
    df = df.rename(columns={
        'EventId': 'eventId', 
        'Rank': 'eventRankNoOverlap',
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

    df = df[df['date'].notnull()]
    df['date'] = df['date'].apply(lambda x: convert_backyard_date(x))
    df['firstName'] = df['name'].apply(lambda x: get_first_name(x))
    df['lastName'] = df['name'].apply(lambda x: get_last_name(x))
    df['name'] = df['name'].apply(lambda x: convert_full_name(x))
    df['distanceKm'] = pandas.to_numeric(df['distanceKm'].dropna().str.replace(' km', ''))
    
    convert_backyard_race(df)
    convert_nat3(df, 'nat')
    convert_nat3(df, 'eventNat')

    df.loc[df['yards'] == 0, 'yards'] = (df['distanceKm'].dropna() / 6.7056).round(0).astype(int)
    pandas.set_option('display.max_rows', df.shape[0]+1)
    
    df['rankResultAllTime'] = df['yards'].rank(ascending=False, method='min')

    df['eventRank'] = df.groupby('eventId')['yards'].rank(ascending=False, method='min')
    df['eventPlace'] = df['eventRankNoOverlap'].apply(lambda x: 'W' if x == 1 else 'A' if x == 2 else None)
    df['isTiedWin'] = df[df['eventPlace'] == 'W'].duplicated(subset=['eventId','eventPlace'], keep=False)
    df.loc[df['isTiedWin'] == True, 'eventPlace'] = None

    df['personId'] = df['name'].str.lower()

    df = df.drop(columns=['birthday', 'genderRank', 'eventDistance', 'eventFinishers', 'ageGradedPerformance', 'categoryRank' ])
    df = df.drop_duplicates()
    df = df.sort_values(by=['yards', 'eventPlace', 'eventRankNoOverlap', 'date'], ascending=[False, False, True, True])

    df = add_personal_best(df)
    df = add_season_bests(df)

    create_json_file(df, 'results')

    print(f"Finished creating merged JSON file in {(time.time() - start_time)} seconds.")

    return df