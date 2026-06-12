#!/usr/bin/env python3
import json
import re
from collections import defaultdict

# Read the Figma JSON file
with open('figma-tokens.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract color and typography information
def extract_colors_and_fonts(obj, path="", result=None):
    if result is None:
        result = {"colors": defaultdict(dict), "typography": {}}
    
    if isinstance(obj, dict):
        # Check if this is a color object
        if "fills" in obj and obj["fills"]:
            fill = obj["fills"][0]
            if fill.get("type") == "SOLID":
                color = fill.get("color", {})
                name = obj.get("name", path)
                result["colors"][name] = {
                    "r": color.get("r"),
                    "g": color.get("g"),
                    "b": color.get("b"),
                    "a": color.get("a"),
                }
        
        # Check if this is a text/typography object
        if "style" in obj and isinstance(obj["style"], dict):
            style = obj["style"]
            if "fontFamily" in style:
                name = obj.get("name", path)
                result["typography"][name] = {
                    "fontFamily": style.get("fontFamily"),
                    "fontSize": style.get("fontSize"),
                    "fontWeight": style.get("fontWeight"),
                    "lineHeightPx": style.get("lineHeightPx"),
                    "letterSpacing": style.get("letterSpacing"),
                }
        
        for key, val in obj.items():
            extract_colors_and_fonts(val, path + "/" + key, result)
    
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            extract_colors_and_fonts(item, path + f"[{i}]", result)
    
    return result

# Also look for pages to identify design guide
pages = []
if "document" in data and "children" in data["document"]:
    for page in data["document"]["children"]:
        if page.get("type") == "CANVAS":
            pages.append(page.get("name"))

print("Pages found:", pages)
print("\nExtracting colors and typography...")

tokens = extract_colors_and_fonts(data)

print(f"\nColors found: {len(tokens['colors'])}")
print(f"Typography found: {len(tokens['typography'])}")

# Print sample colors (organized)
print("\n=== COLORS ===")
color_groups = defaultdict(dict)
for name, color in list(tokens["colors"].items())[:20]:
    print(f"{name}: rgb({color['r']}, {color['g']}, {color['b']}, {color['a']})")

# Print sample typography
print("\n=== TYPOGRAPHY ===")
for name, typo in list(tokens["typography"].items())[:20]:
    print(f"{name}: {typo['fontFamily']} {typo['fontSize']}px weight:{typo['fontWeight']} lineHeight:{typo['lineHeightPx']}")
