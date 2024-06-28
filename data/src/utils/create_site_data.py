import glob
import os
import time

import pandas
from src.constants.project_constants import BUILD_FOLDER, EVENT_LIST_FILE_PATH
from src.constants.results_columns import (
    RESULTS_COLUMNS_TO_DROP,
    RESULTS_COLUMNS_TO_RENAME,
    RESULTS_COLUMNS_TO_SORT_BY,
    OriginalResultsColumn,
    ResultsColumn,
)
from src.utils.add_personal_best import add_personal_best
from src.utils.add_season_best import add_season_bests
from src.utils.convert_backyard_date import convert_backyard_date
from src.utils.convert_backyard_race import convert_backyard_race
from src.utils.convert_nat3 import convert_nat3
from src.utils.create_json_file import create_json_file
from src.utils.name import convert_full_name, get_first_name, get_last_name


def create_site_data():
    print("Creating merged json file...")
    start_time = time.time()
    joined_files = os.path.join(f"{BUILD_FOLDER}/events", "*.csv")
    joined_list = glob.glob(joined_files)
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)
    event_list_df = pandas.read_csv(EVENT_LIST_FILE_PATH)
    df = pandas.merge(df, event_list_df, on=OriginalResultsColumn.EVENT_ID, how="outer")

    # Clean up
    df = df.rename(columns=RESULTS_COLUMNS_TO_RENAME)
    df = df.drop(columns=RESULTS_COLUMNS_TO_DROP)
    df = df[df[ResultsColumn.FULL_NAME].notnull()]
    df = df[df[ResultsColumn.DATE].notnull()]
    df = df.drop_duplicates()

    # Convert existing fields
    convert_backyard_race(df)
    convert_nat3(df, ResultsColumn.NAT3)
    convert_nat3(df, ResultsColumn.EVENT_NAT3)
    df[ResultsColumn.DATE] = df[ResultsColumn.DATE].apply(
        lambda x: convert_backyard_date(x)
    )
    df[ResultsColumn.FIRST_NAME] = df[ResultsColumn.FULL_NAME].apply(
        lambda x: get_first_name(x)
    )
    df[ResultsColumn.LAST_NAME] = df[ResultsColumn.FULL_NAME].apply(
        lambda x: get_last_name(x)
    )
    df[ResultsColumn.FULL_NAME] = df[ResultsColumn.FULL_NAME].apply(
        lambda x: convert_full_name(x)
    )
    df[ResultsColumn.DISTANCE] = pandas.to_numeric(
        df[ResultsColumn.DISTANCE].dropna().str.replace(" km", "")
    )

    # Yards
    df.loc[df[ResultsColumn.YARDS] == 0, ResultsColumn.YARDS] = (
        (df[ResultsColumn.DISTANCE].dropna() / 6.7056).round(0).astype(int)
    )
    pandas.set_option("display.max_rows", df.shape[0] + 1)
    df = df.drop(columns=[ResultsColumn.DISTANCE])

    # Person ID
    df[ResultsColumn.PERSON_ID] = df[ResultsColumn.FULL_NAME].str.lower()

    # Result rank
    df[ResultsColumn.ALL_TIME_RANK] = (
        df[ResultsColumn.YARDS].rank(ascending=False, method="min").round(0).astype(int)
    )

    # Event rank
    df[ResultsColumn.EVENT_RANK] = (
        df.groupby(ResultsColumn.EVENT_ID)[ResultsColumn.YARDS]
        .rank(ascending=False, method="min")
        .round(0)
        .astype(int)
    )
    df[ResultsColumn.EVENT_PLACE] = df[ResultsColumn.EVENT_RANK].apply(
        lambda x: "W" if x == 1 else "A" if x == 2 else None
    )
    df[ResultsColumn.IS_TIED_WIN] = df[df[ResultsColumn.EVENT_PLACE] == "W"].duplicated(
        subset=[ResultsColumn.EVENT_ID, ResultsColumn.EVENT_PLACE], keep=False
    )
    df.loc[df[ResultsColumn.IS_TIED_WIN] == True, ResultsColumn.EVENT_PLACE] = None

    # Bests
    df = add_personal_best(df)
    df = add_season_bests(df)

    # Sort
    df = df.sort_values(
        by=RESULTS_COLUMNS_TO_SORT_BY,
        ascending=[False, False, True, True],
    )

    # Finish
    create_json_file(df, "results")
    print(
        f"Finished creating merged JSON file in {(time.time() - start_time)} seconds."
    )
    return df
