#!/usr/bin/env python3
"""
מחולל נכסי המותג של קהילה על ארבע - og-default.jpg ו-icon.png.

מפיק שני קבצים תחת public/:
  • og-default.jpg  (1200×630)  - תמונת Open Graph / Twitter card לכל עמוד.
  • icon.png        (512×512)   - אייקון PWA + לוגו ל-JSON-LD (maskable-safe).

פלטת "קרם-לברדור" בלבד (ללא ירוקים):
  primary #c99a5b · accent #e8c887 · background #fbf7ef · dark #2a2018 · text #241a12

הטקסט בעברית עובר דרך python-bidi (סדר ויזואלי נכון RTL), והרינדור נעשה
בסופר-סמפלינג ×4 לקצוות חלקים. הרצה:  python3 scripts/generate-brand-assets.py
"""

from __future__ import annotations
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from bidi.algorithm import get_display

# ── פלטה ───────────────────────────────────────────────────────────────────
PRIMARY = (201, 154, 91)    # #c99a5b
ACCENT = (232, 200, 135)    # #e8c887
BG = (251, 247, 239)        # #fbf7ef
DARK = (42, 32, 24)         # #2a2018
TEXT = (36, 26, 18)         # #241a12

FONT_PATH = "/System/Library/Fonts/SFHebrewRounded.ttf"  # רך וידידותי - מתאים למותג
# SF Hebrew Rounded חסר גליפים לטיניים - לטקסט לטיני (כתובת האתר) נשתמש בפונט תואם.
LATIN_FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public")


# ── עזרי צבע ────────────────────────────────────────────────────────────────
def mix(a, b, t):
    """ערבוב לינארי בין שני צבעים, t∈[0,1]."""
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vertical_gradient(size, top, bottom):
    """תמונת RGB עם מעבר אנכי חלק בין שני צבעים."""
    w, h = size
    grad = Image.new("RGB", (1, h))
    px = grad.load()
    for y in range(h):
        px[0, y] = mix(top, bottom, y / max(1, h - 1))
    return grad.resize((w, h))


# ── טביעת כף רגל (מוטיב המותג) ──────────────────────────────────────────────
def _ellipse(size_wh, color, angle=0):
    """כרית אליפטית בודדת על אריח שקוף, מסובבת בזווית נתונה (anti-aliased)."""
    w, h = size_wh
    pad = max(w, h)
    tile = Image.new("RGBA", (w + pad, h + pad), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)
    d.ellipse([pad // 2, pad // 2, pad // 2 + w, pad // 2 + h], fill=color)
    if angle:
        tile = tile.rotate(angle, expand=True, resample=Image.BICUBIC)
    return tile


def draw_paw(target, cx, cy, s, color):
    """
    מציירת טביעת כף רגל ממורכזת ב-(cx, cy) עם "מפתח אצבעות" ברוחב ~s.
    כרית מרכזית גדולה + 4 בהונות מסודרות בקשת מעליה.
    """
    rgba = color if len(color) == 4 else color + (255,)
    # כרית מרכזית
    pad_w, pad_h = int(0.60 * s), int(0.54 * s)
    main = _ellipse((pad_w, pad_h), rgba)
    target.alpha_composite(main, (int(cx - main.width / 2),
                                  int(cy + 0.30 * s - main.height / 2)))
    # בהונות: (dx, dy, rx, ry, angle)
    toes = [
        (-0.33, -0.05, 0.135, 0.175, 25),
        (-0.13, -0.28, 0.145, 0.195, 10),
        (0.13, -0.28, 0.145, 0.195, -10),
        (0.33, -0.05, 0.135, 0.175, -25),
    ]
    for dx, dy, rx, ry, ang in toes:
        toe = _ellipse((int(2 * rx * s), int(2 * ry * s)), rgba, ang)
        target.alpha_composite(
            toe, (int(cx + dx * s - toe.width / 2),
                  int(cy + dy * s - toe.height / 2)))


# ── טקסט ────────────────────────────────────────────────────────────────────
def draw_centered(draw, cx, y, text, font, fill, stroke=0, stroke_fill=None):
    """מצייר טקסט עברי (bidi) ממורכז אופקית סביב cx, עם top ב-y."""
    vis = get_display(text)
    l, t, r, b = draw.textbbox((0, 0), vis, font=font,
                               stroke_width=stroke)
    draw.text((cx - (r - l) / 2 - l, y - t), vis, font=font, fill=fill,
              stroke_width=stroke, stroke_fill=stroke_fill or fill)
    return b - t  # גובה ויזואלי


# ── icon.png (512×512) ─────────────────────────────────────────────────────
def build_icon(ss=4):
    D = 512 * ss
    # רקע מלא-בליד: מעבר זהב accent→primary (שורד כל מסיכת maskable)
    base = vertical_gradient((D, D), ACCENT, PRIMARY).convert("RGBA")

    # הילה רכה בהירה בחלק העליון לעומק
    glow = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([D * 0.12, -D * 0.30, D * 0.88, D * 0.55],
               fill=ACCENT + (120,))
    glow = glow.filter(ImageFilter.GaussianBlur(D * 0.06))
    base.alpha_composite(glow)

    cx = cy = D / 2
    cy_paw = cy - 0.0475 * (290 * ss)   # מירכוז אנכי של ה-bbox של הכף
    s = 290 * ss

    # צל רך מתחת לכף
    shadow = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    draw_paw(shadow, cx, cy_paw + 9 * ss, s, DARK + (110,))
    shadow = shadow.filter(ImageFilter.GaussianBlur(11 * ss))
    base.alpha_composite(shadow)

    # הכף עצמה בקרם
    draw_paw(base, cx, cy_paw, s, BG)

    icon = base.convert("RGB").resize((512, 512), Image.LANCZOS)
    path = os.path.join(OUT_DIR, "icon.png")
    icon.save(path, "PNG", optimize=True)
    return path


# ── og-default.jpg (1200×630) ──────────────────────────────────────────────
def build_og(ss=4):
    W, H = 1200 * ss, 630 * ss
    base = Image.new("RGBA", (W, H), BG + (255,))

    # עיגולי זהב רכים בפינות (חום-זהב, ללא ירוק) לחמימות
    soft = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(soft)
    R = 360 * ss
    sd.ellipse([-R * 0.55, -R * 0.55, R * 0.55, R * 0.55], fill=ACCENT + (90,))
    sd.ellipse([W - R * 0.5, H - R * 0.5, W + R * 0.5, H + R * 0.5],
               fill=PRIMARY + (70,))
    soft = soft.filter(ImageFilter.GaussianBlur(60 * ss))
    base.alpha_composite(soft)

    # כפות עדינות-מאוד בפינות (מוטיב חוזר)
    faint = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_paw(faint, W * 0.90, H * 0.80, 150 * ss, PRIMARY + (28,))
    draw_paw(faint, W * 0.12, H * 0.26, 110 * ss, PRIMARY + (22,))
    base.alpha_composite(faint)

    draw = ImageDraw.Draw(base)

    # מטבע זהב ממורכז עם כף קרם - מיני סמל המותג
    coin_cx, coin_cy, coin_r = W / 2, 132 * ss, 80 * ss
    coin = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cd = ImageDraw.Draw(coin)
    # צל עדין למטבע
    cd.ellipse([coin_cx - coin_r, coin_cy - coin_r + 6 * ss,
                coin_cx + coin_r, coin_cy + coin_r + 6 * ss], fill=DARK + (60,))
    coin = coin.filter(ImageFilter.GaussianBlur(9 * ss))
    base.alpha_composite(coin)
    draw.ellipse([coin_cx - coin_r, coin_cy - coin_r,
                  coin_cx + coin_r, coin_cy + coin_r], fill=PRIMARY)
    draw.ellipse([coin_cx - coin_r, coin_cy - coin_r,
                  coin_cx + coin_r, coin_cy + coin_r],
                 outline=ACCENT, width=4 * ss)
    draw_paw(base, coin_cx, coin_cy - 0.0475 * 95 * ss, 95 * ss, BG)

    # wordmark "קהילה על ארבע"
    f_word = ImageFont.truetype(FONT_PATH, 158 * ss)
    draw_centered(draw, W / 2, 250 * ss, "קהילה על ארבע", f_word, DARK,
                  stroke=2 * ss)

    # קו זהב מפריד
    line_w, line_h = 150 * ss, 7 * ss
    ly = 432 * ss
    draw.rounded_rectangle(
        [W / 2 - line_w / 2, ly, W / 2 + line_w / 2, ly + line_h],
        radius=line_h / 2, fill=PRIMARY)

    # tagline
    f_tag = ImageFont.truetype(FONT_PATH, 50 * ss)
    draw_centered(draw, W / 2, 462 * ss,
                  "קהילת בעלי הכלבים ", f_tag, TEXT)

    # כתובת האתר (לטינית, LTR) - פונט לטיני נפרד + ריווח אותיות קל
    f_url = ImageFont.truetype(LATIN_FONT_PATH, 30 * ss)
    url = "walkonfour.org"
    tracking = 4 * ss
    widths = [f_url.getbbox(ch)[2] for ch in url]
    total = sum(widths) + tracking * (len(url) - 1)
    x = W / 2 - total / 2
    _, t0, _, b0 = f_url.getbbox(url)
    y = 548 * ss - t0
    for ch, cw in zip(url, widths):
        draw.text((x, y), ch, font=f_url, fill=PRIMARY)
        x += cw + tracking

    og = base.convert("RGB").resize((1200, 630), Image.LANCZOS)
    path = os.path.join(OUT_DIR, "og-default.jpg")
    og.save(path, "JPEG", quality=92, optimize=True, progressive=True)
    return path


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    p1 = build_icon()
    p2 = build_og()
    for p in (p1, p2):
        print(f"wrote {p}  ({os.path.getsize(p) // 1024} KB)")
