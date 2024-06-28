import re

from pandas import DataFrame
from src.constants.results_columns import ResultsColumn


def get_backyard_race_pieces(race: str):
    original_race = race
    try:
        regex = r"^(.+) \(([A-Z]+)\)$"
        nation = re.sub(regex, "\\2", race)
        race = re.sub(regex, "\\1", race)
        return (race, nation)
    except:
        raise Exception(f"[convert_backyard_race] Failed with race: {original_race}")


def convert_backyard_race(df: DataFrame):
    original_race = df[ResultsColumn.EVENT_NAME]
    df[ResultsColumn.EVENT_NAME] = original_race.apply(
        lambda x: get_backyard_race_pieces(x)[0]
    )
    df[ResultsColumn.EVENT_NAT3] = original_race.apply(
        lambda x: get_backyard_race_pieces(x)[1]
    )
