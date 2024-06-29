import glob
import os
from time import time

import pandas
from src.constants.project_constants import BUILD_FOLDER
from src.constants.results_columns import ResultsColumn
from src.constants.ticket_events_columns import TicketEventsColumn
from src.data.util.convert_team_rosters_event_date import (
    convert_team_rosters_event_date,
)
from src.data.util.drop_unnamed_columns import drop_unnamed_columns


def create_ticket_events_from_team_rosters():
    print("Creating team rosters data...")
    start_time = time()

    joined_files = os.path.join(f"{BUILD_FOLDER}/team-rosters", "*.csv")
    joined_list = glob.glob(joined_files)
    df = pandas.concat(map(pandas.read_csv, joined_list), ignore_index=True)

    df = drop_unnamed_columns(df)
    df = df.rename(
        columns={
            "Country": TicketEventsColumn.EVENT_NAT_FULL,
            "#": "rosterRank",
            "Status": TicketEventsColumn.EVENT_AWARD,
            "Name": ResultsColumn.FULL_NAME,
            "W/A": ResultsColumn.EVENT_PLACE,
            "Yards": ResultsColumn.YARDS,
            "Race": ResultsColumn.EVENT_NAME,
            "Start Date": ResultsColumn.DATE,
        }
    )
    df = df.drop(
        columns=[
            ResultsColumn.FULL_NAME,
            "rosterRank",
            ResultsColumn.EVENT_PLACE,
            ResultsColumn.YARDS,
        ]
    )
    df = df[df[TicketEventsColumn.EVENT_AWARD] == "Silver Ticket"]
    df[TicketEventsColumn.EVENT_AWARD] = "Silver"
    df = df.drop_duplicates()

    df[TicketEventsColumn.DATE] = df[TicketEventsColumn.DATE].apply(
        convert_team_rosters_event_date
    )
    print(f"Finished creating team rosters data in {(time() - start_time)} seconds.")
    return df
