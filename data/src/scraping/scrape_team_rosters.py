from pathlib import Path

from src.scraping.util.get_team_rosters_file_path import get_team_rosters_file_path
from src.scraping.util.scrape_backyard_ultra_com_table import (
    scrape_backyard_ultra_com_table,
)


def scrape_team_rosters(season: int, url: str):
    file_path = get_team_rosters_file_path(season)
    if Path(file_path).is_file():
        print(
            f"Skipping team rosters creation. Already have the team rosters for season={season}."
        )
        return

    print("Scraping team rosters...")
    scrape_backyard_ultra_com_table(url, file_path)
    print(f"Finished scraping team rosters for season={season}.")
