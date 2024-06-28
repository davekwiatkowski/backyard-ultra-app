from selenium import webdriver
from src.constants.project_constants import BUILD_FOLDER
from src.utils.get_root import get_root


def create_webdriver():
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    path = f"{get_root()}/{BUILD_FOLDER}"
    options.add_experimental_option("prefs", {"download.default_directory": path})
    return webdriver.Chrome(options=options)
