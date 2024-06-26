import glob
import os
from time import time

import pandas
from fuzzywuzzy import fuzz
from pandas import DataFrame
from src.constants.project_constants import BUILD_FOLDER
from src.constants.results_columns import ResultsColumn
from src.constants.ticket_events_columns import (
    TICKET_EVENTS_COLUMNS_TO_RENAME,
    TicketEventsColumn,
)
from src.data.util.convert_ticket_events_date import convert_ticket_events_date
from src.data.util.drop_unnamed_columns import drop_unnamed_columns
from src.util.create_json_file import create_json_file


def create_ticket_events(
    events_df: DataFrame, ticket_events_from_team_rosters: DataFrame
):
    print("Creating ticket events data...")
    start_time = time()

    joined_files = os.path.join(f"{BUILD_FOLDER}/ticket-events", "*.csv")
    joined_list = glob.glob(joined_files)
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)

    df = drop_unnamed_columns(df)
    df = df.rename(columns=TICKET_EVENTS_COLUMNS_TO_RENAME)
    df = df.drop_duplicates()
    df[TicketEventsColumn.DATE] = df[TicketEventsColumn.DATE].apply(
        convert_ticket_events_date
    )
    df = pandas.concat([df, ticket_events_from_team_rosters])

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
    df = df.drop(
        columns=[
            TicketEventsColumn.EVENT_NAT_FULL,
            TicketEventsColumn.EVENT_NAME,
            TicketEventsColumn.DATE,
        ]
    )
    print(f"Finished creating ticket events data in {(time() - start_time)} seconds.")
    return df
