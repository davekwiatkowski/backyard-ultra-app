import pandas
from pandas import DataFrame
from src.constants.results_columns import ResultsColumn
from src.constants.ticket_events_columns import TicketEventsColumn


def add_awards_to_results(results_df: DataFrame, ticket_events_df: DataFrame):
    results_df = pandas.merge(
        results_df, ticket_events_df, on=ResultsColumn.EVENT_ID, how="left"
    )

    results_df.loc[
        results_df[ResultsColumn.EVENT_NAME].str.contains("Big Dog's", regex=False)
        | results_df[ResultsColumn.EVENT_NAME].str.contains(
            "Laz' Backyard Ultra", regex=False
        ),
        TicketEventsColumn.EVENT_AWARD,
    ] = "Championship"

    results_df["year"] = pandas.to_datetime(results_df[ResultsColumn.DATE]).dt.year
    results_df.loc[
        (results_df[TicketEventsColumn.EVENT_AWARD] == "Championship")
        & (results_df["year"] % 2 == 0)
        & (results_df["year"] >= 2020),
        TicketEventsColumn.EVENT_AWARD,
    ] = "Gold"
    results_df.drop(columns=["year"])

    results_df.loc[
        (
            (results_df[TicketEventsColumn.EVENT_AWARD] == "Bronze")
            | (results_df[TicketEventsColumn.EVENT_AWARD] == "Silver")
        )
        & (results_df[ResultsColumn.EVENT_NAT3] == results_df[ResultsColumn.NAT3])
        & (results_df[ResultsColumn.EVENT_PLACE] == "W"),
        ResultsColumn.AWARD_WON,
    ] = results_df[TicketEventsColumn.EVENT_AWARD]
    results_df.loc[
        (results_df[TicketEventsColumn.EVENT_AWARD] != "Bronze")
        & (results_df[TicketEventsColumn.EVENT_AWARD] != "Silver")
        & (results_df[ResultsColumn.EVENT_PLACE] == "W"),
        ResultsColumn.AWARD_WON,
    ] = results_df[TicketEventsColumn.EVENT_AWARD]

    return results_df
