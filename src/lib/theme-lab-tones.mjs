export const READING_TONES = Object.freeze({
  gray: "#b6bfc1",
  white: "#d8d6cf"
});

export const resolveToneColors = ({ preset, colors, mainTone, stringTone }) => {
  if (preset.appearance === "light") return { ...colors };

  return {
    ...colors,
    foreground: READING_TONES[mainTone],
    string: stringTone === "palette" ? preset.colors.string : READING_TONES[stringTone]
  };
};
