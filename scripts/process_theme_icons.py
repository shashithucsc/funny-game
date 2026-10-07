import os
from PIL import Image

def remove_white_bg(img_path, out_path, size):
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
    img = img.resize(size, Image.Resampling.LANCZOS)
    img.save(out_path, "PNG")
    print(f"Saved {out_path}")

# Process Chaser (make him slightly larger than devindi, maybe 300x300)
remove_white_bg(r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\chaser_1791345454008.jpg", "public/assets/character/chaser.png", (300, 300))

# Process Icons (120x120)
icons = [
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_ring_1791345465396.jpg", "public/assets/icons/icon-ring.png"),
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_bouquet_1791345476868.jpg", "public/assets/icons/icon-bouquet.png"),
    (r"C:\Users\Shashith\.gemini\antigravity-ide\brain\6b7d1a82-0e2b-47ec-ac84-041634d2b12e\icon_shoes_1791345486800.jpg", "public/assets/icons/icon-shoes.png"),
]

for in_p, out_p in icons:
    remove_white_bg(in_p, out_p, (120, 120))
