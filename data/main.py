import argparse

import pandas
from src.constants.project_constants import TEAM_ROSTER_URL_2024, TICKET_EVENTS_URL
from src.constants.results_columns import ResultsColumn
from src.constants.ticket_events_columns import TicketEventsColumn
from src.data.create_events_from_results import create_events_from_results
from src.data.create_results import create_results
from src.data.create_site_metadata import create_site_metadata
from src.data.create_ticket_events import create_ticket_events
from src.data.create_ticket_events_from_team_rosters import (
    create_ticket_events_from_team_rosters,
)
from src.scraping.scrape_event_list import scrape_event_list
from src.scraping.scrape_results_for_events import scrape_results_for_events
from src.scraping.scrape_team_rosters import scrape_team_rosters
from src.scraping.scrape_ticket_events import scrape_ticket_events
from src.util.create_json_file import create_json_file

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Create data for backyardultra.app",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("-s", "--scrape", action="store_true", help="should scrape web")
    args = parser.parse_args()
    config = vars(args)
    print(f"config: {config}")
    if config["scrape"]:
        scrape_ticket_events(2024, TICKET_EVENTS_URL)
        scrape_team_rosters(2024, TEAM_ROSTER_URL_2024)
        scrape_event_list()
        scrape_results_for_events()

    results_df = create_results()

    events_df = create_events_from_results(results_df)
    ticket_events_from_team_rosters_df = create_ticket_events_from_team_rosters()
    ticket_events_df = create_ticket_events(
        events_df, ticket_events_from_team_rosters_df
    )

    results_df = pandas.merge(
        results_df, ticket_events_df, on=ResultsColumn.EVENT_ID, how="left"
    )

    # Find out the ticket won!
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

    create_json_file(results_df, "results")
    # TODO: Add season team to results

    create_site_metadata()
