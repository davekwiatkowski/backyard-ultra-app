import argparse

from src.constants.project_constants import TEAM_ROSTER_URL_2024, TICKET_EVENTS_URL
from src.data.create_events_from_results import create_events_from_results
from src.data.create_results import create_results
from src.data.create_site_metadata import create_site_metadata
from src.data.create_ticket_events import create_ticket_events
from src.data.create_ticket_events_from_team_rosters import (
    create_ticket_events_from_team_rosters,
)
from src.data.util.add_awards_to_results import add_awards_to_results
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
    results_df = add_awards_to_results(results_df, ticket_events_df)

    create_json_file(results_df, "results")
    # TODO: Add season team to results

    create_site_metadata()
