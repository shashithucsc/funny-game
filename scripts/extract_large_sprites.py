import os
from PIL import Image

def remove_bg(img):
    img = img.convert("RGBA")
    data = img.getdata()
    newData = []
    for item in data:
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    return img

def process_image():
    input_path = 'public/assets/lomasha-sprites.png'
    output_dir = 'public/assets/character'
    os.makedirs(output_dir, exist_ok=True)
    
    img = Image.open(input_path)
    
    regions = {
        'run1': (315, 100, 480, 410),
        'run2': (480, 100, 650, 410),
        'run3': (650, 100, 830, 410),
        'run4': (830, 100, 1010, 410),
        'jump': (240, 440, 480, 730),
        'duck': (460, 520, 670, 730),
        'fall': (670, 550, 980, 730),
        'celebrate': (10, 1100, 310, 1500),
        'sad': (310, 1100, 520, 1500),
        'getup': (670, 550, 980, 730), # Fallback to fall
        'angry': (310, 1100, 520, 1500), # Fallback to sad
        'sleep': (310, 1100, 520, 1500), # Fallback to sad
    }
    
    for name, box in regions.items():
        crop = img.crop(box)
        out_img = remove_bg(crop)
        out_path = os.path.join(output_dir, f"lomasha-{name}.png")
        out_img.save(out_path)
        print(f"Saved {out_path}")

if __name__ == '__main__':
    process_image()
