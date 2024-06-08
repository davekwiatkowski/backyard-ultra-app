import os
import pandas
import json

from src.constants.backyard_ultra_site_constants import WORLD_RANKINGS_FILE_NAME
from src.constants.project_constants import BUILD_FOLDER

def transform(df):
    df = df[df['Yards'].notnull()]
    df = df[df['Date'].notnull()]
    df = df.rename(columns={
        'Year': 'window', 
        'Rank': 'rank', 
        'Yards': 'yards',
        'Name': 'name',
        'Nat': 'nationality',
        'Race': 'race',
        'Date': 'date',
    })
    
    df['isRankTied'] = df['rank'].str.contains('tie')
    df['rank'] = df['rank'].str.replace(' (tie)', '')
    df['rank'] = pandas.to_numeric(df['rank'])

    df['yards'] = pandas.to_numeric(df['yards'].astype(str).apply(lambda x: x.replace('.0','')))
    df['date'] = pandas.to_datetime(df['date'], format='%m/%d/%Y')
    df = df.sort_values(by=["date"])
    df['date'] = df['date'].dt.strftime('%Y-%m-%d')

    df_no_all_time = df[df['window'] != 'All Time']
    df_name = df_no_all_time.groupby('name')
    df['personalBestAfterRace'] = df_name['yards'].cummax()
    df_no_all_time = df[df['window'] != 'All Time']
    df_name = df_no_all_time.groupby('name')
    df['personalBestImprovementAfterRace'] = df_name['personalBestAfterRace'].diff()
    df['isPersonalBestAfterRace'] = df['personalBestAfterRace'] == df['yards']
    return df

def create_json_files():
    csv_file_name = f'{BUILD_FOLDER}/{WORLD_RANKINGS_FILE_NAME}.csv'
    df = pandas.read_csv(csv_file_name)
    df = transform(df)
    out = df.to_json(orient="records")
    json_file_name = '../app/static/data/backyard-ultra-rankings.json'
    os.makedirs(os.path.dirname(json_file_name), exist_ok=True)
    parsed = json.loads(out)
    with open(json_file_name, 'w') as json_file:
        json.dump(parsed, json_file, indent=2)
        print(f'Created JSON file {json_file_name}') 

if __name__ == '__main__':
    create_json_files()