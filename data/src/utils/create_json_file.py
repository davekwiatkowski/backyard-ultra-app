import json
import os


def create_json_file(df, file_name, orient="records"):
    json_file_name = f"../site/src/data/{file_name}.json"
    os.makedirs(os.path.dirname(json_file_name), exist_ok=True)
    # groups = df.groupby("name")
    # out = groups.apply(lambda g: g.to_dict(orient='records')).to_json()
    out = df.to_json(orient=orient)
    parsed = json.loads(out)
    with open(json_file_name, "w") as json_file:
        json.dump(parsed, json_file, indent=2)
        print(f"Created JSON file {json_file_name}")


def create_json_file_from_data(data, file_name):
    json_file_name = f"../site/src/data/{file_name}.json"
    os.makedirs(os.path.dirname(json_file_name), exist_ok=True)
    with open(json_file_name, "w") as json_file:
        json.dump(data, json_file, indent=2)
        print(f"Created JSON file {json_file_name}")
