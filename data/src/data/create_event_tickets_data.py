import glob
import os
from time import time

import pandas
from fuzzywuzzy import fuzz
from pandas import DataFrame
from src.constants.event_tickets_columns import (
    EVENT_TICKETS_COLUMNS_TO_RENAME,
    EventTicketsColumn,
)
from src.constants.project_constants import BUILD_FOLDER
from src.constants.results_columns import ResultsColumn
from src.data.util.convert_event_tickets_date import convert_event_tickets_date
from src.data.util.drop_unnamed_columns import drop_unnamed_columns
from src.util.create_json_file import create_json_file


def create_event_tickets_data(events_df: DataFrame):
    print("Creating event tickets data...")
    start_time = time()

    joined_files = os.path.join(f"{BUILD_FOLDER}/event_tickets", "*.csv")
    joined_list = glob.glob(joined_files)
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)

    df = drop_unnamed_columns(df)
    df = df.rename(columns=EVENT_TICKETS_COLUMNS_TO_RENAME)
    df = df.drop_duplicates()
    df[EventTicketsColumn.DATE] = df[EventTicketsColumn.DATE].apply(
        convert_event_tickets_date
    )

    print("Adding name match for ticket events...")
    df = pandas.merge(
        df,
        events_df,
        how="left",
        on=[ResultsColumn.DATE, ResultsColumn.EVENT_NAT_FULL],
    )
    col_x = f"{ResultsColumn.EVENT_NAME}_x"
    col_y = f"{ResultsColumn.EVENT_NAME}_y"
    RATIO_COL = "ratio"
    df[RATIO_COL] = df[~df[col_y].isna()].apply(
        lambda x: fuzz.ratio(x[col_x], x[col_y]),
        axis=1,
    )
    df = (
        df.sort_values(RATIO_COL, ascending=False)
        .drop_duplicates([col_x])
        .drop_duplicates(col_y)
    )
    df = df.rename(columns={col_x: ResultsColumn.EVENT_NAME})
    df = df.drop(columns=[col_y, RATIO_COL])
    df = df.groupby(ResultsColumn.EVENT_ID)
    print("Finished adding name matches for ticket events.")

    create_json_file(df, "events", is_groupby=True)
    print(f"Finished creating event tickets data in {(time() - start_time)} seconds.")
    return df
