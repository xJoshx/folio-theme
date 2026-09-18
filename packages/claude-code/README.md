# Folio Themes for Claude Code

This Claude Code plugin contains four generated themes:

- Folio — Luminous Ink
- Folio — Sunlit Shell
- Folio — Spring Herbarium
- Folio — Linen

Custom and plugin themes require Claude Code 2.1.118 or later.

## Test the plugin locally

From the repository root, start Claude Code with:

```sh
claude --plugin-dir ./packages/claude-code
```

Run `/theme`, then choose a Folio theme. Plugin themes are read-only; Claude
Code offers to copy one into `~/.claude/themes/` if you edit it with `Ctrl+E`.

## Install the JSON files directly

Alternatively, copy the files in `themes/` to `~/.claude/themes/`. Run
`/theme` and select the desired Folio theme. Claude Code watches that directory
and reloads theme edits while running. If the directory did not exist when the
session started, restart Claude Code once after creating it.

## Scope

These files theme Claude Code itself: conversation text, prompts, modes,
statuses, diffs, message surfaces, usage meters, shimmers, and subagent colors.
The surrounding terminal background and shell output still come from the host
terminal theme, such as the matching Folio theme for Orca or Zed.

Claude Code does not currently expose separate custom-theme tokens for Markdown
body accents such as inline code and file references, and current releases bypass
custom `permission` overrides while rendering those spans. Folio therefore sets
`permission` to its prose accent for forward compatibility and inherits from
Claude Code's ANSI-aware base themes for current releases. The matching terminal
theme maps normal blue to the main accent and bright blue to sapphire. Pair each
Claude Code theme with the same Folio terminal theme, then test with newly printed
output: terminal scrollback already on screen keeps its original color codes.

Run `npm run build` at the repository root to regenerate the plugin themes from
the shared source palettes. Do not hand-edit generated JSON.
