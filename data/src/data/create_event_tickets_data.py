import glob
import os
import re
from datetime import datetime
from time import time

import pandas
from src.constants.event_tickets_columns import (
    EVENT_TICKETS_COLUMNS_TO_RENAME,
    EventTicketsColumn,
)
from src.constants.project_constants import BUILD_FOLDER
from src.data.util.drop_unnamed_columns import drop_unnamed_columns
from src.util.create_json_file import create_json_file


def convert_event_tickets_date(date: str):
    if date == "TBC":
        return None

    regex = r"^([a-zA-Z]+), ([a-zA-Z]+) ([0-9]+), ([0-9]+)$"
    day_of_week = re.sub(regex, "\\1", date)
    month = re.sub(regex, "\\2", date)
    day_of_month = re.sub(regex, "\\3", date).zfill(2)
    year = re.sub(regex, "\\4 ", date)
    date = f"{day_of_week}, {month} {day_of_month}, {year}".strip()
    print(date)
    return datetime.strptime(date, "%A, %B %d, %Y").strftime("%Y/%m/%d")


def create_event_tickets_data():
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

    create_json_file(df, "event_tickets")
    print(f"Finished creating event tickets data in {(time() - start_time)} seconds.")
    return df
