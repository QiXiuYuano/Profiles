import os
import json
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ICON_DIR = os.path.join(BASE_DIR, 'icon')
JSON_FILE = os.path.join(BASE_DIR, 'qxy_icons.json')

GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/QiXiuYuano/Profiles/main/Surge'

def generate_json():
    icons = []
    for filename in os.listdir(ICON_DIR):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.svg', '.webp')):
            icon_name = os.path.splitext(filename)[0]
            url = f'{GITHUB_RAW_BASE}/icon/{filename}'
            icons.append({"name": icon_name, "url": url})

    # today = datetime.today().strftime('%y%m%d')
    data = {
        "name": "QiXiuyuan自用图标库",
        "description": f"存放其他公开图标库没有，但自用需要的图标",
        "icons": icons
    }

    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    generate_json()
