# Catppuccin architecture: what we are borrowing

Research snapshot: 2026-09-16. Sources were checked against the current
`main` branch and the current Zed theme schema.

Primary sources:

- [Catppuccin Zed repository](https://github.com/catppuccin/zed)
- [Catppuccin Zed template](https://raw.githubusercontent.com/catppuccin/zed/main/zed.tera)
- [Catppuccin Zed justfile](https://raw.githubusercontent.com/catppuccin/zed/main/justfile)
- [Zed theme extensions](https://zed.dev/docs/extensions/themes)
- [Zed extension development](https://zed.dev/docs/extensions/developing-extensions)
- [Zed publishing prerequisites](https://zed.dev/docs/extensions/publishing/prerequisites)
- [Zed theme schema v0.2.0](https://zed.dev/schema/themes/v0.2.0.json)

## Findings

### 1. The repository separates source from generated artifacts

The official port keeps its theme source in `zed.tera`. Whiskers processes that
template and writes JSON files under `themes/`; the checked-in project also
uses a `justfile` to make generation repeatable. The generated JSON is the
artifact Zed consumes, not the authoring surface.

The template currently declares a matrix with three dimensions:

```text
variant: ["", "-no-italics"]
flavor: Catppuccin flavor
accent: Catppuccin accent
```

That matrix explains why the upstream project can publish multiple theme
variants from one source file. It is useful architecture, but its flavor and
accent model is specific to Catppuccin and is not part of Wada Night's design.

### 2. Coverage is a first-class concern

The upstream template covers more than the editor canvas. Its style section
includes application chrome, borders and surfaces, tabs, panels, search,
scrollbars, minimap, editor guides, terminal ANSI colors, diagnostics, Git
states, debugger state, Vim modes, and collaboration players. Its syntax
section covers both modern Tree-sitter captures and legacy names such as
`parameter`, `field`, `namespace`, and `string.regex`.

Counting the current local adapter gives the same useful coverage shape:

```text
176 top-level style keys, including syntax
103 syntax rules
```

This is a compatibility target, not a promise that every key should receive a
Catppuccin color. Wada Night should keep the coverage while making independent
semantic choices.

### 3. The 26 named colors work as compatibility roles

Catppuccin's dark-flavor palette exposes 14 accent roles and a 12-step neutral
ladder:

```text
accents:
  rosewater flamingo pink mauve red maroon peach yellow
  green teal sky sapphire blue lavender

neutrals, light to dark:
  text subtext1 subtext0 overlay2 overlay1 overlay0
  surface2 surface1 surface0 base mantle crust
```

We retain these names as a stable role contract so the future Zed, VS Code,
and Cursor adapters can consume one editor-independent palette. The values are
not inherited from Catppuccin and this project is not an unofficial Catppuccin
flavor.

### 4. Zed's schema is permissive by design

Zed's v0.2.0 schema requires a theme family with `name`, `author`, and
`themes`. Each theme requires `name`, `appearance`, and `style`; style entries
may be strings or `null`, and syntax entries support color, font style, and
font weight. This lets the scaffold validate structure before the research
palette is complete, while the production build can enforce that every role
has a real six-digit color.

Zed's extension guidance also says a theme extension should provide themes and
nothing else, and that theme extension IDs should indicate that they are
themes. The current manifest therefore remains theme-only and uses the
`wada-night-theme` suffix.

## Decision for Wada Night

We preserve the upstream separation of concerns with a smaller, editor-
independent pipeline:

```text
palette/wada-night.json -> src/targets/zed.mjs -> themes/wada-night.json
                         -> future VS Code adapter
                         -> future Cursor adapter
```

- `palette/wada-night.json` is the single source of truth for color roles.
- `src/targets/` contains target-specific semantic mappings.
- `themes/` contains generated Zed output and is never edited by hand.
- `scripts/check.mjs` permits `null` during research.
- `scripts/build.mjs` refuses to emit production output until all 26 roles are
  valid colors.
- `tests/` protects role order, alpha handling, contrast calculations, and
  broad Zed coverage.

The adapter intentionally keeps the upstream coverage shape, including
terminal ANSI, diagnostics, version control, collaboration, Vim states, and
legacy syntax captures. The semantic assignments remain Wada Night decisions;
for example, warm strings are a Night Owl-derived direction rather than a
Catppuccin default.

## What we are not copying

- Catppuccin's authorship, extension identity, repository URL, and release
  automation.
- Whiskers' flavor/accent matrix and Catppuccin palette values.
- Catppuccin preview imagery or organization-specific configuration.
- Catppuccin's exact language-color decisions where they conflict with the
  Night Owl and Wada direction.

The structural reference is recorded in [`NOTICE.md`](../../NOTICE.md).
Catppuccin for Zed is MIT-licensed; any future copied code or substantial
snippet must retain the applicable notice rather than silently entering this
project.

## Exit status for plan A

Plan A is complete for the current scaffold: the research note records the
architecture and boundaries, the role contract has 26 entries, the Zed
adapter preserves 176/103 coverage, and `npm run check` plus `npm test` pass.
Palette selection and color values remain intentionally deferred to Phase 1.
