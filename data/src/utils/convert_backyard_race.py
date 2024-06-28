import re

from pandas import DataFrame


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
    original_race = df["race"]
    df["race"] = original_race.apply(lambda x: get_backyard_race_pieces(x)[0])
    df["eventNat3"] = original_race.apply(lambda x: get_backyard_race_pieces(x)[1])
