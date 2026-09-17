# Night Owl dissection

Research snapshot: 2026-09-16. The values and assignments below were checked
against the current `main` theme file in the official repository. Hex values
are shown in lowercase when they are used as palette anchors; alpha-bearing
UI values are kept as implementation details rather than promoted to palette
roles.

Primary sources:

- https://github.com/sdras/night-owl-vscode-theme
- https://raw.githubusercontent.com/sdras/night-owl-vscode-theme/main/themes/Night%20Owl-color-theme.json
- https://css-tricks.com/creating-a-vs-code-theme/
- https://www.w3.org/TR/WCAG22/

## Finding

Night Owl's strength is not a minimal set of colors. It is a disciplined
hierarchy: a blue-black canvas, a softened icy foreground, quiet chrome, and
semantic accents that repeat often enough to become learnable. Warm colors
become scan targets against a mostly cool environment.

The current theme is a useful reference, not a portable architecture. It has
1,859 lines, disables semantic highlighting, and contains many TextMate and
language-specific exceptions. Copying it wholesale would make the Zed, VS
Code, and Cursor ports drift immediately.

## Canonical visual anchors

The following values are the actual values used by the current theme for the
most important surfaces and states.

| Intent | Value | Contrast / relationship |
| --- | --- | ---: |
| Editor background | `#011627` | — |
| Primary foreground | `#d6deeb` | 13.54:1 on background |
| Secondary sidebar text | `#89a4bb` | 7.06:1 on background |
| Muted UI text | `#5f7e97` | 4.29:1 on background |
| Comments | `#637777` | 3.87:1 on background |
| Line numbers | `#4b6479` | 2.97:1 on background |
| Active line number | `#c5e4fd` | 13.87:1 on background |
| Cursor | `#80a4c2` | 6.99:1 on background |
| Selection surface | `#1d3b53` | 8.60:1 with primary text |
| Inactive selection surface | `#0e293f` | 3.49:1 with muted text |
| Active tab surface | `#0b2942` | 10.88:1 with `#d2dee7` |
| Error | `#ef5350` | 5.26:1 on background |
| Warning | `#b39554` | 6.41:1 on background |
| Info border | `#64b5f6` | 8.28:1 on background |
| Added gutter marker | `#9ccc65` | 9.81:1 on background |

These ratios use WCAG 2.x relative luminance as a diagnostic signal. They do
not mean that every syntax token should be pushed to AAA contrast. Night Owl
intentionally lets low-priority chrome recede. In this project, comments and
code-relevant muted text will be raised to at least 4.5:1 because they are
read repeatedly during long sessions.

## Canonical semantic assignments

The stable assignments below are the useful part of the source theme. They
are grouped by semantic intent, not by every individual TextMate rule.

| Semantic intent | Canonical value | Representative scopes / assignments |
| --- | --- | --- |
| Comment | `#637777` | `comment`, comment punctuation; italic in the base rule |
| String | `#ecc48d` | `string`, quoted strings |
| Number / escape | `#f78c6c` | numeric constants, character escapes |
| Built-in / user constant | `#82aaff` | language constants, library functions/constants |
| Variable | `#c5e478` | `variable`, support types/classes, tag attributes |
| Keyword / storage | `#c792ea` | `keyword`, `storage`, most flow/import/control rules; often italic |
| Class / type | `#ffcb8b` | class names, TypeScript/JavaScript types |
| Function | `#82aaff` or `#c792ea` | calls use blue; generic function names use blue or purple by language rule |
| Markup metadata | `#7fdbca` | tag punctuation, meta tags, keyword operators |
| HTML tag name | `#caece6` | HTML/JSX tag names |
| Null / boolean | `#ff5874` | `constant.language.null`, boolean constants |
| Markdown heading | `#82b1ff` | heading and list punctuation |
| Markdown link | `#ff869a` | link text and image links |
| Markdown quote / raw code | `#697098` / `#80cbc4` | quote and inline raw markup |

Important nuance: these are semantic families, not a one-to-one mapping from
source scope to color. The source adds overrides for JavaScript, TypeScript,
CSS, C#, Dart, Elixir, Go, PHP, Python, Ruby, YAML, Markdown, and others. The
shared Wada Night contract should keep the family-level meaning and move
language differences into target adapters only when a real target requires
them.

## Design logic worth carrying forward

- Keep the editor canvas dark and chromatic rather than neutral black.
- Use a softened cool foreground instead of pure white.
- Solve the neutral surface hierarchy before adding more syntax accents.
- Keep core accents in a related lightness/chroma envelope; use warm accents
  sparingly as scan targets.
- Make role meaning stable across languages. A string should not change
  semantic family merely because it appears in JSON instead of JavaScript.
- Use italics as a supplementary channel. The no-italics variant in the source
  is evidence that users need the same hierarchy without relying on font style.
- Treat claims about blue improving reading or sleep as design motivation,
  not scientific evidence; the project only adopts the visual rationale.

## What not to copy

- The complete 1,859-line VS Code file and its historical exceptions.
- Pure white foregrounds used for isolated high-attention or compatibility
  rules.
- Low-contrast comments (`#637777`) without testing them against the chosen
  Wada Night background.
- Hue as the only signal for errors, warnings, selections, or active states.
- A direct Catppuccin color inheritance model. The 26 names are compatibility
  roles in this project, not claims that the values came from Catppuccin.

## Reusable design rubric

Use this rubric for every candidate palette and every target adapter.

### Contrast and hierarchy

- Primary editor text: at least 7:1 on the editor background.
- Comments and muted text that users must read: at least 4.5:1.
- Selection text on its selection surface: at least 4.5:1, with a visible
  surface change that remains understandable without hue.
- Text-bearing diagnostics: at least 4.5:1 where the target exposes text
  color separately from the diagnostic decoration.
- Borders, focus rings, cursors, and other meaningful non-text indicators:
  at least 3:1 against the adjacent surface when they are the only cue.
- Low-priority chrome may be quieter, but must not make labels or controls
  unusable.

### Semantic consistency

- Strings remain warm and related across languages.
- Functions, types, keywords, operators, variables, and diagnostics have
  stable families in the shared palette.
- Errors, warnings, success, and selection states have a non-hue cue where
  the editor permits one: weight, underline, border, surface, or placement.
- No common syntax scope is an accidental near-duplicate of another common
  scope at normal editor size.

### Robustness

- Review JavaScript/TypeScript/TSX, HTML/CSS, JSON, Markdown, Python, Rust,
  Go, YAML, and shell fixtures.
- Review editor chrome, terminal ANSI, search, selection, diagnostics, diffs,
  Vim states, and collaboration cursors.
- Check protanopia, deuteranopia, tritanopia, and grayscale simulations.
- Check both italics-on and italics-off output before deciding whether an
  accent is doing too much work.

## Translation into Wada Night roles

| Night Owl intent | Shared role direction |
| --- | --- |
| Deep blue editor canvas | `base` |
| Darker chrome | `mantle`, `crust` |
| Soft cool foreground | `text` |
| Readable comments | `overlay1` or a lighter derived neutral |
| Keywords | `mauve` |
| Functions | `blue` |
| Operators / language variables | `teal` |
| Warm strings | `yellow` |
| Numbers / constants | `peach` |
| Types / classes | `yellow` / `peach` |
| Null / boolean / errors | `red` |

Warm strings are intentional: they are a Night Owl-derived semantic choice,
not an attempt to reproduce Catppuccin's usual green-string convention.

## Decision

Plan B establishes the constraints for candidate palette work:

1. Preserve the deep blue chromatic base and cool softened foreground.
2. Preserve the semantic families and the deliberate warm-string choice.
3. Set 4.5:1 as the minimum for comments and code-relevant muted text in Wada
   Night, even though the canonical Night Owl comment value is 3.87:1.
4. Keep literal Night Owl values as provenance references, not as the final
   Wada Night palette.

The next step is Phase 1: populate separate candidate palettes and compare
them against this rubric before choosing one direction.
