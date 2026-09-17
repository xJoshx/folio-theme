import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import { createZedTheme, createZedThemeFamily } from "../src/targets/zed.mjs";
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
  assert.equal(style["editor.foreground"], fakeColors.text);
  assert.equal(style.syntax.keyword.font_style, "italic");
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
