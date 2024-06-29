import argparse

from src.data.create_event_tickets_data import create_event_tickets_data
from src.data.create_events_data import create_events_data
from src.data.create_site_metadata import create_site_metadata
from src.data.create_site_results_data import create_site_results_data
from src.scraping.scrape_event_list import scrape_event_list
from src.scraping.scrape_event_tickets import scrape_event_tickets
from src.scraping.scrape_results_for_events import scrape_results_for_events

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
        scrape_event_tickets()
        scrape_event_list()
        scrape_results_for_events()

    results_df = create_site_results_data()
    events_df = create_events_data(results_df)
    create_event_tickets_data(events_df)
    create_site_metadata()
