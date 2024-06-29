from pandas import DataFrame
from src.constants.results_columns import ResultsColumn


def add_ranks(df: DataFrame):
    # Result rank
    df[ResultsColumn.ALL_TIME_RANK] = (
        df[ResultsColumn.YARDS].rank(ascending=False, method="min").round(0).astype(int)
    )

    # Event rank
    df[ResultsColumn.EVENT_RANK] = (
        df.groupby(ResultsColumn.EVENT_ID)[ResultsColumn.YARDS]
        .rank(ascending=False, method="min")
        .round(0)
        .astype(int)
    )
    df[ResultsColumn.EVENT_PLACE] = df[ResultsColumn.EVENT_RANK].apply(
        lambda x: "W" if x == 1 else "A" if x == 2 else None
    )
    df[ResultsColumn.IS_TIED_WIN] = df[df[ResultsColumn.EVENT_PLACE] == "W"].duplicated(
        subset=[ResultsColumn.EVENT_ID, ResultsColumn.EVENT_PLACE], keep=False
    )
    df.loc[df[ResultsColumn.IS_TIED_WIN] == True, ResultsColumn.EVENT_PLACE] = "A"
