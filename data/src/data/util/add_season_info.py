from datetime import datetime

import pandas
from pandas import DataFrame
from src.constants.results_columns import ResultsColumn
from src.data.util.add_personal_best import add_personal_best
from src.data.util.get_qualification_dates import get_qualification_dates
from src.util.create_json_file_from_data import create_json_file_from_data


def add_season_info(df: DataFrame):
    dates = pandas.to_datetime(df[ResultsColumn.DATE], format="%Y/%m/%d")
    min_date = dates.min()
    max_date = dates.max() + pandas.Timedelta(days=365 * 2)
    min_year = min_date.year
    max_year = max_date.year
    if max_date < datetime.strptime(f"{max_year}/08/16", "%Y/%m/%d"):
        max_year -= 1
    if min_date > datetime.strptime(f"{min_year}/08/16", "%Y/%m/%d"):
        min_year += 1

    # Add season bests
    columns = []
    for year in range(min_year, max_year + 1):
        print(f"Adding season best for year: {year}")
        column_name = f"isSeasonBest{year}"
        (start_date, end_date) = get_qualification_dates(year)
        df = add_personal_best(df, start_date, end_date, column_name, year)
        columns.append(column_name)
    df[ResultsColumn.SEASON_BESTS] = df[columns].values.tolist()
    df[ResultsColumn.SEASON_BESTS] = df[ResultsColumn.SEASON_BESTS].apply(
        lambda x: list(filter(None, x))
    )
    df = df.drop(columns=columns)

    # Add seasons
    seasons = []
    df[ResultsColumn.SEASONS] = ""
    for year in range(min_year, max_year + 1):
        (start_date, end_date) = get_qualification_dates(year)
        df.loc[
            (df[ResultsColumn.DATE] >= start_date)
            & (df[ResultsColumn.DATE] <= end_date),
            ResultsColumn.SEASONS,
        ] = df[ResultsColumn.SEASONS].apply(lambda x: f"{x},{year}")
        seasons.append(year)
    df[ResultsColumn.SEASONS] = df[ResultsColumn.SEASONS].apply(
        lambda x: [int(y) for y in list(filter(None, x.split(",")))]
    )

    create_json_file_from_data(seasons, "seasons")
    return df
