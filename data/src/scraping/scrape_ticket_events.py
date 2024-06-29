from pathlib import Path

from src.scraping.util.get_ticket_events_file_path import get_ticket_events_file_path
from src.scraping.util.scrape_backyard_ultra_com_table import (
    scrape_backyard_ultra_com_table,
)


def scrape_ticket_events(season: int, url: str):
    file_path = get_ticket_events_file_path(season)
    if Path(file_path).is_file():
        print(
            f"Skipping ticket events creation. Already have the ticket races for season={season}."
        )
        return

    print("Scraping ticket events...")
    scrape_backyard_ultra_com_table(url, file_path)
    print(f"Finished scraping ticket events for season={season}.")
