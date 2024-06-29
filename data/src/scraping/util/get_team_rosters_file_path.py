from src.constants.project_constants import BUILD_FOLDER


def get_team_rosters_file_path(season: int):
    return f"{BUILD_FOLDER}/team-rosters/{season}.csv"
