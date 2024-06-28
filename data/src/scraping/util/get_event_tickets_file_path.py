from src.constants.project_constants import BUILD_FOLDER


def get_event_tickets_file_path(season: int):
    return f"{BUILD_FOLDER}/event_tickets/{season}.csv"
