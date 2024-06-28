import pandas
from pandas import DataFrame
from src.constants.results_columns import ResultsColumn


def convert_yards(df: DataFrame):
    df[ResultsColumn.DISTANCE] = pandas.to_numeric(
        df[ResultsColumn.DISTANCE].dropna().str.replace(" km", "")
    )
    df.loc[df[ResultsColumn.YARDS] == 0, ResultsColumn.YARDS] = (
        (df[ResultsColumn.DISTANCE].dropna() / 6.7056).round(0).astype(int)
    )
    pandas.set_option("display.max_rows", df.shape[0] + 1)
    df = df.drop(columns=[ResultsColumn.DISTANCE])
    return df
