import pandas
import argparse

from src.utils.create_json_file import create_json_file
from src.utils.create_site_data import create_site_data
from src.utils.scrape_data import write_results_for_event_list, write_results_for_events

def create_site_metadata():
    data = {'lastUpdate': {
        'epoch': pandas.to_datetime('now')
    }}
    df = pandas.DataFrame(data=data)
    create_json_file(df, 'metadata', orient=None)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Create data for backyardultra.app", formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("-s", "--scrape", action="store_true", help="should scrape web")
    args = parser.parse_args()
    config = vars(args)
    print(f'config: {config}')

    if config['scrape']:
        write_results_for_event_list()
        write_results_for_events()
        
    create_site_data()
    create_site_metadata()