from src.utils.create_site_data import create_site_data
from src.utils.scrape_data import write_results_for_event_list, write_results_for_events

if __name__ == '__main__':
    write_results_for_event_list()
    write_results_for_events()
    create_site_data()