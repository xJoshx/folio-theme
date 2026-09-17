import { alpha } from "../../scripts/lib/palette.mjs";

const TRANSPARENT = "#00000000";

function createZedThemeEntry(palette) {
  const c = palette.colors;
  const isLight = palette.appearance === "light";
  const translucent = (role, opacity) => alpha(c[role], opacity);
  const useItalics = palette.settings.italics;
  const vimModeText = isLight ? c.base : c.crust;
  const chromeText = isLight ? c.text : c.subtext1;
  const chromeMuted = isLight ? c.subtext1 : c.subtext0;
  // Long-form content and strings remain independent so each palette can keep
  // neutral reading text while retaining its own dominant syntax accent.
  const readingTextRole = isLight || palette.settings.readingTone === "bright" ? "text" : "subtext1";
  const stringTextRole = isLight
    ? "yellow"
    : palette.settings.stringTone === "white"
      ? "text"
      : palette.settings.stringTone === "gray"
        ? "subtext1"
        : "yellow";
  const useSoftSeparators = palette.settings.separatorStyle === "soft";
  const divider = useSoftSeparators ? translucent("surface1", 0.38) : c.overlay0;
  const dividerVariant = useSoftSeparators ? translucent("surface2", 0.34) : c.surface1;
  const focusedDivider = useSoftSeparators ? translucent("subtext0", 0.28) : c.lavender;
  const selectedDivider = useSoftSeparators ? translucent("subtext0", 0.36) : c.mauve;

  const syntaxStyle = (role, { italic = false, weight = null } = {}) => ({
    color: c[role],
    font_style: italic && useItalics ? "italic" : null,
    font_weight: weight
  });

  const syntax = {};
  const assignSyntax = (scopes, role, options) => {
    for (const scope of scopes) syntax[scope] = syntaxStyle(role, options);
  };

  // Identifiers use a restrained semantic hierarchy while consuming
  // Catppuccin-shaped palette roles.
  assignSyntax(["variable"], "text");
  assignSyntax(["text"], readingTextRole);
  assignSyntax(["variable.builtin", "variable.special", "symbol", "predoc"], "red", {
    italic: true
  });
  assignSyntax(["variable.parameter", "parameter", "primary", "embedded"], "maroon");
  assignSyntax(["variable.member", "field", "property"], "blue");
  assignSyntax(["constant", "constant.builtin", "number", "number.float", "float"], "peach");
  assignSyntax(["constant.macro", "function.macro"], "rosewater");
  assignSyntax(["module", "namespace"], "yellow", { italic: true });
  assignSyntax(["label", "concept"], "sapphire");

  // Literals remain independently tunable from ordinary reading text.
  assignSyntax(["string", "text.literal"], stringTextRole);
  assignSyntax(["string.documentation", "string.doc", "character"], "teal", {
    italic: true
  });
  assignSyntax(
    [
      "string.regexp",
      "string.regex",
      "string.escape",
      "string.special",
      "string.special.path",
      "character.special"
    ],
    "pink"
  );
  assignSyntax(["string.special.symbol", "punctuation.special.symbol"], "red");
  assignSyntax(["string.special.url"], "rosewater", { italic: true });
  assignSyntax(["boolean"], "red");

  // Markup, types, and functions.
  assignSyntax(["tag", "function", "function.call", "function.method", "function.method.call"], "blue");
  assignSyntax(["tag.attribute", "attribute", "selector.pseudo"], "yellow", { italic: true });
  assignSyntax(["tag.delimiter", "punctuation.list_marker", "enum"], "teal", { weight: 700 });
  assignSyntax(["type", "type.definition", "type.interface", "type.super"], "peach");
  assignSyntax(["type.builtin"], "mauve", { italic: true });
  assignSyntax(["type.class.definition"], "yellow", { weight: 700 });
  assignSyntax(["function.builtin"], "red");
  assignSyntax(["function.decorator"], "peach");
  assignSyntax(["constructor"], "flamingo");
  assignSyntax(["operator"], "teal");

  // Keywords and directives.
  assignSyntax(
    [
      "keyword",
      "keyword.modifier",
      "keyword.type",
      "keyword.coroutine",
      "keyword.function",
      "keyword.operator",
      "keyword.import",
      "keyword.export",
      "keyword.repeat",
      "keyword.return",
      "keyword.debug",
      "keyword.exception",
      "keyword.conditional",
      "keyword.conditional.ternary",
      "tag.doctype"
    ],
    "mauve",
    { italic: true }
  );
  assignSyntax(["keyword.directive", "keyword.directive.define", "preproc"], "pink");

  // Punctuation and comments stay quiet so semantic tokens dominate.
  assignSyntax(["punctuation", "punctuation.delimiter", "punctuation.bracket"], "overlay2");
  assignSyntax(["punctuation.special"], "pink");
  assignSyntax(["comment", "comment.doc", "comment.documentation"], "overlay1", {
    italic: true
  });
  assignSyntax(["comment.info"], "teal", { italic: true });
  assignSyntax(["comment.error"], "red", { italic: true });
  assignSyntax(["comment.warning", "comment.warn"], "yellow", { italic: true });
  assignSyntax(["comment.hint"], "blue", { italic: true });
  assignSyntax(["comment.todo"], "flamingo", { italic: true });
  assignSyntax(["comment.note"], "rosewater", { italic: true });

  // Diffs, prose, and Zed-specific captures.
  assignSyntax(["diff.plus"], "green");
  assignSyntax(["diff.minus"], "red");
  assignSyntax(["emphasis.strong"], "maroon", { weight: 700 });
  assignSyntax(["emphasis"], "maroon", { italic: true });
  assignSyntax(["hint"], "overlay1", { italic: true });
  assignSyntax(["link_text"], "lavender");
  assignSyntax(["link_uri"], "blue", { italic: true });
  assignSyntax(["parent"], "peach");
  assignSyntax(["predictive"], "overlay0");
  assignSyntax(["title"], "red", { weight: 800 });
  assignSyntax(["variant"], "red");

  // Markdown has its own capture suffixes. Keep the source markup visible,
  // but make it feel like document structure rather than another programming
  // language: headings and emphasis use a warm editorial accent, while
  // delimiters and list markers stay quieter.
  assignSyntax(["title.markup"], "mauve", { weight: 700 });
  assignSyntax(["emphasis.markup"], "peach", { italic: true });
  assignSyntax(["emphasis.strong.markup"], "peach", { weight: 700 });
  assignSyntax(["strikethrough.markup"], "overlay1");
  assignSyntax(["text.literal.markup"], "teal", {
    weight: 600
  });
  syntax["text.literal.markup"].background_color = translucent("surface1", 0.55);
  assignSyntax(["punctuation.markup"], "overlay1");
  assignSyntax(["punctuation.list_marker.markup"], "lavender", { weight: 700 });
  assignSyntax(["punctuation.embedded.markup"], "pink");
  assignSyntax(["link_text.markup"], "sky");
  assignSyntax(["link_uri.markup"], "blue", { italic: true });

  const collaborationRoles = [
    "rosewater",
    "lavender",
    "blue",
    "sapphire",
    "sky",
    "teal",
    "green",
    "yellow"
  ];

  const style = {
    accents: [c.red, c.peach, c.yellow, c.green, c.sapphire, c.lavender, c.mauve],

    "vim.mode.text": vimModeText,
    "vim.normal.foreground": vimModeText,
    "vim.helix_normal.foreground": vimModeText,
    "vim.visual.foreground": vimModeText,
    "vim.helix_select.foreground": vimModeText,
    "vim.insert.foreground": vimModeText,
    "vim.visual_line.foreground": vimModeText,
    "vim.visual_block.foreground": vimModeText,
    "vim.replace.foreground": vimModeText,
    "vim.normal.background": c.rosewater,
    "vim.helix_normal.background": c.rosewater,
    "vim.visual.background": c.lavender,
    "vim.helix_select.background": c.lavender,
    "vim.insert.background": c.green,
    "vim.visual_line.background": c.lavender,
    "vim.visual_block.background": c.mauve,
    "vim.replace.background": c.maroon,

    "background.appearance": "opaque",
    // The soft study profile keeps pane geometry legible without borrowing
    // bright syntax colours. Element fills remain solid enough for controls.
    border: divider,
    "border.variant": dividerVariant,
    "border.focused": focusedDivider,
    "border.selected": selectedDivider,
    "border.transparent": TRANSPARENT,
    "border.disabled": c.overlay0,
    "elevated_surface.background": c.mantle,
    "surface.background": c.mantle,
    background: c.base,
    "element.background": c.surface1,
    "element.hover": c.surface0,
    "element.active": translucent("surface2", 0.3),
    "element.selected": translucent("mauve", 0.35),
    "element.disabled": c.overlay0,
    "drop_target.background": translucent("surface0", 0.4),
    "ghost_element.background": TRANSPARENT,
    "ghost_element.hover": translucent("surface1", 0.3),
    "ghost_element.active": translucent("surface2", 0.6),
    "ghost_element.selected": translucent("surface2", 0.4),
    "ghost_element.disabled": c.overlay0,
    text: chromeText,
    "text.muted": chromeMuted,
    "text.placeholder": chromeMuted,
    "text.disabled": c.overlay0,
    "text.accent": c.mauve,
    icon: chromeText,
    "icon.muted": chromeMuted,
    "icon.disabled": c.overlay0,
    "icon.placeholder": chromeMuted,
    "icon.accent": c.mauve,

    "status_bar.background": c.crust,
    "title_bar.background": c.crust,
    "title_bar.inactive_background": c.mantle,
    "toolbar.background": c.base,
    "tab_bar.background": c.crust,
    "tab.inactive_background": c.mantle,
    "tab.active_background": c.base,
    "search.match_background": translucent("teal", 0.3),
    "search.active_match_background": translucent("red", 0.3),
    "panel.background": c.mantle,
    "panel.focused_border": focusedDivider,
    "panel.indent_guide": translucent("surface0", 0.6),
    "panel.indent_guide_active": c.surface2,
    "panel.indent_guide_hover": c.mauve,
    "panel.overlay_background": c.mantle,
    "pane.focused_border": focusedDivider,
    "pane_group.border": divider,
    "scrollbar.thumb.background": translucent("surface2", 0.5),
    "scrollbar.thumb.hover_background": c.overlay0,
    "scrollbar.thumb.active_background": null,
    "scrollbar.thumb.border": null,
    "scrollbar.track.background": c.crust,
    "scrollbar.track.border": translucent("text", 0.07),
    "minimap.thumb.background": translucent("mauve", 0.2),
    "minimap.thumb.hover_background": translucent("mauve", 0.4),
    "minimap.thumb.active_background": translucent("mauve", 0.6),
    "minimap.thumb.border": null,

    "editor.foreground": c[readingTextRole],
    "editor.background": c.base,
    "editor.gutter.background": c.base,
    "editor.subheader.background": c.mantle,
    "editor.active_line.background": translucent("text", 0.07),
    "editor.highlighted_line.background": null,
    "editor.line_number": c.overlay1,
    "editor.active_line_number": c.lavender,
    "editor.invisible": translucent("overlay2", 0.4),
    "editor.wrap_guide": useSoftSeparators ? translucent("surface2", 0.5) : c.surface2,
    "editor.active_wrap_guide": c.overlay0,
    "editor.document_highlight.bracket_background": translucent("mauve", 0.09),
    "editor.document_highlight.read_background": translucent("subtext0", 0.16),
    "editor.document_highlight.write_background": translucent("subtext0", 0.16),
    "editor.indent_guide": translucent("surface0", 0.6),
    "editor.indent_guide_active": c.surface2,

    "terminal.background": c.base,
    "terminal.ansi.background": c.base,
    "terminal.foreground": c[readingTextRole],
    "terminal.dim_foreground": c.overlay1,
    "terminal.bright_foreground": c[readingTextRole],
    "terminal.ansi.black": isLight ? c.text : c.surface1,
    "terminal.ansi.white": c.subtext0,
    "terminal.ansi.red": c.red,
    "terminal.ansi.green": c.green,
    "terminal.ansi.yellow": c.yellow,
    "terminal.ansi.blue": c.blue,
    "terminal.ansi.magenta": c.pink,
    "terminal.ansi.cyan": c.teal,
    "terminal.ansi.bright_black": c.surface2,
    "terminal.ansi.bright_white": c.subtext1,
    "terminal.ansi.bright_red": c.flamingo,
    "terminal.ansi.bright_green": c.green,
    "terminal.ansi.bright_yellow": c.peach,
    "terminal.ansi.bright_blue": c.sapphire,
    "terminal.ansi.bright_magenta": c.mauve,
    "terminal.ansi.bright_cyan": c.sky,
    "terminal.ansi.dim_black": c.surface0,
    "terminal.ansi.dim_white": c.overlay2,
    "terminal.ansi.dim_red": c.red,
    "terminal.ansi.dim_green": c.green,
    "terminal.ansi.dim_yellow": c.yellow,
    "terminal.ansi.dim_blue": c.blue,
    "terminal.ansi.dim_magenta": c.pink,
    "terminal.ansi.dim_cyan": c.teal,

    "link_text.hover": c.sky,
    conflict: c.peach,
    "conflict.border": c.peach,
    "conflict.background": translucent("peach", 0.15),
    created: c.green,
    "created.border": c.green,
    "created.background": translucent("green", 0.15),
    deleted: c.red,
    "deleted.border": c.red,
    "deleted.background": translucent("red", 0.15),
    hidden: c.overlay0,
    "hidden.border": c.overlay0,
    "hidden.background": c.mantle,
    hint: c.surface2,
    "hint.border": c.surface2,
    "hint.background": c.mantle,
    ignored: c.overlay0,
    "ignored.border": c.overlay0,
    "ignored.background": translucent("overlay0", 0.15),
    modified: chromeText,
    "modified.border": chromeMuted,
    "modified.background": translucent("subtext0", 0.15),
    predictive: c.overlay0,
    "predictive.border": c.lavender,
    "predictive.background": c.mantle,
    renamed: c.sapphire,
    "renamed.border": c.sapphire,
    "renamed.background": translucent("sapphire", 0.15),
    info: c.teal,
    "info.border": c.teal,
    "info.background": translucent("teal", 0.2),
    warning: c.yellow,
    "warning.border": c.yellow,
    "warning.background": translucent("yellow", 0.12),
    error: c.red,
    "error.border": c.red,
    "error.background": translucent("red", 0.12),
    success: c.green,
    "success.border": c.green,
    "success.background": translucent("green", 0.12),
    unreachable: c.red,
    "unreachable.border": c.red,
    "unreachable.background": translucent("red", 0.12),

    players: collaborationRoles.map((role) => ({
      cursor: c[role],
      selection: translucent(role, 0.25),
      background: c[role]
    })),

    "version_control.added": c.green,
    "version_control.deleted": c.red,
    "version_control.modified": c.yellow,
    "version_control.renamed": c.sapphire,
    "version_control.conflict": c.peach,
    "version_control.conflict_marker.ours": translucent("green", 0.2),
    "version_control.conflict_marker.theirs": translucent("blue", 0.2),
    "version_control.ignored": c.overlay0,
    "debugger.accent": c.red,
    "editor.debugger_active_line.background": translucent("peach", 0.07),
    syntax
  };

  return {
    name: palette.name,
    appearance: palette.appearance,
    style
  };
}

export function createZedThemeFamily(
  palettes,
  { name = "Folio", author = "José Vizcaíno" } = {}
) {
  return {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name,
    author,
    themes: palettes.map(createZedThemeEntry)
  };
}

export function createZedTheme(palette) {
  return createZedThemeFamily([palette], {
    name: palette.name,
    author: "José Vizcaíno"
  });
}
