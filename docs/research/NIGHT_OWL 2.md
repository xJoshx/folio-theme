# Why Night Owl works

Research snapshot: 2026-09-16. The current theme has evolved since Sarah
Drasner's original design article, so this document distinguishes present-day
values from the original rationale.

Primary sources:

- https://github.com/sdras/night-owl-vscode-theme
- https://raw.githubusercontent.com/sdras/night-owl-vscode-theme/main/themes/Night%20Owl-color-theme.json
- https://css-tricks.com/creating-a-vs-code-theme/
- https://www.w3.org/TR/WCAG22/

## The short version

Night Owl is good because it spends contrast deliberately. Its nearly
blue-black canvas adapts comfortably to low light; its foreground is a softened
icy blue rather than white; syntax accents share a similar lightness/chroma
envelope; and a few warm colors become scan targets among mostly cool colors.
Roles are repeated consistently, so the theme becomes learnable.

## Canonical visual anchors

The current theme file is the source of truth; Night Owl does not expose a
small, clean palette contract.

| Purpose | Value | Contrast on `#011627` |
|---|---:|---:|
| Background | `#011627` | — |
| Primary foreground | `#D6DEEB` | 13.54:1 |
| Muted UI | `#5F7E97` | 4.29:1 |
| Comments | `#637777` | 3.87:1 |
| Cursor | `#80A4C2` | — |
| Selection | `#1D3B53` | 8.60:1 with primary text |
| Active surface/tab | `#0B2942` | 10.88:1 with active-tab text |
| String | `#ECC48D` | 11.22:1 |
| Number/constant | `#F78C6C` | 7.79:1 |
| Keyword/storage | `#C792EA` | 7.62:1 |
| Function | `#82AAFF` | 7.98:1 |
| Variable/support | `#C5E478` | 12.87:1 |
| Type/class | `#FFCB8B` | 12.37:1 |
| Operator/language variable | `#7FDBCA` | 11.25:1 |
| Null/boolean | `#FF5874` | 6.02:1 |

Ratios are WCAG 2.x calculations. WCAG 2.2 calls for 4.5:1 for normal text
at AA and 7:1 at AAA. Night Owl's primary syntax is excellent by those numbers,
but comments, muted UI, and line numbers are deliberately below or around the
normal-text threshold. “Color-blind aware” should not be restated as blanket
WCAG compliance.

## Sarah Drasner's design logic

The theme was designed for low-light/night use. Sarah chose blue as the base
family and explored beige/gold, green, pink, and blue as supporting contrasts.
Color-blind simulations favored complementary relationships and triads when
three colors had to coexist. The important principle is relational: a color is
judged by what surrounds it, not in isolation.

Another principle is that contrast is finite. Low-priority chrome is quiet so
the code surface wins. Purple marks informative keywords but does not overpower
the data. Red was avoided as a general high-attention token because it already
carries error meaning and visually monopolizes a composition. The repository
even documents an optional higher-contrast sidebar, acknowledging that the
default hierarchy will not suit everyone.

Italics add a second channel for certain roles, and the official no-italics
variant acknowledges legibility and personal-preference differences. Italics
must remain supplementary; hue or font style alone should never be the only
way to recover important meaning.

The author also describes the medical/reading claims around blue as debated
and inconclusive. We treat them as design motivation, not scientific proof.

## Why the palette feels like one family

- The background is dark but strongly chromatic: roughly 207° hue and only
  about 8% HSL lightness.
- The main foreground is an icy blue-white, which lowers apparent glare.
- Core accents occupy a fairly narrow lightness range while spanning the hue
  wheel: coral, gold, lime, teal, blue, purple, and rose.
- Cool accents visually belong to the blue ground; sparse warm colors provide
  high-value scan targets.
- The same token role repeatedly receives the same family, building learned
  semantics across files.

## What not to copy

The current Night Owl file is 1,859 lines, disables semantic highlighting, and
uses many TextMate and language-specific exceptions. That is historical VS Code
surface area, not a portable architecture. Copying it would make Zed, VS Code,
and Cursor drift immediately.

## Integration into a Catppuccin-shaped system

We will preserve Night Owl's hierarchy while using our shared role contract:

| Semantic intent | Shared role direction |
|---|---|
| Deep blue editor canvas | `base` |
| Darker chrome | `mantle`, `crust` |
| Soft cool foreground | `text` |
| Readable comments | `overlay1` (must reach 4.5:1) |
| Keywords | `mauve` |
| Functions | `blue` |
| Operators/language variables | `teal` |
| Warm strings | `yellow` |
| Numbers/constants | `peach` |
| Types/classes | `yellow`/`peach` |
| Null/boolean/errors | `red` |

Unlike Catppuccin's usual green strings, warm strings are an intentional Night
Owl-derived choice. The rule lives once in the adapter instead of being repeated
as per-language overrides.

## Acceptance rubric

- Primary text target: at least 7:1 on the editor background.
- Comments and muted text used for code: at least 4.5:1.
- Meaningful non-text controls/focus cues: at least 3:1.
- Errors, warnings, and success require a non-hue cue where the editor permits.
- Test protanopia, deuteranopia, tritanopia, and grayscale.
- Test syntax fixtures across JS/TS/TSX, HTML/CSS, JSON, Markdown, Python,
  Rust, Go, YAML, and shell.
