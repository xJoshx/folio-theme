# Folio for Orca

This package contains the four Folio palettes in the Warp YAML format that
Orca imports as custom terminal themes:

- Folio — Luminous Ink
- Folio — Sunlit Shell
- Folio — Spring Herbarium
- Folio — Linen

## Install

1. Open **Orca → Settings → Terminal**.
2. Choose **Import from YAML** beside the terminal theme picker.
3. Select this package's `themes` folder.
4. Select the Folio themes you want to import.
5. Choose one from the **Imported** section of Orca's terminal theme dropdown.

Importing adds a theme but does not activate it. If an imported theme still
shows a pure-black background, select it explicitly and clear any per-color
terminal overrides left from the previous theme. Re-import the YAML after
regenerating it; Orca stores a copy rather than watching the source file.

You can also copy the YAML files to `~/.warp/themes` on macOS and use
**Import themes from Warp** in Orca.

## Scope

Orca currently imports custom colors for its terminal, but its public theme and
plugin APIs do not expose custom IDE chrome or Monaco editor syntax themes.
Consequently, this is an installable Orca terminal-theme package rather than a
full editor/UI skin. The files use Orca's supported importer and are generated
from the same four source palettes as the Zed extension.

## Development

Run `npm run build` at the repository root to regenerate these files. Edit the
source palettes under `palette/`; do not hand-edit generated YAML.
