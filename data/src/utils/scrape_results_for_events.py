import time
from concurrent.futures import ThreadPoolExecutor

import pandas
from src.constants.project_constants import EVENT_LIST_FILE_PATH
from src.constants.results_columns import OriginalResultsColumn
from src.utils.scrape_results_for_event import scrape_results_for_event
from src.utils.should_skip_event_result import should_skip_event_result


def scrape_results_for_events(limit=None):
    df = pandas.read_csv(EVENT_LIST_FILE_PATH)

    start_time = time.time()

    old_events_count = len(
        [
            event_id
            for event_id in df[OriginalResultsColumn.EVENT_ID]
            if should_skip_event_result(event_id)
        ]
    )
    new_events = [
        event_id
        for event_id in df[OriginalResultsColumn.EVENT_ID]
        if not should_skip_event_result(event_id)
    ]
    if limit:
        new_events = new_events[0:limit]
    events_count = len(new_events)

    if not events_count:
        print("There are no new events.")
        return

    print(
        f"Scraping results for all new events ({events_count}) | Skipping over old events ({old_events_count})..."
    )
    with ThreadPoolExecutor() as threads:
        threads.map(lambda event_id: scrape_results_for_event(event_id), new_events)
    print(
        f"Finished scraping results for events ({events_count}) in {(time.time() - start_time)} seconds."
    )
