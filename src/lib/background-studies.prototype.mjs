// PROTOTYPE: temporary background-only studies. Keep syntax fixed until a
// background direction is selected, then fold the winner into release palettes.
export const backgroundStudies = [
  {
    id: "graphite",
    name: "Graphite",
    source: "Wada Black + Neutral Gray · 139",
    description: "The control: a dry, nearly neutral charcoal with no obvious colour cast.",
    colors: {
      crust: "#0b0c0e",
      base: "#111214",
      mantle: "#161719",
      surface0: "#1d1f21",
      surface1: "#292c2f",
      surface2: "#373b3e"
    }
  },
  {
    id: "mineral-slate",
    name: "Mineral Slate",
    source: "Wada Black + Slate Color · 296",
    description: "A cool gray-black carrying a restrained mineral-blue undertone.",
    colors: {
      crust: "#0a0d0f",
      base: "#101519",
      mantle: "#151b20",
      surface0: "#1c242a",
      surface1: "#29343b",
      surface2: "#39464e"
    }
  },
  {
    id: "pine-black",
    name: "Pine Black",
    source: "Wada Black + Deep Slate Green · 166 / 318",
    description: "A deeper forest black: clearly green, but cooler and less yellow than the current themes.",
    colors: {
      crust: "#070d0b",
      base: "#0b1512",
      mantle: "#101d18",
      surface0: "#172720",
      surface1: "#23382e",
      surface2: "#314a3d"
    }
  },
  {
    id: "olive-black",
    name: "Olive Black",
    source: "Wada Black + Light Brownish Olive · 318",
    description: "A deliberate yellow-olive black, separated from green so we can judge the warmth honestly.",
    colors: {
      crust: "#0d0d07",
      base: "#15150d",
      mantle: "#1c1b11",
      surface0: "#282619",
      surface1: "#393624",
      surface2: "#4b4730"
    }
  },
  {
    id: "tyrian-blue",
    name: "Tyrian Blue Black",
    source: "Wada Black + Dark Tyrian Blue",
    description: "A blue-black alternative that keeps the warm Wada accents crisp without feeling navy.",
    colors: {
      crust: "#070b10",
      base: "#0c131b",
      mantle: "#111b26",
      surface0: "#182635",
      surface1: "#25384a",
      surface2: "#344b60"
    }
  },
  {
    id: "violet-black",
    name: "Violet Black",
    source: "Wada Black + Dull Violet Black · 289",
    description: "A restrained purple-black that gives the greens and yellows a more graphic contrast.",
    colors: {
      crust: "#0a0710",
      base: "#130d1c",
      mantle: "#1a1226",
      surface0: "#241a33",
      surface1: "#352747",
      surface2: "#49365e"
    }
  }
];

// Keep the complete study set generated for in-editor comparison while the
// Theme Lab promotes only the directions selected during review.
export const backgroundStudyFinalistIds = Object.freeze([
  "graphite",
  "mineral-slate",
  "tyrian-blue"
]);

export function createBackgroundStudyPalettes(basePalette, { softDividers = false } = {}) {
  return backgroundStudies.map((study) => ({
    ...basePalette,
    name: `Ink & Blossom ${softDividers ? "BG2" : "BG"} — ${study.name}`,
    settings: {
      ...basePalette.settings,
      ...(softDividers ? { separatorStyle: "soft" } : {})
    },
    colors: {
      ...basePalette.colors,
      ...study.colors
    }
  }));
}

// PROTOTYPE: cross the three pinned syntax palettes with the three retained
// backgrounds. Delete this matrix after one pairing per theme is selected.
export function createBackgroundMatrixPalettes(basePalettes) {
  const retainedStudies = backgroundStudies.filter((study) =>
    backgroundStudyFinalistIds.includes(study.id)
  );

  return basePalettes.flatMap((basePalette) => {
    const paletteName = basePalette.name.replace(/^Ink & Blossom — /, "");

    return retainedStudies.map((study) => ({
      ...basePalette,
      name: `Ink & Blossom Matrix — ${paletteName} × ${study.name}`,
      settings: {
        ...basePalette.settings,
        separatorStyle: "soft"
      },
      colors: {
        ...basePalette.colors,
        ...study.colors
      }
    }));
  });
}
