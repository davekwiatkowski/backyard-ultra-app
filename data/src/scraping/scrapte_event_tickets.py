import csv
import os
import time
import warnings
from pathlib import Path

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from src.constants.project_constants import EVENT_TICKETS_URL, WAIT_TIME
from src.scraping.util.create_webdriver import create_webdriver
from src.scraping.util.get_event_tickets_file_path import get_event_tickets_file_path


def scrape_event_tickets(season=2024):
    event_tickets_file_path = get_event_tickets_file_path(season)
    if Path(event_tickets_file_path).is_file():
        print(
            f"Skipping event tickets creation. Already have the silver ticket races for {season}..."
        )
        return

    print("Scraping event tickets...")
    start_time = time.time()
    driver = create_webdriver()
    driver.get(EVENT_TICKETS_URL)
    page = 1
    while True:
        print(f"Scraping page {page}...")

        try:
            table = WebDriverWait(driver, WAIT_TIME).until(
                EC.visibility_of_element_located((By.TAG_NAME, "table"))
            )
        except TimeoutException as e:
            warnings.warn(
                f"[scrape_event_tickets] Failed to get table after {WAIT_TIME} seconds. The site is probably down."
            )
            raise e

        os.makedirs(os.path.dirname(event_tickets_file_path), exist_ok=True)
        with open(
            event_tickets_file_path, "w" if page == 1 else "a", newline=""
        ) as csv_file:
            writer = csv.writer(csv_file)
            if page == 1:
                header_tr = table.find_element(
                    By.XPATH, "//thead/tr[@class='footable-header']"
                )
                writer.writerow(
                    [
                        th.text.strip()
                        for th in header_tr.find_elements(By.TAG_NAME, "th")
                    ]
                )
            for body_tr in table.find_elements(By.XPATH, "//tbody/tr"):
                tds = body_tr.find_elements(By.TAG_NAME, "td")
                writer.writerow([td.text.strip() for td in tds])

        print(f"Finished scraping page {page}.")

        try:
            next_button = driver.find_element(
                By.XPATH,
                "//li[@data-page='next' and not(@class='footable-page-nav disabled')]",
            )
            if next_button.is_enabled():
                next_button.find_element(By.TAG_NAME, "a").click()
                page += 1
                time.sleep(0.5)
        except:
            print(
                f"Finished scraping event tickets in {(time.time() - start_time)} seconds."
            )
            break

    driver.close()
