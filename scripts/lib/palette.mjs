import { readFile } from "node:fs/promises";

export const ACCENT_ROLES = Object.freeze([
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender"
]);

export const NEUTRAL_ROLES = Object.freeze([
  "text",
  "subtext1",
  "subtext0",
  "overlay2",
  "overlay1",
  "overlay0",
  "surface2",
  "surface1",
  "surface0",
  "base",
  "mantle",
  "crust"
]);

export const ROLE_NAMES = Object.freeze([...ACCENT_ROLES, ...NEUTRAL_ROLES]);

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export async function readPalette(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

export function validatePalette(palette, { allowNull = true } = {}) {
  const errors = [];

  if (!palette || typeof palette !== "object") {
    return ["Palette must be a JSON object."];
  }

  if (typeof palette.name !== "string" || palette.name.trim() === "") {
    errors.push("name must be a non-empty string.");
  }

  if (!['dark', 'light'].includes(palette.appearance)) {
    errors.push('appearance must be either "dark" or "light".');
  }

  if (typeof palette.settings?.italics !== "boolean") {
    errors.push("settings.italics must be a boolean.");
  }

  if (!palette.colors || typeof palette.colors !== "object") {
    errors.push("colors must be an object.");
    return errors;
  }

  const actualRoles = Object.keys(palette.colors);
  const missing = ROLE_NAMES.filter((role) => !(role in palette.colors));
  const extra = actualRoles.filter((role) => !ROLE_NAMES.includes(role));

  if (missing.length > 0) errors.push(`Missing roles: ${missing.join(", ")}.`);
  if (extra.length > 0) errors.push(`Unknown roles: ${extra.join(", ")}.`);

  for (const role of ROLE_NAMES) {
    const value = palette.colors[role];
    if (value === null && allowNull) continue;
    if (!HEX_COLOR.test(value ?? "")) {
      errors.push(`${role} must be a six-digit hex color${allowNull ? " or null" : ""}.`);
    }
  }

  return errors;
}

export function assertPaletteReady(palette) {
  const errors = validatePalette(palette, { allowNull: false });
  if (errors.length > 0) {
    throw new Error(`Palette is not ready:\n- ${errors.join("\n- ")}`);
  }
}

export function alpha(hex, opacity) {
  if (!HEX_COLOR.test(hex)) throw new TypeError(`Invalid hex color: ${hex}`);
  if (opacity < 0 || opacity > 1) throw new RangeError("Opacity must be between 0 and 1.");
  const channel = Math.round(opacity * 255).toString(16).padStart(2, "0");
  return `${hex}${channel}`;
}

function relativeLuminance(hex) {
  if (!HEX_COLOR.test(hex)) throw new TypeError(`Invalid hex color: ${hex}`);
  const channels = hex.slice(1).match(/.{2}/g).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(foreground, background) {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (light + 0.05) / (dark + 0.05);
}
