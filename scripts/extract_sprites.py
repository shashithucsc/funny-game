import cv2
import numpy as np
import os
from rembg import remove
from PIL import Image

def remove_bg(img):
    img = img.convert("RGBA")
    data = img.getdata()
    
    newData = []
    for item in data:
        # Check if pixel is close to white/light gray
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    return img

def process_image():
    input_path = 'public/assets/lomasha-sprites.png'
    output_dir = 'public/assets/character'
    os.makedirs(output_dir, exist_ok=True)
    
    img = Image.open(input_path)
    # The grid of 12 images is roughly in the bottom right corner
    # Image size is 1024 x 1536
    # Let's crop manually
    grid_w, grid_h = 420, 310
    grid_x, grid_y = 560, 1140
    cell_w, cell_h = grid_w // 4, grid_h // 3
    
    labels = [
        "run1", "run2", "run3", "run4",
        "jump", "duck", "fall", "getup",
        "celebrate", "sad", "angry", "sleep"
    ]
    
    k = 0
    for i in range(3):
        for j in range(4):
            if k >= len(labels): break
            name = labels[k]
            k += 1
            
            box = (grid_x + j*cell_w, grid_y + i*cell_h, grid_x + (j+1)*cell_w, grid_y + (i+1)*cell_h)
            crop = img.crop(box)
            
            # Remove background using simple color key
            out_img = remove_bg(crop)
            
            # Crop to actual content
            bbox = out_img.getbbox()
            if bbox:
                out_img = out_img.crop(bbox)
                
            out_path = os.path.join(output_dir, f"lomasha-{name}.png")
            out_img.save(out_path)
            print(f"Saved {out_path}")

if __name__ == '__main__':
    process_image()
