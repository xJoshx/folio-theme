import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ROLE_NAMES, readPalette, validatePalette } from "./lib/palette.mjs";
import {
  createBackgroundMatrixPalettes,
  createBackgroundStudyPalettes
} from "../src/lib/background-studies.prototype.mjs";

const root = resolve(import.meta.dirname, "..");
const palettePath = resolve(root, "palette/wada-night.json");
const palette = await readPalette(palettePath);
const errors = validatePalette(palette, { allowNull: true });
const releasePaletteFiles = [
  "folio-luminous-ink.json",
  "folio-sunlit-shell.json",
  "folio-spring-herbarium.json",
  "folio-linen.json"
];

for (const file of releasePaletteFiles) {
  const releasePalette = await readPalette(resolve(root, "palette", file));
  errors.push(
    ...validatePalette(releasePalette, { allowNull: false }).map((error) => `${file}: ${error}`)
  );
}

const studyBase = await readPalette(resolve(root, "palette/ink-and-blossom-luminous-v2.json"));
for (const studyPalette of createBackgroundStudyPalettes(studyBase)) {
  errors.push(
    ...validatePalette(studyPalette, { allowNull: false }).map(
      (error) => `${studyPalette.name}: ${error}`
    )
  );
}
for (const studyPalette of createBackgroundStudyPalettes(studyBase, { softDividers: true })) {
  errors.push(
    ...validatePalette(studyPalette, { allowNull: false }).map(
      (error) => `${studyPalette.name}: ${error}`
    )
  );
}

const pinnedDarkPalettes = await Promise.all(
  releasePaletteFiles.slice(0, 3).map((file) => readPalette(resolve(root, "palette", file)))
);
const matrixPalettes = createBackgroundMatrixPalettes(pinnedDarkPalettes);
for (const matrixPalette of matrixPalettes) {
  errors.push(
    ...validatePalette(matrixPalette, { allowNull: false }).map(
      (error) => `${matrixPalette.name}: ${error}`
    )
  );
}

for (const path of [
  "extension.toml",
  "schemas/palette.schema.json",
  "src/targets/claude-code.mjs",
  "src/targets/orca.mjs",
  "src/targets/zed.mjs",
  "packages/claude-code/.claude-plugin/plugin.json",
  "packages/claude-code/README.md",
  "packages/orca/README.md",
  "docs/PLAN.md"
]) {
  try {
    await access(resolve(root, path));
  } catch {
    errors.push(`Required file is missing: ${path}.`);
  }
}

const schema = JSON.parse(await readFile(resolve(root, "schemas/palette.schema.json"), "utf8"));
const schemaRoles = schema.properties.colors.required;
if (JSON.stringify(schemaRoles) !== JSON.stringify(ROLE_NAMES)) {
  errors.push("Palette schema roles differ from the generator role contract.");
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  const empty = ROLE_NAMES.filter((role) => palette.colors[role] === null);
  console.log(
    `Package valid: ${releasePaletteFiles.length} release palettes, 12 background studies, and ${matrixPalettes.length} matrix themes ready; ${empty.length} legacy draft roles remain empty.`
  );
}
