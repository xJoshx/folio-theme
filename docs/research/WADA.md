# Sanzo Wada: corpus, provenance, and first candidates

Research snapshot: 2026-09-16.

Primary and working sources:

- National Diet Library record and IIIF source:
  https://ndlsearch.ndl.go.jp/books/R100000039-I1145831
- Publisher's modern edition:
  https://www.seigensha.com/books/978-4-86152-247-5/
- Machine-readable dataset and conversion notes:
  https://github.com/mattdesl/dictionary-of-colour-combinations
- Dataset license:
  https://raw.githubusercontent.com/mattdesl/dictionary-of-colour-combinations/master/LICENSE.md

## What “all Wada palettes” means

The classic corpus contains 348 combinations of two to four colors, drawn from
159 named colors. The National Diet Library exposes digitized originals with
an IIIF manifest and marks the record `pdm` (Public Domain Mark).

Matt DesLauriers' MIT-licensed dataset is the practical coding source: all 348
combination IDs plus color names, CMYK, Lab, RGB, and hex values. The hex values
are modern conversions, not values Wada wrote. They were converted from CMYK
using U.S. Web Coated SWOP v2 to sRGB IEC61966-2.1, relative colorimetric intent,
and black-point compensation. The maintainer explicitly warns that they can
differ from the printed swatches.

Therefore every selected value needs two provenance labels:

1. Wada combination ID and historical color name.
2. Modern sRGB conversion source/version.

The later applied/seasonal material published as Volume 2 is a separate corpus
and is not part of these 348 combinations. It should be a later research track,
not silently mixed into the classic dataset.

## Strongest Night Owl-like anchor

The clearest dark canvas is **Deep Indigo `#051230`**. It is chromatic,
blue-black rather than black, and appears in seven historical combinations.
That repeated anchor gives us a defensible way to build a larger editor palette:
combine colors that Wada already paired with the same indigo rather than making
an arbitrary rainbow.

| Combination | Other Wada colors | Contrast on Deep Indigo |
|---:|---|---:|
| 6 | Grenadine Pink `#F48067` | 7.16:1 |
| 28 | Madder Brown `#762C19` | 1.89:1 |
| 139 | Salvia Blue `#97ACC8`; Neutral Gray `#B6BFC1` | 7.97 / 9.87 |
| 155 | Jasper Red `#EB5324`; Benzol Green `#00978D` | 5.10 / 5.12 |
| 182 | Raw Sienna `#BB7125`; Vandyke Brown `#4B3317` | 4.84 / 1.57 |
| 211 | Apricot Orange `#F68C50`; Olive Yellow `#A6A159` | 7.74 / 6.92 |
| 232 | Carmine `#CC1236`; Pinkish Cinnamon `#EEB480` | 3.26 / 10.10 |

Ratios are our WCAG calculations against the dataset's sRGB conversion, not
claims made by Wada or the dataset maintainer.

## Candidate A — Deep Indigo constellation (recommended)

This is a documented synthesis, not one historical Wada combination. Every
accent did, however, appear with Deep Indigo in one of the combinations above.

| Theme intent | Candidate | Source combination |
|---|---|---:|
| Editor background | Deep Indigo `#051230` | common anchor |
| Main text | Neutral Gray `#B6BFC1` | 139 |
| Cool secondary/keyword | Salvia Blue `#97ACC8` | 139 |
| Operator/teal | Benzol Green `#00978D` | 155 |
| Number/orange | Apricot Orange `#F68C50` | 211 |
| String/yellow-green | Olive Yellow `#A6A159` | 211 |
| Coral/constant | Grenadine Pink `#F48067` | 6 |
| Type/peach | Pinkish Cinnamon `#EEB480` | 232 |
| Error | Jasper Red `#EB5324` | 155 |

Why it is promising:

- Background and text reproduce the Night Owl relationship without copying its
  values: deep blue-black plus a cool gray, not white.
- Cool and warm accents are both present, but the shared indigo relationship
  holds them together.
- Most proposed code colors exceed 4.5:1 without neon saturation.
- The warmth and slight earthiness distinguish the theme from common digital
  pastel palettes.

Comments will need a derived screen color rather than a literal Wada swatch. A
first hypothesis is a roughly 72% Salvia-Blue direction over Deep Indigo,
approximately `#6E819D`, but it must pass the contrast gate and visual testing
before adoption. Derived values will be labeled as such.

Low-contrast Wada colors such as Madder Brown, Vandyke Brown, and Carmine may
still work for borders, selection fills, secondary cursors, or composited state
backgrounds; they are not suitable as small code text on Deep Indigo.

## Other intact combination directions

### Candidate B — violet night, combination 265

- Dull Violet Black `#1E0E3F`
- Old Rose `#D46D7A`
- Apricot Yellow `#FFDD00`
- Olive Yellow `#A6A159`

High contrast and characterful, but less recognizably Night Owl because its
night ground leans violet rather than blue.

### Candidate C — blue petroleum family, combinations 60/119/141

- Dark Tyrian Blue `#12354E`
- Pale Lemon Yellow `#FFEFAE`
- Light Glaucous Blue `#A5C8D1`
- Orange `#F37420`
- Yellow Green `#AFD472`

Friendlier and brighter; the orange is borderline for normal text (about
4.46:1) and needs adjustment or a non-text role.

### Candidate D — slate olive, combination 321

- Deep Slate Olive `#253122`
- Light Brown Drab `#B59392`
- Sulpher Yellow `#F5ECC2`
- Salvia Blue `#97ACC8`

Very harmonious and restrained, but too green/neutral to preserve the desired
Night Owl identity.

## Next experiment

Create Candidate A as a separate experimental palette, derive the missing
neutral ladder in a perceptual color space, and render the same multilingual
fixture beside Night Owl. Do not overwrite the intentionally empty baseline
until that comparison is approved.
