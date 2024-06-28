import re


def get_first_name(full_name: str):
    return re.sub(r"^(.+),(.+)$", "\\2", full_name).strip()


def get_last_name(full_name: str):
    return re.sub(r"^(.+),(.+)$", "\\1", full_name).strip()


def convert_full_name(full_name: str):
    return re.sub(r"^(.+),(.+)$", "\\2 \\1", full_name).strip()
