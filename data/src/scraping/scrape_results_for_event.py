import csv
import os
import warnings

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from src.constants.project_constants import RESULTS_URL, WAIT_TIME
from src.constants.results_columns import RESULTS_HEADERS
from src.scraping.util.create_webdriver import create_webdriver
from src.scraping.util.get_event_file_path import get_event_file_path
from src.scraping.util.should_skip_event_result import should_skip_event_result


def scrape_results_for_event(event_id):
    driver = create_webdriver()

    if should_skip_event_result(event_id):
        print(f"Skipping scraping for event {event_id}.")
        return

    print(f"Scraping results for event {event_id}...")
    driver.get(f"{RESULTS_URL}?event={event_id}")

    try:
        table = WebDriverWait(driver, WAIT_TIME).until(
            EC.visibility_of_element_located((By.ID, "Resultlist"))
        )
    except TimeoutException as e:
        warnings.warn(
            f"[scrape_results_for_event] Failed to get table after {WAIT_TIME} seconds. The site is probably down."
        )
        raise e

    event_file_path = get_event_file_path(event_id)
    os.makedirs(os.path.dirname(event_file_path), exist_ok=True)
    with open(event_file_path, "w", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(RESULTS_HEADERS)
        for tr in table.find_element(By.TAG_NAME, "tbody").find_elements(
            By.TAG_NAME, "tr"
        ):
            writer.writerow(
                [event_id]
                + [td.text.strip() for td in tr.find_elements(By.TAG_NAME, "td")]
            )

    print(f"Finished scraping results for event {event_id}.")
    driver.close()
