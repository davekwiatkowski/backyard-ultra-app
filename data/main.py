import argparse
import json
from time import time

from src.utils.create_json_file import create_json_file_from_data
from src.utils.create_site_data import create_site_data
from src.utils.scrape_event_list import scrape_event_list
from src.utils.scrape_results_for_events import scrape_results_for_events


def create_site_metadata():
    package_file = open("../site/package.json")
    package_json = json.load(package_file)
    data = {"lastUpdate": int(time() * 1000), "version": package_json["version"]}
    create_json_file_from_data(data, "metadata")


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
        scrape_event_list()
        scrape_results_for_events()

    create_site_data()
    create_site_metadata()
