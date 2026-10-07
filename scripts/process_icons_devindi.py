import os
from PIL import Image

def remove_white_bg(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    newData = []
    for item in data:
        # If pixel is close to white, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    # Resize them to a smaller size, e.g., 120x120 which was the original size
    img = img.resize((120, 120), Image.Resampling.LANCZOS)
    img.save(out_path, "PNG")
    print(f"Saved {out_path}")

icons = [
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_code_1791344260267.jpg", "public/assets/icons/icon-book.png"),
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_algorithm_1791344271049.jpg", "public/assets/icons/icon-brain.png"),
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_coffee_dev_1791344280745.jpg", "public/assets/icons/icon-coffee.png"),
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_git_1791344290169.jpg", "public/assets/icons/icon-clock.png"),
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_bug_1791344301495.jpg", "public/assets/icons/icon-f.png"),
]

for in_p, out_p in icons:
    remove_white_bg(in_p, out_p)
