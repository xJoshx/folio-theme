import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { assertPaletteReady, readPalette } from "./lib/palette.mjs";
import { createZedThemeFamily } from "../src/targets/zed.mjs";
import {
  createBackgroundMatrixPalettes,
  createBackgroundStudyPalettes
} from "../src/lib/background-studies.prototype.mjs";

const root = resolve(import.meta.dirname, "..");
const paletteFiles = [
  "folio-luminous-ink.json",
  "folio-sunlit-shell.json",
  "folio-spring-herbarium.json",
  "folio-linen.json"
];
const palettes = await Promise.all(
  paletteFiles.map((file) => readPalette(resolve(root, "palette", file)))
);
const backgroundStudyBase = await readPalette(
  resolve(root, "palette", "ink-and-blossom-luminous-v2.json")
);
const backgroundStudyPalettes = createBackgroundStudyPalettes(backgroundStudyBase);
const softDividerStudyPalettes = createBackgroundStudyPalettes(backgroundStudyBase, {
  softDividers: true
});
const backgroundMatrixPalettes = createBackgroundMatrixPalettes(palettes.slice(0, 3));

for (const palette of [
  ...palettes,
  ...backgroundStudyPalettes,
  ...softDividerStudyPalettes,
  ...backgroundMatrixPalettes
]) {
  try {
    assertPaletteReady(palette);
  } catch (error) {
    console.error(`${palette.name}: ${error.message}`);
    process.exit(1);
  }
}

const outputDirectory = resolve(root, "themes");
const studyOutputDirectory = resolve(root, "studies", "generated");
const outputPath = resolve(outputDirectory, "folio.json");
const legacyOutputPath = resolve(outputDirectory, "ink-and-blossom.json");
const studyOutputPath = resolve(studyOutputDirectory, "ink-and-blossom-background-studies.json");
const softStudyOutputPath = resolve(
  studyOutputDirectory,
  "ink-and-blossom-background-studies-soft.json"
);
const matrixOutputPath = resolve(studyOutputDirectory, "ink-and-blossom-background-matrix.json");
const theme = createZedThemeFamily(palettes, {
  name: "Folio",
  author: "José Vizcaíno"
});
const backgroundStudyTheme = createZedThemeFamily(backgroundStudyPalettes, {
  name: "Ink & Blossom Background Studies"
});
const softDividerStudyTheme = createZedThemeFamily(softDividerStudyPalettes, {
  name: "Ink & Blossom Background Studies — Soft Dividers"
});
const backgroundMatrixTheme = createZedThemeFamily(backgroundMatrixPalettes, {
  name: "Ink & Blossom Background Matrix"
});

await mkdir(outputDirectory, { recursive: true });
await mkdir(studyOutputDirectory, { recursive: true });
// Only the release candidate belongs in Zed's themes directory. Its source
// palettes remain intact, so the previous generated family is reproducible.
await rm(legacyOutputPath, { force: true });
await Promise.all([
  writeFile(outputPath, `${JSON.stringify(theme, null, 2)}\n`),
  writeFile(studyOutputPath, `${JSON.stringify(backgroundStudyTheme, null, 2)}\n`),
  writeFile(softStudyOutputPath, `${JSON.stringify(softDividerStudyTheme, null, 2)}\n`),
  writeFile(matrixOutputPath, `${JSON.stringify(backgroundMatrixTheme, null, 2)}\n`)
]);

console.log(`Generated ${outputPath}`);
console.log(`Generated ${studyOutputPath}`);
console.log(`Generated ${softStudyOutputPath}`);
console.log(`Generated ${matrixOutputPath}`);
