"""Turn the white-background AGS logo into transparent brand assets (run via docker, see README)."""
from PIL import Image

SRC = "public/brand/ags-logo-source.png"
OUT = "public/brand"

img = Image.open(SRC).convert("RGB")
w, h = img.size
src = img.load()
out = Image.new("RGBA", (w, h))
dst = out.load()

for y in range(h):
    for x in range(w):
        r, g, b = src[x, y]
        # Alpha from distance to white; small threshold removes JPEG-ish background noise.
        a = max(0, 255 - min(r, g, b) - 12) * 255 // 243
        a = min(255, a * 3 // 2)
        if a == 0:
            dst[x, y] = (0, 0, 0, 0)
            continue
        f = a / 255
        # Un-blend from white so anti-aliased edges don't keep a white fringe.
        rr, gg, bb = (max(0, min(255, round((c - 255 * (1 - f)) / f))) for c in (r, g, b))
        dst[x, y] = (rr, gg, bb, a)

out = out.crop(out.getbbox())
out.save(f"{OUT}/ags-logo.png", optimize=True)

# Display-size version for header/footer (keeps file light).
small = out.copy()
small.thumbnail((240, 480), Image.LANCZOS)
small.save(f"{OUT}/ags-logo-480.png", optimize=True)


def square_icon(size: int, path: str, background=None):
    canvas = Image.new("RGBA", (size, size), background or (0, 0, 0, 0))
    mark = out.copy()
    mark.thumbnail((int(size * 0.86), int(size * 0.86)), Image.LANCZOS)
    canvas.paste(mark, ((size - mark.width) // 2, (size - mark.height) // 2), mark)
    canvas.save(path, optimize=True)


square_icon(64, f"{OUT}/favicon-64.png")
square_icon(180, f"{OUT}/apple-touch-icon.png", background=(247, 242, 233, 255))
square_icon(512, f"{OUT}/icon-512.png", background=(247, 242, 233, 255))
print("logo", out.size, "small", small.size)
