import re

def convert_backyard_date(date: str):
    original_date = date
    try:
        date = re.sub(r'([\d]+)\.([\d]+)\.([\d]+)\-([\d]+)\.([\d]+)\.([\d]+)', '\\3-\\2-\\1', date)
        date = re.sub(r'([\d]+)\.([\d]+)\.\-([\d]+)\.([\d]+)\.([\d]+)', '\\5-\\2-\\1', date)
        date = re.sub(r'([\d]+)\.\-([\d]+)\.([\d]+)\.([\d]+)', '\\4-\\3-\\1', date)
        date = re.sub(r'([\d]+)\.([\d]+)\.([\d]+)', '\\3-\\2-\\1', date)
        return date
    except:
        print(date)
        raise Exception(f'[convert_backyard_date] Failed with date: {original_date}')