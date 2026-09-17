const DARK_ANSI_ROLES = Object.freeze({
  normal: Object.freeze({
    black: "surface1",
    red: "red",
    green: "green",
    yellow: "yellow",
    blue: "blue",
    magenta: "pink",
    cyan: "teal",
    white: "subtext0"
  }),
  bright: Object.freeze({
    black: "surface2",
    red: "flamingo",
    green: "green",
    yellow: "peach",
    blue: "sapphire",
    magenta: "mauve",
    cyan: "sky",
    white: "subtext1"
  })
});

const LIGHT_ANSI_ROLES = Object.freeze({
  normal: Object.freeze({
    ...DARK_ANSI_ROLES.normal,
    black: "text"
  }),
  bright: Object.freeze({
    ...DARK_ANSI_ROLES.bright,
    black: "surface2"
  })
});

const YAML_COLOR_KEYS = Object.freeze([
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white"
]);

function mapAnsiPalette(colors, roles) {
  return Object.fromEntries(
    YAML_COLOR_KEYS.map((name) => [name, colors[roles[name]]])
  );
}

function resolveAnsiRoles(palette) {
  const roles = palette.appearance === "light" ? LIGHT_ANSI_ROLES : DARK_ANSI_ROLES;
  const warmRole = palette.settings.terminalWarmRole;

  if (!warmRole) return roles;

  return {
    normal: { ...roles.normal, red: warmRole },
    bright: { ...roles.bright, red: warmRole, yellow: warmRole }
  };
}

export function createOrcaTerminalTheme(palette) {
  const colors = palette.colors;
  const ansiRoles = resolveAnsiRoles(palette);

  return {
    name: palette.name,
    accent: colors.mauve,
    cursor: colors.text,
    background: colors.base,
    foreground: colors.text,
    details: palette.appearance === "light" ? "lighter" : "darker",
    terminal_colors: {
      normal: mapAnsiPalette(colors, ansiRoles.normal),
      bright: mapAnsiPalette(colors, ansiRoles.bright)
    }
  };
}

function quoteYaml(value) {
  return JSON.stringify(value);
}

export function serializeOrcaTerminalTheme(theme) {
  const lines = [
    `name: ${quoteYaml(theme.name)}`,
    `accent: ${quoteYaml(theme.accent)}`,
    `cursor: ${quoteYaml(theme.cursor)}`,
    `background: ${quoteYaml(theme.background)}`,
    `foreground: ${quoteYaml(theme.foreground)}`,
    `details: ${theme.details}`,
    "terminal_colors:",
    "  normal:"
  ];

  for (const name of YAML_COLOR_KEYS) {
    lines.push(`    ${name}: ${quoteYaml(theme.terminal_colors.normal[name])}`);
  }

  lines.push("  bright:");
  for (const name of YAML_COLOR_KEYS) {
    lines.push(`    ${name}: ${quoteYaml(theme.terminal_colors.bright[name])}`);
  }

  return `${lines.join("\n")}\n`;
}

export function orcaThemeFilename(palette) {
  return `${palette.name
    .replace(/^Folio\s+—\s+/, "folio-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.yaml`;
}
