const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function relativeLuminance(hex) {
  if (!HEX_COLOR.test(hex)) throw new TypeError(`Invalid hex color: ${hex}`);

  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(first, second) {
  const light = Math.max(relativeLuminance(first), relativeLuminance(second));
  const dark = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (light + 0.05) / (dark + 0.05);
}

export function readableForeground(background) {
  const ink = "#101318";
  const paper = "#fffdf6";
  return contrastRatio(ink, background) >= contrastRatio(paper, background) ? ink : paper;
}

export function buildCombinations(colors) {
  const combinations = new Map();

  colors.forEach((color, colorIndex) => {
    for (const id of color.combinations) {
      const combination = combinations.get(id) ?? [];
      combination.push({ ...color, colorIndex });
      combinations.set(id, combination);
    }
  });

  return [...combinations.entries()]
    .sort(([first], [second]) => first - second)
    .map(([id, combinationColors], sourceIndex) => {
      const luminances = combinationColors.map((color) => relativeLuminance(color.hex));
      const darkest = Math.min(...luminances);
      const lightest = Math.max(...luminances);
      const pairContrast = (lightest + 0.05) / (darkest + 0.05);

      return {
        id,
        sourceIndex,
        colors: combinationColors,
        size: combinationColors.length,
        darkest,
        lightest,
        pairContrast,
        hasDarkAnchor: darkest <= 0.035,
        searchText: [
          id,
          ...combinationColors.flatMap((color) => [color.name, color.hex])
        ]
          .join(" ")
          .toLocaleLowerCase("en")
      };
    });
}
