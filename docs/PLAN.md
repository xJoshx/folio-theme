# Project plan

## Goal

Create one editor-independent dark palette and semantic system, ship it first
as a complete Zed theme, then reuse it in VS Code and Cursor without allowing
the three ports to drift.

## Parallel research tracks

### A. Catppuccin architecture

- Preserve the separation between source/template and generated theme files.
- Preserve broad coverage: editor chrome, terminal ANSI, diagnostics, version
  control, collaboration cursors, Vim states, and syntax scopes.
- Use Catppuccin's 26 named slots as compatibility roles, not as inherited
  color values.
- Record any copied structure or code under the source project's MIT terms.

Deliverable: `docs/research/CATPPUCCIN.md` and the current scaffold.

### B. Night Owl dissection

- Recover the canonical colors and their actual token assignments.
- Separate the qualities we want (luminance ladder, deep blue adaptation,
  semantic consistency, gentle foreground) from literal color copying.
- Measure contrast for primary text, secondary text, comments, selections,
  diagnostics, and active UI states.

Deliverable: `docs/research/NIGHT_OWL.md` and a reusable design rubric.

### C. Sanzo Wada exploration

- Locate trustworthy, legally reusable source material or datasets.
- Shortlist combinations that contain a deep chromatic dark, a pale non-white
  foreground, and 4-8 distinct accents.
- Treat historical color names and printed reproductions as source material;
  normalize candidate colors into a modern working color space only after
  documenting the conversion.

Deliverable: `docs/research/WADA.md` and 3-5 candidate palettes.

## Integration phases

### Phase 0 — Scaffold (done)

- Zed extension structure, CI, tasks, source palette, schema, target adapter.
- Empty role values are allowed in research mode; generation remains blocked.

### Phase 1 — Candidate palettes

- Populate separate candidate files rather than overwriting the baseline.
- Compare each candidate against the same Night Owl-inspired rubric.
- Choose one direction only after viewing real code in several languages.

Exit criteria: one approved palette with documented provenance.

### Phase 2 — Zed alpha

- Fill every palette role and generate the theme.
- Validate the Zed v0.2.0 schema.
- Test JavaScript/TypeScript, HTML/CSS, JSON, Markdown, Python, Rust, shell,
  diffs, diagnostics, terminal ANSI, search, and selection states.
- Check WCAG contrast as a diagnostic signal; do not rely on ratio alone for
  syntax-color quality.

Exit criteria: no missing states, no illegible common scope, no accidental
near-duplicate accents.

### Phase 3 — Zed beta and release

- Add screenshots, final naming, repository URL, author metadata, and release
  notes.
- Test normal and color-vision-deficiency simulations.
- Submit the theme-only extension to Zed's extension registry.

### Phase 4 — VS Code and Cursor

- Add a VS Code target adapter fed by the same `palette/` file.
- Use one VS Code extension for both VS Code and Cursor unless a real platform
  difference requires a separate package.
- Add cross-target snapshot tests for shared semantic roles.

## Decision rules

1. Background must be dark and chromatic, never neutral black.
2. Primary text must be a softened light color, never pure white.
3. Neutral UI hierarchy is solved before syntax accents.
4. Accent colors must carry stable meaning across languages and editors.
5. Comments may recede, but must remain readable for long sessions.
6. Selection and active states must work without depending on hue alone.
7. Printed Wada colors may be adapted for screens; every adaptation is logged.

## Immediate next decisions

- Final project/theme name.
- Whether italics are default, optional, or absent.
- Which 3-5 Wada combinations become on-screen candidates.
- Target minimum contrast for comments and muted UI text.
