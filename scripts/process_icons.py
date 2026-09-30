import os
import glob
from PIL import Image

def remove_bg(img):
    img = img.convert("RGBA")
    data = img.getdata()
    newData = []
    for item in data:
        # Check if pixel is white
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    return img

def process_icons():
    output_dir = 'public/assets/icons'
    os.makedirs(output_dir, exist_ok=True)
    
    # These are the paths to the generated images
    # We will pass them as command line arguments or hardcode them
    import sys
    files = sys.argv[1:]
    
    for f in files:
        name = os.path.basename(f).split('_')[1] # e.g. icon_book_123.jpg -> book
        img = Image.open(f)
        out_img = remove_bg(img)
        # resize to something reasonable like 100x100
        out_img.thumbnail((120, 120))
        out_path = os.path.join(output_dir, f"icon-{name}.png")
        out_img.save(out_path)
        print(f"Saved {out_path}")

if __name__ == '__main__':
    process_icons()
