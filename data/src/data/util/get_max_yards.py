from pandas import DataFrame
from src.constants.results_columns import ResultsColumn


def get_max_yards(group: DataFrame):
    return group.loc[group[ResultsColumn.YARDS].idxmax()]
