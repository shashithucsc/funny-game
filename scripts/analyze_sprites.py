from PIL import Image

def find_components():
    img = Image.open('public/assets/devindi-sprites.png').convert('RGB')
    w, h = img.size
    pixels = img.load()

    # Create a binary matrix
    fg = [[False] * h for _ in range(w)]
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r < 240 or g < 240 or b < 240:
                fg[x][y] = True

    visited = [[False] * h for _ in range(w)]
    components = []

    # BFS
    for y in range(h):
        for x in range(w):
            if fg[x][y] and not visited[x][y]:
                q = [(x, y)]
                visited[x][y] = True
                min_x, max_x = x, x
                min_y, max_y = y, y
                
                head = 0
                while head < len(q):
                    cx, cy = q[head]
                    head += 1
                    
                    if cx < min_x: min_x = cx
                    if cx > max_x: max_x = cx
                    if cy < min_y: min_y = cy
                    if cy > max_y: max_y = cy
                    
                    # 8-way connectivity
                    for dx in [-2, -1, 0, 1, 2]:
                        for dy in [-2, -1, 0, 1, 2]:
                            nx, ny = cx + dx, cy + dy
                            if 0 <= nx < w and 0 <= ny < h:
                                if fg[nx][ny] and not visited[nx][ny]:
                                    visited[nx][ny] = True
                                    q.append((nx, ny))
                
                # Ignore very small components (noise)
                if (max_x - min_x) > 30 and (max_y - min_y) > 30:
                    components.append((min_x, min_y, max_x, max_y))

    # Sort components by approx Y, then X
    components.sort(key=lambda b: ((b[1] + b[3]) // (2 * 400), b[0]))
    
    for i, c in enumerate(components):
        print(f"Sprite {i}: box={c} (w={c[2]-c[0]}, h={c[3]-c[1]})")

if __name__ == '__main__':
    find_components()
