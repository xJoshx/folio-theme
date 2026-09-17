# Folio

Folio is a color-conscious theme family for Zed, built from Sanzo Wada color
combinations and tuned for long editing sessions. The first release candidate
contains three dark identities and one shared light theme:

- **Folio — Luminous Ink** — neutral, aesthetic editorial graphite for long coding sessions.
- **Folio — Sunlit Shell** — warm, energetic peach and coral on mineral slate.
- **Folio — Spring Herbarium** — creative night coding on Tyrian blue-black.
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

## Test locally in Orca

Orca currently supports third-party terminal themes through its Warp YAML
importer. Open **Settings → Terminal → Import from YAML** and select
`packages/orca/themes`. The package contains all four Folio palettes. Orca does
not currently expose custom IDE chrome or Monaco syntax themes, so the editor
and application UI continue to follow Orca's built-in light or dark appearance.

## Test locally in Claude Code

Run `claude --plugin-dir ./packages/claude-code`, then open `/theme` and choose
one of the four Folio themes. Unlike Orca's terminal-only import, this package
uses Claude Code's custom-theme tokens for its conversation UI, prompt, modes,
statuses, diffs, message surfaces, usage meter, and subagent colors.

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
- `packages/orca/themes/`: generated themes for Orca's terminal importer.
- `packages/claude-code/`: generated Claude Code theme plugin.
- `src/targets/claude-code.mjs`: Claude Code theme-token adapter.
- `src/targets/orca.mjs`: Orca/Warp terminal-theme adapter.
- `src/targets/zed.mjs`: Zed UI and syntax adapter.
- `samples/polyglot-theme-fixture/`: 73 language and framework samples.
- `studies/generated/`: archived comparison artifacts, not loaded by Zed.
- `docs/BRAND.md`: working identity and logo direction.
- `docs/PUBLISHING.md`: remaining publication gates and submission steps.

The public repository URL in `extension.toml` remains a placeholder until the
GitHub remote is connected.
