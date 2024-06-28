from src.constants.project_constants import BUILD_FOLDER


def get_event_file_path(event_id):
    return f"{BUILD_FOLDER}/events/{event_id}.csv"
