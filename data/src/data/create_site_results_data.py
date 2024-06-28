import glob
import os
from time import time

import pandas
from src.constants.project_constants import BUILD_FOLDER, EVENT_LIST_FILE_PATH
from src.constants.results_columns import (
    RESULTS_COLUMNS_TO_DROP,
    RESULTS_COLUMNS_TO_RENAME,
    RESULTS_COLUMNS_TO_SORT_BY,
    OriginalResultsColumn,
    ResultsColumn,
)
from src.data.util.add_personal_best import add_personal_best
from src.data.util.add_ranks import add_ranks
from src.data.util.add_season_best import add_season_bests
from src.data.util.convert_backyard_date import convert_backyard_date
from src.data.util.convert_backyard_race import convert_backyard_race
from src.data.util.convert_nat3 import convert_nat3
from src.data.util.convert_person_name import convert_person_name
from src.data.util.convert_yards import convert_yards
from src.data.util.drop_unnamed_columns import drop_unnamed_columns
from src.util.create_json_file import create_json_file


def create_site_results_data():
    print("Creating site results data...")
    start_time = time()
    joined_files = os.path.join(f"{BUILD_FOLDER}/events", "*.csv")
    joined_list = glob.glob(joined_files)
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)
    event_list_df = pandas.read_csv(EVENT_LIST_FILE_PATH)
    df = pandas.merge(df, event_list_df, on=OriginalResultsColumn.EVENT_ID, how="outer")

    df = drop_unnamed_columns(df)
    df = df.rename(columns=RESULTS_COLUMNS_TO_RENAME)
    df = df.drop(columns=RESULTS_COLUMNS_TO_DROP)
    df = df[df[ResultsColumn.FULL_NAME].notnull()]
    df = df[df[ResultsColumn.DATE].notnull()]
    df = df.drop_duplicates()

    convert_backyard_race(df)
    convert_nat3(df, ResultsColumn.NAT3)
    convert_nat3(df, ResultsColumn.EVENT_NAT3)
    convert_person_name(df)
    df = convert_yards(df)
    df[ResultsColumn.DATE] = df[ResultsColumn.DATE].apply(
        lambda x: convert_backyard_date(x)
    )

    add_ranks(df)

    df = add_personal_best(df)
    df = add_season_bests(df)

    df = df.sort_values(
        by=RESULTS_COLUMNS_TO_SORT_BY,
        ascending=[False, False, True, True],
    )

    create_json_file(df, "results")
    print(f"Finished creating site results data in {(time() - start_time)} seconds.")
    return df
