import numpy
import pandas
from pandas import DataFrame
from src.constants.results_columns import ResultsColumn
from src.data.util.get_max_yards import get_max_yards


def add_personal_best(
    df: DataFrame,
    start_date=None,
    end_date=None,
    column_name=ResultsColumn.IS_PERSONAL_BEST,
    value=True,
):
    bests = df.copy()
    if start_date and end_date:
        bests = bests.loc[
            (bests[ResultsColumn.DATE] >= start_date)
            & (bests[ResultsColumn.DATE] <= end_date)
        ]
    bests = bests.groupby(ResultsColumn.PERSON_ID).apply(get_max_yards)
    bests.reset_index(drop=True, inplace=True)

    df.reset_index(drop=True, inplace=True)
    df = pandas.merge(df, bests, how="left", indicator=column_name)
    df[column_name] = numpy.where(df[column_name] == "both", value, None)
    return df
