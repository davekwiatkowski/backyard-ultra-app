import re
from datetime import datetime


def convert_team_rosters_event_date(date: str):
    regex = r"^([a-zA-Z]+) ([0-9]+), ([0-9]+)$"
    month = re.sub(regex, "\\1", date)
    day_of_month = re.sub(regex, "\\2", date).zfill(2)
    year = re.sub(regex, "\\3 ", date)
    date = f"{month} {day_of_month}, {year}".strip()
    return datetime.strptime(date, "%b %d, %Y").strftime("%Y/%m/%d")
