import os
from PIL import Image

def process_image():
    input_path = 'public/assets/devindi-sprites.png'
    output_dir = 'public/assets/character'
    os.makedirs(output_dir, exist_ok=True)
    
    img = Image.open(input_path).convert("RGBA")
    
    # We will globally replace anything close to white with transparent
    data = img.getdata()
    newData = []
    for item in data:
        # Close to white (240+) -> transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)

    # Exact tight bounding boxes found via Connected Component Analysis
    regions = {
        'run1': (55, 128, 250, 424),
        'run2': (291, 129, 484, 425),
        'run3': (504, 126, 706, 425),
        'run4': (736, 125, 947, 430),
        'jump': (44, 471, 211, 700),
        'duck': (236, 529, 392, 706),
        'fall': (436, 594, 702, 693),
        'getup': (747, 536, 961, 702),
        'celebrate': (201, 978, 418, 1218),
        'sad': (590, 1038, 809, 1224),
        'angry': (590, 1038, 809, 1224),
        'sleep': (590, 1038, 809, 1224),
    }
    
    # Target uniform size for all sprites to fix jitter/blinking in Phaser
    TARGET_WIDTH = 280
    TARGET_HEIGHT = 360
    
    for name, box in regions.items():
        # Box is already tight, so we just crop it directly
        char_img = img.crop(box)
        char_w, char_h = char_img.size
        
        # Create a blank uniform image
        final_img = Image.new("RGBA", (TARGET_WIDTH, TARGET_HEIGHT), (255, 255, 255, 0))
        
        # Align character to the bottom center of the target image
        # This ensures feet are always at the same level across frames
        paste_x = (TARGET_WIDTH - char_w) // 2
        paste_y = TARGET_HEIGHT - char_h - 10 # 10 pixels padding from bottom
        
        # For 'jump', elevate her slightly
        if name == 'jump':
            paste_y -= 50
            
        final_img.paste(char_img, (paste_x, max(0, paste_y)))
        
        out_path = os.path.join(output_dir, f"devindi-{name}.png")
        final_img.save(out_path)
        print(f"Saved {out_path} (from {box})")

if __name__ == '__main__':
    process_image()
