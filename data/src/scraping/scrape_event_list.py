import csv
import os
import time
import warnings
from urllib.parse import parse_qs, urlparse

from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from src.constants.project_constants import EVENT_LIST_FILE_PATH, EVENTS_URL, WAIT_TIME
from src.constants.results_columns import OriginalResultsColumn
from src.scraping.util.create_webdriver import create_webdriver


def scrape_event_list():
    print("Scraping event list...")
    start_time = time.time()
    driver = create_webdriver()
    page = 1
    while True:
        print(f"Scraping page {page}...")
        driver.get(
            f"{EVENTS_URL}?year=all&dist=all&country=all&surface=Backy&sort=1&page={page}"
        )

        try:
            table = WebDriverWait(driver, WAIT_TIME).until(
                EC.visibility_of_element_located((By.ID, "Resultlist"))
            )
        except TimeoutException as e:
            warnings.warn(
                f"[scrape_results_for_event] Failed to get table after {WAIT_TIME} seconds. The site is probably down."
            )
            raise e

        os.makedirs(os.path.dirname(EVENT_LIST_FILE_PATH), exist_ok=True)
        with open(
            EVENT_LIST_FILE_PATH, "w" if page == 1 else "a", newline=""
        ) as csv_file:
            writer = csv.writer(csv_file)
            if page == 1:
                for tr in table.find_element(By.TAG_NAME, "thead").find_elements(
                    By.TAG_NAME, "tr"
                ):
                    writer.writerow(
                        [OriginalResultsColumn.EVENT_ID]
                        + [
                            th.text.strip()
                            for th in tr.find_elements(By.TAG_NAME, "th")
                        ]
                    )
            for tr in table.find_element(By.TAG_NAME, "tbody").find_elements(
                By.TAG_NAME, "tr"
            ):
                try:
                    url = tr.find_element(By.TAG_NAME, "a").get_attribute("href")
                    parsed_url = urlparse(url)
                    event_id = parse_qs(parsed_url.query)["event"][0]
                    writer.writerow(
                        [event_id]
                        + [
                            td.text.strip()
                            for td in tr.find_elements(
                                By.XPATH, ".//td[not(@class='KategorieHeader')]"
                            )
                        ]
                    )
                except NoSuchElementException:
                    continue

        print(f"Finished scraping page {page}.")

        try:
            driver.find_element(By.XPATH, "//div[@class='pagination']/a[text()='>>']")
            page += 1
        except NoSuchElementException:
            print(
                f"Finished scraping event list in {(time.time() - start_time)} seconds."
            )
            break

    driver.close()
