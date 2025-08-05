import os
import json
from datetime import datetime

# 仓库根目录
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ICON_DIR = os.path.join(ROOT_DIR, 'icon')               
JSON_FILE = os.path.join(ROOT_DIR, 'qxy_icons.json')      

# GitHub Raw 图标访问路径
GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/QiXiuYuano/Profiles/main'

def generate_json():
    icons = []

    if not os.path.exists(ICON_DIR):
        raise FileNotFoundError(f"图标目录不存在: {ICON_DIR}")

    for filename in os.listdir(ICON_DIR):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico')):
            icon_name = os.path.splitext(filename)[0]
            url = f'{GITHUB_RAW_BASE}/icon/{filename}'
            icons.append({"name": icon_name, "url": url})

    data = {
        "name": "QiXiuyuan自用图标库",
        "description": "存放、收集个人自用的图标",
        "icons": icons
    }

    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    generate_json()
