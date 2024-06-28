from pandas import DataFrame


def drop_unnamed_columns(df: DataFrame):
    return df.drop(columns=list(df.filter(regex="Unnamed:")))
