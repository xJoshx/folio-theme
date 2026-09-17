function parseHex(color) {
  return color
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16));
}

function mixHex(background, foreground, amount) {
  const base = parseHex(background);
  const accent = parseHex(foreground);
  const channels = base.map((channel, index) =>
    Math.round(channel + (accent[index] - channel) * amount)
      .toString(16)
      .padStart(2, "0")
  );
  return `#${channels.join("")}`;
}

export function createClaudeCodeTheme(palette) {
  const c = palette.colors;
  const isLight = palette.appearance === "light";
  const warmRole = palette.settings.terminalWarmRole ?? "red";
  const primaryRole = palette.settings.terminalWarmRole ?? "yellow";
  const warm = c[warmRole];
  const primary = c[primaryRole];
  const inverseText = isLight ? c.base : c.crust;

  return {
    name: palette.name,
    base: isLight ? "light" : "dark",
    overrides: {
      claude: primary,
      claudeShimmer: c.rosewater,
      text: c.text,
      inverseText,
      inactive: c.subtext0,
      inactiveShimmer: c.subtext1,
      subtle: c.overlay1,
      suggestion: c.blue,
      permission: c.mauve,
      permissionShimmer: c.pink,
      remember: c.yellow,

      success: c.green,
      error: warm,
      warning: c.yellow,
      warningShimmer: c.rosewater,
      merged: c.mauve,

      promptBorder: primary,
      promptBorderShimmer: c.rosewater,
      planMode: c.sky,
      autoAccept: c.green,
      bashBorder: c.teal,
      ide: c.blue,
      fastMode: c.yellow,
      fastModeShimmer: c.lavender,
      effortUltra: c.mauve,

      diffAdded: mixHex(c.base, c.green, isLight ? 0.13 : 0.18),
      diffRemoved: mixHex(c.base, warm, isLight ? 0.13 : 0.18),
      diffAddedDimmed: mixHex(c.base, c.green, isLight ? 0.07 : 0.1),
      diffRemovedDimmed: mixHex(c.base, warm, isLight ? 0.07 : 0.1),
      diffAddedWord: mixHex(c.base, c.green, isLight ? 0.24 : 0.34),
      diffRemovedWord: mixHex(c.base, warm, isLight ? 0.24 : 0.34),

      userMessageBackground: c.surface0,
      userMessageBackgroundHover: c.surface1,
      bashMessageBackgroundColor: c.mantle,
      memoryBackgroundColor: mixHex(c.base, c.yellow, isLight ? 0.08 : 0.12),
      selectionBg: mixHex(c.base, c.blue, isLight ? 0.2 : 0.32),

      rate_limit_fill: primary,
      rate_limit_empty: c.overlay0,
      briefLabelYou: c.mauve,
      briefLabelClaude: primary,

      red_FOR_SUBAGENTS_ONLY: warm,
      blue_FOR_SUBAGENTS_ONLY: c.sapphire,
      green_FOR_SUBAGENTS_ONLY: c.green,
      yellow_FOR_SUBAGENTS_ONLY: c.yellow,
      purple_FOR_SUBAGENTS_ONLY: c.mauve,
      orange_FOR_SUBAGENTS_ONLY: palette.settings.terminalWarmRole ? warm : c.peach,
      pink_FOR_SUBAGENTS_ONLY: c.pink,
      cyan_FOR_SUBAGENTS_ONLY: c.sky,

      rainbow_red: warm,
      rainbow_red_shimmer: c.flamingo,
      rainbow_orange: palette.settings.terminalWarmRole ? warm : c.peach,
      rainbow_orange_shimmer: c.rosewater,
      rainbow_yellow: c.yellow,
      rainbow_yellow_shimmer: c.lavender,
      rainbow_green: c.green,
      rainbow_green_shimmer: c.sky,
      rainbow_blue: c.blue,
      rainbow_blue_shimmer: c.sapphire,
      rainbow_indigo: c.lavender,
      rainbow_indigo_shimmer: c.sky,
      rainbow_violet: c.mauve,
      rainbow_violet_shimmer: c.pink
    }
  };
}

export function claudeCodeThemeFilename(palette) {
  return `${palette.name
    .replace(/^Folio\s+—\s+/, "folio-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.json`;
}
