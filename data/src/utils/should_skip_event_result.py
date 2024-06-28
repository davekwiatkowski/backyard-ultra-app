from pathlib import Path

from src.utils.get_event_file_path import get_event_file_path


def should_skip_event_result(event_id):
    return Path(get_event_file_path(event_id)).is_file()
