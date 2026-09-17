type ThemeColors = Record<string, string>;

interface Preset {
  id: string;
  name: string;
  status?: "pinned" | "kept" | "candidate" | "study" | "discarded";
  appearance?: "dark" | "light";
  source: string;
  description: string;
  colors: ThemeColors;
  provenance?: Record<string, string>;
}

interface StoredState {
  presetId: string;
  colors: ThemeColors;
}

const STORAGE_KEY = "wada-theme-lab-state-v7";
const presetsNode = document.querySelector<HTMLScriptElement>("#themeLabPresets");
const presets: Preset[] = JSON.parse(presetsNode?.textContent ?? "[]");
const roles = Object.keys(presets[0]?.colors ?? {});

const currentName = document.querySelector<HTMLElement>("[data-current-name]");
const currentDescription = document.querySelector<HTMLElement>("[data-current-description]");
const referenceName = document.querySelector<HTMLElement>("[data-reference-name]");
const referenceEditor = document.querySelector<HTMLElement>("[data-editor-reference]");
const changedCount = document.querySelector<HTMLElement>("[data-changed-count]");
const toast = document.querySelector<HTMLElement>("[data-toast]");
const offlineStatus = document.querySelector<HTMLElement>("[data-offline-status]");

let activePreset =
  presets.find((preset) => preset.status === "pinned") ??
  presets.find((preset) => preset.status === "study") ??
  presets.find((preset) => preset.status === "candidate" && preset.appearance !== "light") ??
  presets.find((preset) => preset.status === "candidate") ??
  presets.find((preset) => preset.status !== "discarded") ??
  presets[0];
let colors: ThemeColors = { ...activePreset.colors };
let toastTimer = 0;

const kebab = (value: string) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const normalizeHex = (value: string) => value.trim().toLowerCase();
const validHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

const luminance = (hex: string) => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

const showToast = (message: string) => {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = "true";
  toastTimer = window.setTimeout(() => {
    delete toast.dataset.visible;
  }, 1800);
};

const applyVariables = (target: HTMLElement, values: ThemeColors) => {
  for (const [role, value] of Object.entries(values)) {
    target.style.setProperty(`--theme-${kebab(role)}`, value);
  }
};

const createZedTheme = () => {
  const isLight = activePreset.appearance === "light";
  const chromeText = isLight ? colors.foreground : "#c8cbc9";
  const chromeMuted = isLight ? colors.muted : "#9fa5a1";
  const useSoftSeparators =
    activePreset.status === "pinned" || activePreset.id.startsWith("background-study-soft-");
  const divider = useSoftSeparators ? `${colors.border}61` : colors.border;
  const focusedDivider = useSoftSeparators ? "#9fa5a147" : colors.bracket;
  const selectedDivider = useSoftSeparators ? "#9fa5a15c" : colors.keyword;

  return ({
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: `${activePreset.name} · Flight Study`,
  author: "Ink & Blossom contributors",
  themes: [
    {
      name: `${activePreset.name} · Flight Study`,
      appearance: activePreset.appearance ?? "dark",
      style: {
        "background.appearance": "opaque",
        background: colors.background,
        "surface.background": colors.surface,
        border: divider,
        "border.variant": divider,
        "border.focused": focusedDivider,
        "border.selected": selectedDivider,
        text: chromeText,
        "text.muted": chromeMuted,
        "text.accent": colors.keyword,
        icon: chromeText,
        "icon.muted": chromeMuted,
        "title_bar.background": colors.background,
        "toolbar.background": colors.background,
        "tab_bar.background": colors.background,
        "tab.active_background": colors.surface,
        "tab.inactive_background": colors.background,
        "panel.focused_border": focusedDivider,
        "pane.focused_border": focusedDivider,
        "pane_group.border": divider,
        "editor.background": colors.background,
        "editor.foreground": colors.foreground,
        "editor.gutter.background": colors.background,
        "editor.active_line.background": colors.activeLine,
        "editor.line_number": colors.lineNumber,
        "editor.active_line_number": colors.foreground,
        "editor.indent_guide": colors.border,
        "editor.indent_guide_active": colors.added,
        "scrollbar.track.background": colors.background,
        "scrollbar.track.border": colors.border,
        "scrollbar.thumb.background": `${colors.keyword}33`,
        "scrollbar.thumb.hover_background": `${colors.keyword}66`,
        "minimap.thumb.background": `${colors.keyword}2b`,
        "minimap.thumb.hover_background": `${colors.keyword}52`,
        created: colors.added,
        "created.border": colors.added,
        "version_control.added": colors.added,
        accents: [
          colors.keyword,
          colors.string,
          colors.bracket,
          colors.added,
          colors.operator,
          colors.constant,
          colors.special
        ],
        syntax: {
          text: { color: colors.foreground },
          variable: { color: colors.foreground },
          "variable.member": { color: colors.foreground },
          "variable.parameter": { color: colors.foreground },
          "variable.special": { color: colors.constant },
          constant: { color: colors.constant, font_style: "italic" },
          type: { color: colors.foreground },
          "type.builtin": { color: colors.foreground },
          function: { color: colors.foreground },
          "function.call": { color: colors.foreground },
          "function.method": { color: colors.foreground },
          module: { color: colors.foreground },
          namespace: { color: colors.foreground },
          keyword: { color: colors.keyword, font_style: "italic" },
          "keyword.import": { color: colors.keyword, font_style: "italic" },
          "keyword.modifier": { color: colors.keyword, font_style: "italic" },
          "keyword.type": { color: colors.keyword, font_style: "italic" },
          "keyword.operator": { color: colors.keyword, font_style: "italic" },
          operator: { color: colors.operator },
          string: { color: colors.string },
          "string.special": { color: colors.special },
          "string.special.path": { color: colors.string },
          punctuation: { color: colors.foreground },
          "punctuation.delimiter": { color: colors.foreground },
          "punctuation.bracket": { color: colors.bracket },
          comment: { color: colors.muted, font_style: "italic" }
        }
      }
    }
  ]
  });
};

const persist = () => {
  const state: StoredState = { presetId: activePreset.id, colors };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const updateContrast = () => {
  for (const role of ["foreground", "keyword", "string", "muted"]) {
    const output = document.querySelector<HTMLElement>(`[data-contrast="${role}"]`);
    if (!output) continue;
    const ratio = contrastRatio(colors[role], colors.background);
    output.textContent = `${ratio.toFixed(2)}:1`;
    output.dataset.pass = String(ratio >= 4.5);
    output.title = ratio >= 4.5 ? "Passes the 4.5:1 reference" : "Below the 4.5:1 reference";
  }
};

const updateControls = () => {
  let changed = 0;

  for (const role of roles) {
    const colorInput = document.querySelector<HTMLInputElement>(`[data-color-input="${role}"]`);
    const hexInput = document.querySelector<HTMLInputElement>(`[data-hex-input="${role}"]`);
    const control = document.querySelector<HTMLElement>(`[data-role-control="${role}"]`);
    const origin = document.querySelector<HTMLElement>(`[data-origin="${role}"]`);
    const value = colors[role];
    const isChanged = value.toLowerCase() !== activePreset.colors[role].toLowerCase();

    if (colorInput) colorInput.value = value;
    if (hexInput) {
      hexInput.value = value.toUpperCase();
      hexInput.removeAttribute("aria-invalid");
    }
    if (control) control.dataset.changed = String(isChanged);
    if (origin) {
      const source = activePreset.provenance?.[role] ?? `Palette blend · ${activePreset.source}`;
      origin.textContent = isChanged ? "Edited locally" : source;
      origin.title = isChanged ? `Started from ${source}` : source;
    }
    if (isChanged) changed += 1;
  }

  if (changedCount) changedCount.textContent = `${changed} changed`;
  updateContrast();
};

const render = ({ save = true } = {}) => {
  applyVariables(document.documentElement, colors);
  applyVariables(referenceEditor ?? document.documentElement, activePreset.colors);

  if (currentName) currentName.textContent = activePreset.name;
  if (currentDescription) currentDescription.textContent = activePreset.description;
  if (referenceName) referenceName.textContent = activePreset.name;

  document.querySelectorAll<HTMLElement>("[data-preset]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.preset === activePreset.id));
  });

  updateControls();
  if (save) persist();
};

const selectPreset = (id: string) => {
  const preset = presets.find((candidate) => candidate.id === id);
  if (!preset) return;
  activePreset = preset;
  colors = { ...preset.colors };
  render();
};

for (const button of document.querySelectorAll<HTMLElement>("[data-preset]")) {
  button.addEventListener("click", () => selectPreset(button.dataset.preset ?? ""));
}

for (const input of document.querySelectorAll<HTMLInputElement>("[data-color-input]")) {
  input.addEventListener("input", () => {
    const role = input.dataset.colorInput;
    if (!role) return;
    colors = { ...colors, [role]: normalizeHex(input.value) };
    render();
  });
}

for (const input of document.querySelectorAll<HTMLInputElement>("[data-hex-input]")) {
  input.addEventListener("input", () => {
    const role = input.dataset.hexInput;
    const value = normalizeHex(input.value);
    if (!role || !validHex(value)) {
      input.setAttribute("aria-invalid", "true");
      return;
    }
    colors = { ...colors, [role]: value };
    render();
  });

  input.addEventListener("blur", () => {
    const role = input.dataset.hexInput;
    if (role && !validHex(input.value)) input.value = colors[role].toUpperCase();
    input.removeAttribute("aria-invalid");
  });
}

document.querySelector<HTMLElement>("[data-reset]")?.addEventListener("click", () => {
  colors = { ...activePreset.colors };
  render();
  showToast("Preset restored");
});

const jsonText = () => `${JSON.stringify(createZedTheme(), null, 2)}\n`;

document.querySelector<HTMLElement>("[data-copy]")?.addEventListener("click", async () => {
  await navigator.clipboard.writeText(jsonText());
  showToast("Zed JSON copied");
});

document.querySelector<HTMLElement>("[data-export]")?.addEventListener("click", () => {
  const blob = new Blob([jsonText()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `wada-${activePreset.id}-flight-study.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Zed theme downloaded");
});

const variants = [
  { id: "a", label: "A — Workbench" },
  { id: "b", label: "B — Palette rail" },
  { id: "c", label: "C — Compare" }
];

const variantLabel = document.querySelector<HTMLElement>("[data-variant-label]");
const variantSwitcher = document.querySelector<HTMLElement>(".prototype-switcher");

const setVariant = (id: string) => {
  const variant = variants.find((candidate) => candidate.id === id) ?? variants[0];
  document.body.dataset.variant = variant.id;
  if (variantLabel) variantLabel.textContent = variant.label;
  const url = new URL(window.location.href);
  url.searchParams.set("variant", variant.id);
  window.history.replaceState({}, "", url);
};

const cycleVariant = (direction: number) => {
  const currentIndex = variants.findIndex((variant) => variant.id === document.body.dataset.variant);
  const nextIndex = (currentIndex + direction + variants.length) % variants.length;
  setVariant(variants[nextIndex].id);
};

if (variantSwitcher) {
  document.querySelector<HTMLElement>("[data-variant-previous]")?.addEventListener("click", () => {
    cycleVariant(-1);
  });
  document.querySelector<HTMLElement>("[data-variant-next]")?.addEventListener("click", () => {
    cycleVariant(1);
  });

  window.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement | null;
    if (target?.matches("input, textarea, [contenteditable]")) return;
    if (event.key === "ArrowLeft") cycleVariant(-1);
    if (event.key === "ArrowRight") cycleVariant(1);
  });
}

const requestedVariant = new URL(window.location.href).searchParams.get("variant") ?? "a";
setVariant(requestedVariant);

try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as StoredState | null;
  const storedPreset = presets.find((preset) => preset.id === stored?.presetId);
  const hasEveryRole = roles.every((role) => validHex(stored?.colors?.[role] ?? ""));
  if (storedPreset && stored && hasEveryRole) {
    activePreset = storedPreset;
    colors = { ...stored.colors };
  }
} catch {
  localStorage.removeItem(STORAGE_KEY);
}

render({ save: false });

if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
  navigator.serviceWorker
    .register("/theme-lab-sw.js", { scope: "/theme-lab-prototype/" })
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      if (!offlineStatus) return;
      offlineStatus.dataset.ready = "true";
      const label = offlineStatus.querySelector("span");
      if (label) label.textContent = "Available offline";
    })
    .catch(() => {
      const label = offlineStatus?.querySelector("span");
      if (label) label.textContent = "Local save enabled";
    });
} else if (offlineStatus) {
  offlineStatus.dataset.ready = "true";
  const label = offlineStatus.querySelector("span");
  if (label) label.textContent = "Local save enabled";
}
