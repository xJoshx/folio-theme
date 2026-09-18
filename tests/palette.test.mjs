import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { createZedTheme, createZedThemeFamily } from "../src/targets/zed.mjs";
import {
  createOrcaTerminalTheme,
  orcaThemeFilename,
  serializeOrcaTerminalTheme
} from "../src/targets/orca.mjs";
import {
  claudeCodeThemeFilename,
  createClaudeCodeTheme
} from "../src/targets/claude-code.mjs";
import {
  backgroundStudies,
  backgroundStudyFinalistIds,
  createBackgroundMatrixPalettes,
  createBackgroundStudyPalettes
} from "../src/lib/background-studies.prototype.mjs";
import {
  ROLE_NAMES,
  alpha,
  contrastRatio,
  readPalette,
  validatePalette
} from "../scripts/lib/palette.mjs";
import { presets } from "../src/lib/theme-lab-presets.mjs";
import { resolveToneColors } from "../src/lib/theme-lab-tones.mjs";

const fakeColors = Object.fromEntries(
  ROLE_NAMES.map((role, index) => [role, `#${(index + 0x202020).toString(16).padStart(6, "0")}`])
);

const completePalette = {
  name: "Fixture",
  appearance: "dark",
  settings: { italics: true },
  colors: fakeColors
};

test("draft palette contract accepts all roles as null", () => {
  const draft = {
    ...completePalette,
    colors: Object.fromEntries(ROLE_NAMES.map((role) => [role, null]))
  };
  assert.deepEqual(validatePalette(draft, { allowNull: true }), []);
});

test("production palette contract rejects null roles", () => {
  const draft = {
    ...completePalette,
    colors: { ...fakeColors, base: null }
  };
  assert.match(validatePalette(draft, { allowNull: false }).join("\n"), /base/);
});

test("alpha creates Zed-compatible eight-digit hex", () => {
  assert.equal(alpha("#102030", 0.5), "#10203080");
});

test("contrast ratio matches known black/white ratio", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
});

test("Zed adapter emits broad Catppuccin-style coverage", () => {
  const output = createZedTheme(completePalette);
  const style = output.themes[0].style;
  assert.equal(output.$schema, "https://zed.dev/schema/themes/v0.2.0.json");
  assert.ok(Object.keys(style).length >= 165);
  assert.ok(Object.keys(style.syntax).length >= 90);
  assert.equal(style.background, fakeColors.base);
  assert.equal(style["editor.background"], fakeColors.base);
  assert.equal(style.text, fakeColors.subtext1);
  assert.equal(style["text.muted"], fakeColors.subtext0);
  assert.equal(style["editor.foreground"], fakeColors.subtext1);
  assert.equal(style["terminal.foreground"], fakeColors.subtext1);
  assert.equal(style["terminal.bright_foreground"], fakeColors.subtext1);
  assert.equal(style.syntax.text.color, fakeColors.subtext1);
  assert.equal(style.syntax.string.color, fakeColors.yellow);
  assert.equal(style.syntax.variable.color, fakeColors.text);
  assert.equal(style.syntax.keyword.font_style, "italic");
  assert.equal(style["text.placeholder"], fakeColors.subtext0);
  assert.equal(style.modified, fakeColors.subtext1);
  assert.equal(style["modified.border"], fakeColors.subtext0);
  assert.equal(style["modified.background"], alpha(fakeColors.subtext0, 0.15));
  assert.equal(style["version_control.modified"], fakeColors.yellow);
});

test("Zed adapter gives Markdown structure its own readable styles", () => {
  const output = createZedTheme(completePalette);
  const style = output.themes[0].style;

  assert.equal(style.syntax["title.markup"].color, fakeColors.mauve);
  assert.equal(style.syntax["emphasis.strong.markup"].color, fakeColors.peach);
  assert.equal(style.syntax["emphasis.strong.markup"].font_weight, 700);
  assert.equal(style.syntax["punctuation.list_marker.markup"].color, fakeColors.lavender);
  assert.equal(style.syntax["link_text.markup"].color, fakeColors.sky);
  assert.equal(
    style.syntax["text.literal.markup"].background_color,
    alpha(fakeColors.surface1, 0.55)
  );
});

test("interactive elements keep Markdown preview checkboxes visible", () => {
  const output = createZedTheme(completePalette);
  const style = output.themes[0].style;

  assert.equal(style.border, fakeColors.overlay0);
  assert.equal(style["element.background"], fakeColors.surface1);
  assert.equal(style["element.selected"], alpha(fakeColors.mauve, 0.35));
});

test("soft separator profile removes syntax colours from pane outlines", () => {
  const output = createZedTheme({
    ...completePalette,
    settings: { ...completePalette.settings, separatorStyle: "soft" }
  });
  const style = output.themes[0].style;

  assert.equal(style.border, alpha(fakeColors.surface1, 0.38));
  assert.equal(style["border.variant"], alpha(fakeColors.surface2, 0.34));
  assert.equal(style["border.focused"], alpha(fakeColors.subtext0, 0.28));
  assert.equal(style["border.selected"], alpha(fakeColors.subtext0, 0.36));
  assert.equal(style["panel.focused_border"], alpha(fakeColors.subtext0, 0.28));
  assert.equal(style["pane.focused_border"], alpha(fakeColors.subtext0, 0.28));
  assert.equal(style["pane_group.border"], alpha(fakeColors.surface1, 0.38));
  assert.equal(style["element.background"], fakeColors.surface1);
});

test("Zed family keeps every release variant in one package", () => {
  const palettes = [
    ["Luminous Ink", "dark"],
    ["Sunlit Shell", "dark"],
    ["Spring Herbarium", "dark"],
    ["Linen", "light"]
  ].map(([name, appearance]) => ({
    ...completePalette,
    name: `Folio — ${name}`,
    appearance
  }));
  const output = createZedThemeFamily(palettes);

  assert.equal(output.name, "Folio");
  assert.equal(output.author, "José Vizcaíno");
  assert.equal(output.themes.length, 4);
  assert.deepEqual(
    output.themes.map((theme) => theme.name),
    palettes.map((palette) => palette.name)
  );
  assert.deepEqual(
    output.themes.map((theme) => theme.appearance),
    ["dark", "dark", "dark", "light"]
  );
});

test("release palettes expose three dark identities and one shared light theme", async () => {
  const files = [
    "folio-luminous-ink.json",
    "folio-sunlit-shell.json",
    "folio-spring-herbarium.json",
    "folio-linen.json"
  ];
  const palettes = await Promise.all(
    files.map((file) => readPalette(resolve(import.meta.dirname, "../palette", file)))
  );

  assert.deepEqual(
    palettes.map((palette) => palette.name),
    [
      "Folio — Luminous Ink",
      "Folio — Sunlit Shell",
      "Folio — Spring Herbarium",
      "Folio — Linen"
    ]
  );
  assert.deepEqual(
    palettes.map((palette) => palette.appearance),
    ["dark", "dark", "dark", "light"]
  );
});

test("generated Folio package contains only the four correctly named release themes", async () => {
  const builtTheme = JSON.parse(
    await readFile(resolve(import.meta.dirname, "../themes/folio.json"), "utf8")
  );

  assert.deepEqual(
    builtTheme.themes.map((theme) => theme.name),
    [
      "Folio — Luminous Ink",
      "Folio — Sunlit Shell",
      "Folio — Spring Herbarium",
      "Folio — Linen"
    ]
  );
});

test("Orca adapter emits the supported Warp terminal-theme contract", () => {
  const theme = createOrcaTerminalTheme(completePalette);

  assert.equal(theme.name, "Fixture");
  assert.equal(theme.background, fakeColors.base);
  assert.equal(theme.foreground, fakeColors.text);
  assert.equal(theme.accent, fakeColors.mauve);
  assert.equal(theme.cursor, fakeColors.text);
  assert.equal(theme.details, "darker");
  assert.equal(theme.terminal_colors.normal.red, fakeColors.red);
  assert.equal(theme.terminal_colors.normal.white, fakeColors.subtext0);
  assert.equal(theme.terminal_colors.bright.black, fakeColors.surface2);
  assert.equal(theme.terminal_colors.bright.white, fakeColors.subtext1);

  const yaml = serializeOrcaTerminalTheme(theme);
  assert.match(yaml, /^name: "Fixture"/);
  assert.match(yaml, /terminal_colors:\n  normal:/);
  assert.match(yaml, /  bright:/);
});

test("Orca adapter keeps ANSI black and white ordered correctly on light themes", () => {
  const theme = createOrcaTerminalTheme({ ...completePalette, appearance: "light" });

  assert.equal(theme.details, "lighter");
  assert.equal(theme.terminal_colors.normal.black, fakeColors.text);
  assert.equal(theme.terminal_colors.bright.black, fakeColors.surface2);
  assert.equal(theme.terminal_colors.normal.white, fakeColors.subtext0);
  assert.equal(theme.terminal_colors.bright.white, fakeColors.subtext1);
});

test("Orca adapter lets Herbarium replace ANSI orange and coral with its keyword pink", async () => {
  const herbarium = await readPalette(
    resolve(import.meta.dirname, "../palette/folio-spring-herbarium.json")
  );
  const theme = createOrcaTerminalTheme(herbarium);

  assert.equal(herbarium.settings.terminalWarmRole, "mauve");
  assert.equal(theme.terminal_colors.normal.red, herbarium.colors.mauve);
  assert.equal(theme.terminal_colors.bright.red, herbarium.colors.mauve);
  assert.equal(theme.terminal_colors.bright.yellow, herbarium.colors.mauve);
});

test("Orca package contains one importable terminal theme per release palette", async () => {
  const files = [
    "folio-luminous-ink.json",
    "folio-sunlit-shell.json",
    "folio-spring-herbarium.json",
    "folio-linen.json"
  ];
  const palettes = await Promise.all(
    files.map((file) => readPalette(resolve(import.meta.dirname, "../palette", file)))
  );

  assert.deepEqual(
    palettes.map(orcaThemeFilename),
    [
      "folio-luminous-ink.yaml",
      "folio-sunlit-shell.yaml",
      "folio-spring-herbarium.yaml",
      "folio-linen.yaml"
    ]
  );

  for (const palette of palettes) {
    const path = resolve(
      import.meta.dirname,
      "../packages/orca/themes",
      orcaThemeFilename(palette)
    );
    const yaml = await readFile(path, "utf8");
    assert.equal(yaml, serializeOrcaTerminalTheme(createOrcaTerminalTheme(palette)));
  }
});

test("Claude Code adapter covers its documented theme surfaces", () => {
  const theme = createClaudeCodeTheme(completePalette);

  assert.equal(theme.name, "Fixture");
  assert.equal(theme.base, "dark-ansi");
  assert.equal(theme.overrides.text, fakeColors.text);
  assert.equal(theme.overrides.claude, fakeColors.yellow);
  assert.equal(theme.overrides.promptBorder, fakeColors.yellow);
  assert.equal(theme.overrides.success, fakeColors.green);
  assert.equal(theme.overrides.error, fakeColors.red);
  assert.equal(theme.overrides.userMessageBackground, fakeColors.surface0);
  assert.equal(theme.overrides.bashMessageBackgroundColor, fakeColors.mantle);
  assert.equal(theme.overrides.purple_FOR_SUBAGENTS_ONLY, fakeColors.mauve);
  assert.match(theme.overrides.diffAdded, /^#[0-9a-f]{6}$/);
  assert.match(theme.overrides.diffRemoved, /^#[0-9a-f]{6}$/);
  assert.ok(Object.keys(theme.overrides).length >= 55);
});

test("Claude Code themes inherit ANSI prose accents from the matching terminal palette", () => {
  const darkTheme = createClaudeCodeTheme(completePalette);
  const lightTheme = createClaudeCodeTheme({ ...completePalette, appearance: "light" });

  assert.equal(darkTheme.base, "dark-ansi");
  assert.equal(lightTheme.base, "light-ansi");
});

test("Claude Code Herbarium carries the terminal pink-forward warm role", async () => {
  const herbarium = await readPalette(
    resolve(import.meta.dirname, "../palette/folio-spring-herbarium.json")
  );
  const theme = createClaudeCodeTheme(herbarium);

  assert.equal(theme.overrides.claude, herbarium.colors.mauve);
  assert.equal(theme.overrides.promptBorder, herbarium.colors.mauve);
  assert.equal(theme.overrides.error, herbarium.colors.mauve);
  assert.equal(theme.overrides.orange_FOR_SUBAGENTS_ONLY, herbarium.colors.mauve);
  assert.equal(theme.overrides.rainbow_orange, herbarium.colors.mauve);
});

test("Claude Code package contains one generated theme per release palette", async () => {
  const files = [
    "folio-luminous-ink.json",
    "folio-sunlit-shell.json",
    "folio-spring-herbarium.json",
    "folio-linen.json"
  ];
  const palettes = await Promise.all(
    files.map((file) => readPalette(resolve(import.meta.dirname, "../palette", file)))
  );

  assert.deepEqual(
    palettes.map(claudeCodeThemeFilename),
    [
      "folio-luminous-ink.json",
      "folio-sunlit-shell.json",
      "folio-spring-herbarium.json",
      "folio-linen.json"
    ]
  );

  for (const palette of palettes) {
    const path = resolve(
      import.meta.dirname,
      "../packages/claude-code/themes",
      claudeCodeThemeFilename(palette)
    );
    const theme = JSON.parse(await readFile(path, "utf8"));
    assert.deepEqual(theme, createClaudeCodeTheme(palette));
  }
});

test("Claude Code themes keep long-form and surfaced text readable", async () => {
  const files = [
    "folio-luminous-ink.json",
    "folio-sunlit-shell.json",
    "folio-spring-herbarium.json",
    "folio-linen.json"
  ];
  const palettes = await Promise.all(
    files.map((file) => readPalette(resolve(import.meta.dirname, "../palette", file)))
  );

  for (const palette of palettes) {
    const { overrides } = createClaudeCodeTheme(palette);
    for (const background of [
      palette.colors.base,
      overrides.userMessageBackground,
      overrides.bashMessageBackgroundColor,
      overrides.diffAdded,
      overrides.diffRemoved
    ]) {
      assert.ok(
        contrastRatio(overrides.text, background) >= 7,
        `${palette.name} text is below 7:1 on ${background}`
      );
    }
    assert.ok(
      contrastRatio(overrides.inverseText, overrides.claude) >= 4.5,
      `${palette.name} inverse text is unreadable on its primary accent`
    );
  }
});

test("dark release palettes keep primary editor and terminal text neutral", async () => {
  const files = [
    "folio-luminous-ink.json",
    "folio-sunlit-shell.json",
    "folio-spring-herbarium.json"
  ];
  const palettes = await Promise.all(
    files.map((file) => readPalette(resolve(import.meta.dirname, "../palette", file)))
  );

  for (const palette of palettes) {
    const channels = palette.colors.subtext1
      .slice(1)
      .match(/.{2}/g)
      .map((channel) => Number.parseInt(channel, 16));
    const channelSpread = Math.max(...channels) - Math.min(...channels);

    assert.equal(palette.colors.subtext1, "#b6bfc1", `${palette.name} does not use Wada Neutral Gray`);
    assert.ok(channelSpread <= 12, `${palette.name} primary text is visibly tinted`);
    assert.ok(
      contrastRatio(palette.colors.base, palette.colors.subtext1) >= 7,
      `${palette.name} primary text is below 7:1`
    );
  }
});

test("Luminous stays quiet while Sunlit Shell owns the warm string mass", async () => {
  const [luminous, shell, herbarium] = await Promise.all(
    [
      "folio-luminous-ink.json",
      "folio-sunlit-shell.json",
      "folio-spring-herbarium.json"
    ].map((file) => readPalette(resolve(import.meta.dirname, "../palette", file)))
  );

  assert.equal(luminous.colors.yellow, "#96d1aa");
  assert.equal(shell.colors.yellow, "#eeb480");
  assert.equal(herbarium.colors.yellow, "#fbe6a0");
  assert.ok(
    Math.abs(
      contrastRatio("#000000", luminous.colors.yellow) -
      contrastRatio("#000000", shell.colors.yellow)
    ) < 1,
    "Luminous and Shell string accents should carry comparable visual weight"
  );
});

test("light themes retain their warmer content hierarchy", () => {
  const lightPalette = { ...completePalette, appearance: "light" };
  const style = createZedTheme(lightPalette).themes[0].style;

  assert.equal(style["editor.foreground"], fakeColors.text);
  assert.equal(style["terminal.foreground"], fakeColors.text);
  assert.equal(style.syntax.text.color, fakeColors.text);
  assert.equal(style.syntax.string.color, fakeColors.yellow);
});

test("dark workbench themes can invert white between reading text and strings", () => {
  const paletteStringsStyle = createZedTheme({
    ...completePalette,
    settings: { ...completePalette.settings, readingTone: "bright", stringTone: "palette" }
  }).themes[0].style;
  const whiteStringsStyle = createZedTheme({
    ...completePalette,
    settings: { ...completePalette.settings, readingTone: "neutral", stringTone: "white" }
  }).themes[0].style;

  assert.equal(paletteStringsStyle["terminal.foreground"], fakeColors.text);
  assert.equal(paletteStringsStyle.syntax.text.color, fakeColors.text);
  assert.equal(paletteStringsStyle.syntax.string.color, fakeColors.yellow);
  assert.equal(whiteStringsStyle["terminal.foreground"], fakeColors.subtext1);
  assert.equal(whiteStringsStyle.syntax.text.color, fakeColors.subtext1);
  assert.equal(whiteStringsStyle.syntax.string.color, fakeColors.text);
});

test("background studies change only the six background ladder roles", () => {
  const studies = createBackgroundStudyPalettes(completePalette);
  const backgroundRoles = ["surface2", "surface1", "surface0", "base", "mantle", "crust"];

  assert.equal(studies.length, backgroundStudies.length);
  assert.equal(studies.length, 6);
  for (const study of studies) {
    const changedRoles = ROLE_NAMES.filter(
      (role) => study.colors[role] !== completePalette.colors[role]
    );
    assert.deepEqual(changedRoles, backgroundRoles);
  }
});

test("soft-divider studies are new variants of every background study", () => {
  const studies = createBackgroundStudyPalettes(completePalette, { softDividers: true });

  assert.equal(studies.length, 6);
  for (const study of studies) {
    assert.match(study.name, /^Ink & Blossom BG2/);
    assert.equal(study.settings.separatorStyle, "soft");
  }
});

test("background shortlist preserves three promoted directions without removing studies", () => {
  assert.deepEqual(backgroundStudyFinalistIds, [
    "graphite",
    "mineral-slate",
    "tyrian-blue"
  ]);
  assert.equal(backgroundStudies.length, 6);
  assert.equal(backgroundStudyFinalistIds.includes("pine-black"), false);
  assert.equal(backgroundStudyFinalistIds.includes("olive-black"), false);
});

test("background matrix crosses every pinned syntax palette with every retained background", () => {
  const bases = ["Luminous Ink v3", "Sunlit Shell v3", "Spring Herbarium v4"].map((name) => ({
    ...completePalette,
    name: `Ink & Blossom — ${name}`
  }));
  const matrix = createBackgroundMatrixPalettes(bases);

  assert.equal(matrix.length, 9);
  assert.deepEqual(
    matrix.map((palette) => palette.name),
    bases.flatMap((base) =>
      ["Graphite", "Mineral Slate", "Tyrian Blue Black"].map(
        (background) =>
          `Ink & Blossom Matrix — ${base.name.replace("Ink & Blossom — ", "")} × ${background}`
      )
    )
  );
  for (const palette of matrix) {
    assert.equal(palette.settings.separatorStyle, "soft");
    const changedRoles = ROLE_NAMES.filter(
      (role) => palette.colors[role] !== completePalette.colors[role]
    );
    assert.deepEqual(changedRoles, ["surface2", "surface1", "surface0", "base", "mantle", "crust"]);
  }
});

test("Spring Herbarium parameters stay clearly active across every retained background", async () => {
  const springHerbarium = await readPalette(
    resolve(import.meta.dirname, "../palette/folio-spring-herbarium.json")
  );
  const matrix = createBackgroundMatrixPalettes([springHerbarium]);

  for (const palette of matrix) {
    assert.ok(
      contrastRatio(palette.colors.base, palette.colors.maroon) >= 7,
      `${palette.name} parameter contrast is too low`
    );
  }
});

test("Theme Lab pins the three final dark themes and archives every background study", () => {
  assert.deepEqual(
    presets.filter((preset) => preset.status === "pinned").map((preset) => preset.id),
    [
      "ink-blossom-luminous-v3",
      "ink-blossom-sunlit-shell-v3",
      "ink-blossom-spring-herbarium-v4"
    ]
  );
  assert.deepEqual(presets.filter((preset) => preset.status === "study"), []);
  assert.equal(
    presets.find((preset) => preset.id === "background-study-soft-violet-black")?.status,
    "discarded"
  );
  assert.equal(presets.some((preset) => preset.status === "kept"), false);
});

test("Theme Lab tone experiments never replace light-preset reading colors", () => {
  const lightPreset = presets.find((preset) => preset.id === "ink-blossom-luminous-light-v2");
  const colors = { ...lightPreset.colors };

  assert.deepEqual(
    resolveToneColors({ preset: lightPreset, colors, mainTone: "white", stringTone: "palette" }),
    colors
  );
});

test("new light counterparts keep readable syntax on their paper backgrounds", async () => {
  const files = ["folio-linen.json"];
  const readableRoles = [
    "rosewater", "flamingo", "pink", "mauve", "red", "maroon", "peach",
    "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender",
    "text", "subtext1", "subtext0"
  ];

  for (const file of files) {
    const palette = await readPalette(resolve(import.meta.dirname, "../palette", file));
    for (const role of readableRoles) {
      assert.ok(
        contrastRatio(palette.colors.base, palette.colors[role]) >= 4.5,
        `${palette.name} ${role} is below 4.5:1`
      );
    }
  }
});

test("italic setting disables italic-only decoration without changing colors", () => {
  const output = createZedTheme({
    ...completePalette,
    settings: { italics: false }
  });
  assert.equal(output.themes[0].style.syntax.keyword.font_style, null);
  assert.equal(output.themes[0].style.syntax.keyword.color, fakeColors.mauve);
});
