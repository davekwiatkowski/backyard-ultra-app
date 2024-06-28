BUILD_FOLDER = 'build'
EVENT_LIST_FILE_NAME = 'event_list'
EVENT_LIST_FILE_PATH = f'{BUILD_FOLDER}/{EVENT_LIST_FILE_NAME}.csv'

WAIT_TIME = 60

RESULTS_URL_ENCODED = b'aHR0cHM6Ly9zdGF0aXN0aWsuZC11LXYub3JnL2dldHJlc3VsdGV2ZW50LnBocA=='
EVENTS_URL_ENCODED = b'aHR0cHM6Ly9zdGF0aXN0aWsuZC11LXYub3JnL2dldGV2ZW50bGlzdC5waHA='

RESULTS_HEADERS = ['EventId', 'Rank','Performance', "Surname, first name" , 'Club', 'Nat.', 'YOB','M/F','Rank M/F','Cat','Cat. Rank','hours','Age graded performance']