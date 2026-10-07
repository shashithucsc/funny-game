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

    # Wider crop boxes to ensure we capture the whole sprite
    regions = {
        'run1': (280, 80, 500, 430),
        'run2': (460, 80, 680, 430),
        'run3': (630, 80, 850, 430),
        'run4': (800, 80, 1050, 430),
        'jump': (200, 420, 500, 750),
        'duck': (430, 500, 700, 750),
        'fall': (640, 530, 1000, 750),
        'celebrate': (0, 1080, 350, 1550),
        'sad': (280, 1080, 550, 1550),
        'getup': (640, 530, 1000, 750),
        'angry': (280, 1080, 550, 1550),
        'sleep': (280, 1080, 550, 1550),
    }
    
    # Target uniform size for all sprites to fix jitter/blinking in Phaser
    TARGET_WIDTH = 250
    TARGET_HEIGHT = 350
    
    for name, box in regions.items():
        crop = img.crop(box)
        bbox = crop.getbbox()
        
        # Create a blank uniform image
        final_img = Image.new("RGBA", (TARGET_WIDTH, TARGET_HEIGHT), (255, 255, 255, 0))
        
        if bbox:
            # Crop to the actual character pixels
            char_img = crop.crop(bbox)
            char_w, char_h = char_img.size
            
            # Align character to the bottom center of the target image
            # This ensures feet are always at the same level across frames
            paste_x = (TARGET_WIDTH - char_w) // 2
            paste_y = TARGET_HEIGHT - char_h - 10 # 10 pixels padding from bottom
            
            # For 'jump', elevate her slightly
            if name == 'jump':
                paste_y -= 40
                
            final_img.paste(char_img, (paste_x, max(0, paste_y)))
            
        out_path = os.path.join(output_dir, f"devindi-{name}.png")
        final_img.save(out_path)
        print(f"Saved {out_path}")

if __name__ == '__main__':
    process_image()
