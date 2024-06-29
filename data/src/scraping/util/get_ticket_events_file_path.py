from src.constants.project_constants import BUILD_FOLDER


def get_ticket_events_file_path(season: int):
    return f"{BUILD_FOLDER}/ticket-events/{season}.csv"
