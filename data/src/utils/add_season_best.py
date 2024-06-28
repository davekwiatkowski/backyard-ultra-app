from datetime import datetime

import pandas
from pandas import DataFrame
from src.constants.results_columns import ResultsColumn
from src.utils.add_personal_best import add_personal_best
from src.utils.create_json_file import create_json_file_from_data


def add_season_bests(df: DataFrame):
    dates = pandas.to_datetime(df[ResultsColumn.DATE], format="%Y-%m-%d")
    min_date = dates.min()
    max_date = dates.max() + pandas.Timedelta(days=365 * 2)
    min_year = min_date.year
    max_year = max_date.year
    if max_date < datetime.strptime(f"{max_year}-08-16", "%Y-%m-%d"):
        max_year -= 1
    if min_date > datetime.strptime(f"{min_year}-08-16", "%Y-%m-%d"):
        min_year += 1

    columns = []
    seasons = []
    for year in range(min_year, max_year + 1):
        print(f"Adding season best for year: {year}")
        column_name = f"isSeasonBest{year}"
        df = add_personal_best(
            df, f"{year - 2}-08-16", f"{year}-08-15", column_name, year
        )
        columns.append(column_name)
        seasons.append(year)
    create_json_file_from_data(seasons, "seasons")
    df[ResultsColumn.SEASON_BESTS] = df[columns].values.tolist()
    df = df.drop(columns=columns)
    return df
