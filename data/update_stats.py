from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
import time

from src.constants.project_constants import BUILD_FOLDER
from create_json_files import create_json_files
from src.utils.get_root import get_root

def create_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    path =  f"{get_root()}/{BUILD_FOLDER}"
    options.add_experimental_option('prefs', {'download.default_directory' : path})
    return webdriver.Chrome(options=options)

def update_stats():
    driver = create_driver()
    driver.get('https://backyardultra.com/world-rankings/')
    download_csv_button = WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, "//button[text()='CSV']")))
    download_csv_button.click();
    print('Downloading CSV')
    time.sleep(5) 
    driver.close()
    create_json_files()

if __name__ == '__main__':
    update_stats()