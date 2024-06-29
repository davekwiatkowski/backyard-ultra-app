from pandas import DataFrame
from src.constants.results_columns import ResultsColumn
from src.data.util.name import convert_full_name, get_first_name, get_last_name


def convert_person_name(df: DataFrame):
    # TODO: Do not do this... use a fuzzy match or something instead since there are likely many more people with this issue...
    df.loc[
        df[ResultsColumn.FULL_NAME] == "Kwiatkowski, Rick", ResultsColumn.FULL_NAME
    ] = "Kwiatkowski, Richard"
    df.loc[
        df[ResultsColumn.FULL_NAME] == "Kwiatkowski, David", ResultsColumn.FULL_NAME
    ] = "Kwiatkowski, Dave"

    df[ResultsColumn.FIRST_NAME] = df[ResultsColumn.FULL_NAME].apply(
        lambda x: get_first_name(x)
    )
    df[ResultsColumn.LAST_NAME] = df[ResultsColumn.FULL_NAME].apply(
        lambda x: get_last_name(x)
    )
    df[ResultsColumn.FULL_NAME] = df[ResultsColumn.FULL_NAME].apply(
        lambda x: convert_full_name(x)
    )
    df[ResultsColumn.PERSON_ID] = (
        df[ResultsColumn.FULL_NAME].str.lower() + "-" + df[ResultsColumn.NAT3]
    )
