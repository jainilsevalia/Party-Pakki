from pathlib import Path

import os
import json

def get_state_city_data():
    with open(os.path.join(Path(__file__).parent, "data/state-city.json")) as f:
            data = json.load(f)
    return data