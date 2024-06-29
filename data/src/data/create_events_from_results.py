from pandas import DataFrame
from src.constants.results_columns import ResultsColumn


def create_events_from_results(results_df: DataFrame):
    df = results_df[
        [
            ResultsColumn.EVENT_ID,
            ResultsColumn.EVENT_NAME,
            ResultsColumn.EVENT_NAT2,
            ResultsColumn.EVENT_NAT3,
            ResultsColumn.EVENT_NAT_FULL,
            ResultsColumn.DATE,
        ]
    ].drop_duplicates()
    event_id_count = len(results_df[ResultsColumn.EVENT_ID].unique())
    event_result_count = len(df[ResultsColumn.EVENT_ID])
    print((event_result_count, event_id_count))
    assert event_result_count == event_id_count
    return df
