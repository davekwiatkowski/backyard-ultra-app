import re

def convert_backyard_date(date: str):
    date = re.sub(r'([\d]+)\.([\d]+)\.([\d]+)\-([\d]+)\.([\d]+)\.([\d]+)', '\\3-\\2-\\1', date)
    date = re.sub(r'([\d]+)\.([\d]+)\.\-([\d]+)\.([\d]+)\.([\d]+)', '\\5-\\2-\\1', date)
    date = re.sub(r'([\d]+)\.\-([\d]+)\.([\d]+)\.([\d]+)', '\\4-\\3-\\1', date)
    date = re.sub(r'([\d]+)\.([\d]+)\.([\d]+)', '\\3-\\2-\\1', date)
    return date