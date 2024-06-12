import os
import pandas
import json

from src.constants.backyard_ultra_site_constants import WORLD_RANKINGS_FILE_NAME
from src.constants.project_constants import BUILD_FOLDER

import country_converter as coco

def add_columns(df):
    df = df[df['Yards'].notnull()]
    df = df[df['Date'].notnull()]
    df = df.rename(columns={
        'Year': 'window', 
        'Rank': 'rank', 
        'Yards': 'yards',
        'Name': 'name',
        'Nat': 'nat3',
        'Race': 'race',
        'Date': 'date',
    })

    df['window'] = df['window'].str.replace(' ', '-');
    
    df['isRankTied'] = df['rank'].str.contains('tie')
    df['rank'] = df['rank'].str.replace(' (tie)', '')
    df['rank'] = pandas.to_numeric(df['rank'])

    df['yards'] = pandas.to_numeric(df['yards'].astype(str).apply(lambda x: x.replace('.0','')))
    df['date'] = pandas.to_datetime(df['date'], format='%m/%d/%Y')

    df['date'] = df['date'].dt.strftime('%Y-%m-%d')

    df['name'] = df['name'].str.replace('\\s+', ' ', regex=True)
    df['id'] = df['name'].str.replace(' ', '-').str.lower()

    df['nat3'] = df['nat3'].str.replace('&nbsp;', '')

    cc = coco.CountryConverter()
    iso3_nat3s = ['DEU', 'CHE', 'NLD']
    ioc_nat3 = df[~df['nat3'].isin(iso3_nat3s)]['nat3'].dropna()
    iso3_nat3 = df[df['nat3'].isin(iso3_nat3s)]['nat3'].dropna()
    nat2_1 = cc.pandas_convert(series=ioc_nat3, to='ISO2', src='IOC')
    nat2_2 = cc.pandas_convert(series=iso3_nat3, to='ISO2', src='ISO3')

    df['nat2'] = pandas.concat([nat2_1, nat2_2])
    df['natFull'] = cc.pandas_convert(series=df['nat2'].dropna(), to='name_short', src='ISO2')

    return df

def get_window_rankings(df):
    df = add_columns(df)
    df = df.sort_values(by=["rank", "date"])
    groups = df.groupby('window')
    out = groups.apply(lambda g: g.to_dict(orient='records')).to_json()
    return out

def get_person_rankings(df):
    df = add_columns(df)
    df = df.sort_values(by=["window"])
    groups = df.groupby('id')
    out = groups.apply(lambda g: g.to_dict(orient='records')).to_json()
    return out

def create_json_file(df, callback, file_name):
    json_file_name = f'../site/src/data/{file_name}.json'
    os.makedirs(os.path.dirname(json_file_name), exist_ok=True)
    out = callback(df)
    parsed = json.loads(out)
    with open(json_file_name, 'w') as json_file:
        json.dump(parsed, json_file, indent=2)
        print(f'Created JSON file {json_file_name}') 

def create_json_files():
    csv_file_name = f'{BUILD_FOLDER}/{WORLD_RANKINGS_FILE_NAME}.csv'
    df = pandas.read_csv(csv_file_name)
    create_json_file(df, get_person_rankings, 'person-rankings')
    create_json_file(df, get_window_rankings, 'window-rankings')

if __name__ == '__main__':
    create_json_files()