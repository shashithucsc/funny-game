import os
from PIL import Image, ImageDraw

def remove_bg(img):
    img = img.convert("RGBA")
    
    # We will floodfill the background with magenta from the 4 corners
    w, h = img.size
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]
    
    # We need an RGB image for floodfill to avoid alpha issues
    temp_img = img.convert("RGB")
    
    for cx, cy in corners:
        # Check if the corner is close to white before flood filling
        pixel = temp_img.getpixel((cx, cy))
        if pixel[0] > 240 and pixel[1] > 240 and pixel[2] > 240:
            ImageDraw.floodfill(temp_img, (cx, cy), (255, 0, 255), thresh=20)
            
    # Now map magenta back to transparent in the original RGBA image
    temp_data = temp_img.getdata()
    orig_data = img.getdata()
    
    newData = []
    for i in range(len(temp_data)):
        if temp_data[i] == (255, 0, 255):
            newData.append((255, 255, 255, 0))
        else:
            newData.append(orig_data[i])
            
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
