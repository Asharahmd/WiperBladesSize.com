# Images to make

**Status (2026-10-28):** all 25 delivered by the owner (AI-generated, checked against Bosch and Denso diagrams, not photos of real hardware) and wired in. Use this list as the spec when an image is replaced.

Save every file as **WebP** in `public/images/` under the exact path given, then tell Claude to wire them in (alt text and layout are handled in code).

General rules:
- One style for the whole site: real-looking photos, daylight, clean background, no text on the image.
- No brand logos and no product packaging (no Bosch/Rain-X boxes). Product photos come later from Amazon PA-API.
- Connector and step photos must be **accurate**. AI tools often draw the clip wrong; check it against a real arm before using it.
- Sizes: "wide" = 1600×900, "card" = 1200×800, "square" = 800×800. Keep each file under 150 KB.

## 1. Site-wide (2)

| File | Size | What it shows |
|---|---|---|
| `og-default.webp` | 1200×630 | Share image for social and Google Discover: a windshield with both wipers on a rainy day, space on the left for nothing (no text) |
| `hero.webp` | 1600×900 | Home hero background: close-up of a wiper blade on a wet windshield, dark enough that white text reads on it |

## 2. Home page (2)

| File | Size | What it shows |
|---|---|---|
| `home/two-blades.webp` | 1200×800 | Windshield seen from the front: long blade on the driver side, shorter one on the passenger side (section "Why the two front blades differ") |
| `home/connector.webp` | 1200×800 | Close-up of where a blade clips onto the arm (section "Check the connector too") |

## 3. Connector types page (6)

One close-up per arm tip, same angle and background in all six, blade removed so the arm end is clear.

| File | Size | What it shows |
|---|---|---|
| `connectors/j-hook.webp` | square | U-shaped hook at the end of the arm |
| `connectors/push-button.webp` | square | Flat arm end with a button on top |
| `connectors/pinch-tab.webp` | square | Blade adapter with two side tabs you squeeze |
| `connectors/side-pin.webp` | square | Arm with a pin sticking out of its side |
| `connectors/bayonet.webp` | square | Narrow flat arm end that slides into the blade |
| `connectors/top-lock.webp` | square | Flat arm end that locks from the top (newer GM) |

## 4. Guides (15)

Every guide gets a cover (`cover.webp`, card size, also used as its share image). The others sit inside the article.

### how-to-measure-wiper-blades
| File | What it shows |
|---|---|
| `guides/measure/cover.webp` | Tape measure held along a wiper blade's rubber strip |
| `guides/measure/too-long.webp` | Parked blade overhanging the windshield edge (blade too long) |

### how-to-change-wiper-blades
| File | What it shows |
|---|---|
| `guides/change/cover.webp` | Hands replacing a wiper blade, arm lifted |
| `guides/change/towel.webp` | Folded towel on the windshield under a raised arm |
| `guides/change/j-hook-out.webp` | Blade turned at a right angle, being slid out of the J-hook |
| `guides/change/j-hook-in.webp` | New blade being pulled up into the hook |
| `guides/change/push-button.webp` | Thumb pressing the button, blade sliding off |
| `guides/change/pinch-tab.webp` | Fingers squeezing the two tabs |

### beam-vs-conventional-vs-hybrid
| File | What it shows |
|---|---|
| `guides/types/cover.webp` | The three blade types side by side on a plain background, top to bottom: conventional (metal frame), beam (flat, no frame), hybrid (frame under a plastic shell) |

### how-often-to-replace-wiper-blades
| File | What it shows |
|---|---|
| `guides/replace/cover.webp` | Streaks left on a windshield after a wipe |
| `guides/replace/cracked.webp` | Close-up of cracked, split rubber on an old blade |

### winter-wiper-blades
| File | What it shows |
|---|---|
| `guides/winter/cover.webp` | Wiper blade covered in ice and snow |
| `guides/winter/winter-blade.webp` | Winter blade with a rubber boot over the frame |

### rear-wiper-blades
| File | What it shows |
|---|---|
| `guides/rear/cover.webp` | Rear wiper on an SUV hatch window |
| `guides/rear/mount.webp` | Close-up of where a rear blade meets its arm |

## Total: 25 images

## Not needed now
- Car pages: the body-type icons are drawn in code. Real car photos for the top models come later (Wikimedia, credited).
- Blade product photos: need Amazon PA-API after Associates approval; don't make these.
- Logo and favicon: already SVG in code.
