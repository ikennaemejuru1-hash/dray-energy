#!/usr/bin/env python3
"""Generate optimised WebP + JPEG derivatives, og-image and favicons.

Usage (from repo root): python3 tools/optimize_images.py
Requires Pillow. Originals in IMAGES/ are only read, never written.
Outputs are deterministic, so running twice gives the same files.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "IMAGES"
WIDTHS = [480, 800, 1200, 1600]


def load(name):
    return Image.open(IMG / name).convert("RGB")


def save_pair(im, stem):
    im.save(IMG / f"{stem}.webp", "WEBP", quality=78, method=6)
    im.save(IMG / f"{stem}.jpg", "JPEG", quality=68, optimize=True, progressive=True)


def resized(im, width):
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)


def responsive(im, prefix):
    """Write width variants, never upscaling; the source width is the largest."""
    widths = [w for w in WIDTHS if w < im.width] + [im.width]
    for w in widths:
        save_pair(im if w == im.width else resized(im, w), f"{prefix}-{w}")


def main():
    t1 = load("diesel truck 1.jpeg")
    t2 = load("diesel truck 2.jpeg")
    logo = load("logo.jpeg")

    responsive(t1, "truck-1")
    responsive(t2, "truck-2")
    responsive(logo, "logo")

    # Art-directed portrait crop of truck 1 (4:5), keeps the cab and tanker wheels.
    mobile = t1.crop((250, 0, 250 + 574, 717))
    for w in (480, 574):
        save_pair(mobile if w == 574 else resized(mobile, w), f"truck-1-mobile-{w}")

    # Open Graph image, 1200x630. Source is 1080 wide so this is a slight upscale.
    og = t1.crop((0, 75, 1080, 75 + 567)).resize((1200, 630), Image.LANCZOS)
    og.save(IMG / "og-image.jpg", "JPEG", quality=82, optimize=True, progressive=True)

    # Favicons from the gear and flame mark at the left of the logo.
    icon = logo.crop((15, 60, 415, 460))
    icon.resize((32, 32), Image.LANCZOS).save(IMG / "favicon-32.png", optimize=True)
    icon.resize((180, 180), Image.LANCZOS).save(IMG / "apple-touch-icon.png", optimize=True)
    icon.resize((48, 48), Image.LANCZOS).save(
        IMG / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
    )


if __name__ == "__main__":
    main()
