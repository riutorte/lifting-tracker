"""Generate PWA icons. Run: python3 scripts/make_icons.py

Creates three PNGs in assets/:
  - icon-192.png (192x192, 'any' purpose)
  - icon-512.png (512x512, 'any' purpose)
  - icon-512-maskable.png (512x512, 'maskable' — full bleed with safe zone)
"""
from PIL import Image, ImageDraw
from pathlib import Path

BG = (11, 18, 32, 255)            # --bg
ACCENT = (255, 107, 53, 255)      # --accent
PLATE = (232, 234, 240, 255)      # --text
OUT = Path(__file__).resolve().parent.parent / 'assets'
OUT.mkdir(exist_ok=True)


def draw_barbell(img, pad_ratio=0.10):
    w, h = img.size
    d = ImageDraw.Draw(img)
    # Bar: thin horizontal rectangle centered
    bar_h = h * 0.08
    bar_y0 = (h - bar_h) / 2
    bar_pad = w * pad_ratio
    d.rectangle([bar_pad, bar_y0, w - bar_pad, bar_y0 + bar_h], fill=ACCENT)

    # Inner plates (bigger)
    plate_w = w * 0.09
    plate_h = h * 0.46
    plate_y0 = (h - plate_h) / 2
    # Left inner
    x0 = bar_pad + w * 0.04
    d.rounded_rectangle([x0, plate_y0, x0 + plate_w, plate_y0 + plate_h],
                         radius=w * 0.02, fill=PLATE)
    # Right inner
    x1 = w - bar_pad - w * 0.04 - plate_w
    d.rounded_rectangle([x1, plate_y0, x1 + plate_w, plate_y0 + plate_h],
                         radius=w * 0.02, fill=PLATE)

    # Outer plates (smaller)
    op_w = w * 0.06
    op_h = h * 0.30
    op_y0 = (h - op_h) / 2
    # Left outer
    x2 = bar_pad - op_w * 0.3
    if x2 < 4:
        x2 = 4
    d.rounded_rectangle([x2, op_y0, x2 + op_w, op_y0 + op_h],
                         radius=w * 0.015, fill=PLATE)
    # Right outer
    x3 = w - bar_pad - op_w * 0.7
    if x3 + op_w > w - 4:
        x3 = w - 4 - op_w
    d.rounded_rectangle([x3, op_y0, x3 + op_w, op_y0 + op_h],
                         radius=w * 0.015, fill=PLATE)


def make_icon(size, maskable=False):
    img = Image.new('RGBA', (size, size), BG)
    # Maskable icons need a safe zone: art must fit inside the central 80%.
    pad = 0.14 if maskable else 0.08
    draw_barbell(img, pad_ratio=pad + 0.05)
    return img


def main():
    make_icon(192).save(OUT / 'icon-192.png', optimize=True)
    make_icon(512).save(OUT / 'icon-512.png', optimize=True)
    make_icon(512, maskable=True).save(OUT / 'icon-512-maskable.png', optimize=True)
    print('wrote icons to', OUT)


if __name__ == '__main__':
    main()
