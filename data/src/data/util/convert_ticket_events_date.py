import re
from datetime import datetime


def convert_ticket_events_date(date: str):
    if date == "TBC":
        return None

    regex = r"^([a-zA-Z]+), ([a-zA-Z]+) ([0-9]+), ([0-9]+)$"
    day_of_week = re.sub(regex, "\\1", date)
    month = re.sub(regex, "\\2", date)
    day_of_month = re.sub(regex, "\\3", date).zfill(2)
    year = re.sub(regex, "\\4 ", date)
    date = f"{day_of_week}, {month} {day_of_month}, {year}".strip()
    return datetime.strptime(date, "%A, %B %d, %Y").strftime("%Y/%m/%d")
