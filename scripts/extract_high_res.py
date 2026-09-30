import cv2
import numpy as np
import os
from PIL import Image

def remove_bg(img):
    img = img.convert("RGBA")
    data = img.getdata()
    
    newData = []
    for item in data:
        # Check if pixel is close to white/light gray
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    return img

def process_image():
    input_path = 'public/assets/lomasha-sprites.png'
    output_dir = 'public/assets/high_res'
    os.makedirs(output_dir, exist_ok=True)
    
    img = cv2.imread(input_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Threshold: anything darker than 240 is foreground
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    
    # Morphological operations to connect components of the same character
    kernel = np.ones((15,15), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=2)
    
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours by size
    boxes = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        area = w * h
        if area > 10000 and area < 300000: # large enough for a high-res sprite
            boxes.append((x, y, w, h, area))
            
    # Sort by y then x
    boxes.sort(key=lambda b: (b[1]//200, b[0]))
    
    pil_img = Image.open(input_path)
    
    for i, (x, y, w, h, area) in enumerate(boxes):
        # Add some padding
        pad = 10
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(img.shape[1], x + w + pad)
        y2 = min(img.shape[0], y + h + pad)
        
        crop = pil_img.crop((x1, y1, x2, y2))
        
        out_img = remove_bg(crop)
        
        bbox = out_img.getbbox()
        if bbox:
            out_img = out_img.crop(bbox)
            
        out_path = os.path.join(output_dir, f"sprite_{i}.png")
        out_img.save(out_path)
        print(f"Saved {out_path} (Area: {area})")

if __name__ == '__main__':
    process_image()
