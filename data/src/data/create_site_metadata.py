import json
from time import time

from src.util.create_json_file_from_data import create_json_file_from_data


def create_site_metadata():
    package_file = open("../site/package.json")
    package_json = json.load(package_file)
    data = {"lastUpdate": int(time() * 1000), "version": package_json["version"]}
    create_json_file_from_data(data, "metadata")
