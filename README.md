# Folio

Folio is a color-conscious theme family for Zed, built from Sanzo Wada color
combinations and tuned for long editing sessions. The first release candidate
contains three dark identities and one shared light theme:

- **Folio — Luminous Ink** — editorial graphite.
- **Folio — Sunlit Shell** — brighter mineral slate.
- **Folio — Spring Herbarium** — creative Tyrian blue-black.
- **Folio — Linen** — a quiet, neutral light theme.

The dark themes use restrained, low-contrast separators and gray-white editor
chrome so syntax color remains the visual focus. Linen is based on the most
neutral of the light studies rather than duplicating every dark identity.

## Test locally in Zed

1. Run `npm install`.
2. Run `npm run release:check`.
3. In Zed, open the Extensions page and choose **Install Dev Extension**.
4. Select this repository.
5. Open the theme selector and search for `Folio`.

Zed loads the generated release family from `themes/folio.json`. Previous
Ink & Blossom palettes and comparison studies remain in the repository as
design history, but they are not exposed in Zed's theme selector.

## Development commands

```sh
npm run check          # validate source palettes
npm test               # test contrast, naming, and theme contracts
npm run build          # generate themes/folio.json
npm run release:check  # run the complete release-candidate verification
npm run theme:lab      # open the palette study lab
```

## Project map

- `palette/folio-luminous-ink.json`, `folio-sunlit-shell.json`,
  `folio-spring-herbarium.json`, and `folio-linen.json`: release sources.
- `themes/folio.json`: generated Zed artifact; committed for publication.
- `src/targets/zed.mjs`: Zed UI and syntax adapter.
- `samples/polyglot-theme-fixture/`: 73 language and framework samples.
- `studies/generated/`: archived comparison artifacts, not loaded by Zed.
- `docs/BRAND.md`: working identity and logo direction.
- `docs/PUBLISHING.md`: remaining publication gates and submission steps.

The public repository URL in `extension.toml` remains a placeholder until the
GitHub remote is connected.
