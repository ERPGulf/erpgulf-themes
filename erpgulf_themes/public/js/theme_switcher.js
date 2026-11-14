frappe.provide("frappe.ui");

// name  = the value of <html data-theme-mode>, and what the theme's CSS is keyed on
// value = the User.desk_theme option saved on the server
// base  = the Frappe theme it runs on top of (<html data-theme>). Claudion Night runs on
//         Frappe's own dark theme, so every screen and script that checks for "dark" follows it.
const THEMES = [
  { name: "erpgulf", value: "ERPGulf", label: "ERPGulf", info: "ERPGulf theme" },
  { name: "claudionday", value: "ClaudionDay", label: "Claudion Day", info: "Claudion light theme" },
  { name: "claudionnight", value: "ClaudionNight", label: "Claudion Night", info: "Claudion dark theme", base: "dark" },
];

const base_theme = (mode) => {
  const theme = THEMES.find((t) => t.name === mode);
  return (theme && theme.base) || mode;
};

frappe.ui.set_theme = (theme) => {
  const root = document.documentElement;
  const theme_mode = root.getAttribute("data-theme-mode");
  if (!theme && theme_mode === "automatic") {
    theme = frappe.ui.dark_theme_media_query.matches ? "dark" : "light";
  }
  root.setAttribute("data-theme", base_theme(theme || theme_mode));
};

// Apply straight away, before the desk finishes starting up.
frappe.ui.set_theme();

frappe.ui.ThemeSwitcher = class ERPGulfThemeSwitcher extends frappe.ui.ThemeSwitcher {
  // Our three themes first, then Frappe's own Automatic, Light and Dark.
  fetch_themes() {
    const ours = THEMES.map((theme) => ({
      ...theme,
      label: __(theme.label),
      info: __(theme.info),
    }));
    return super.fetch_themes().then((frappe_themes) => {
      this.themes = [...ours, ...(frappe_themes || [])];
      return this.themes;
    });
  }

  render() {
    super.render();
    // Preview cards are drawn with data-theme=<name>; point each at its base theme and
    // carry the mode alongside, so a card previews exactly what the theme will look like.
    this.themes
      .filter((theme) => THEMES.some((t) => t.name === theme.name))
      .forEach((theme) => {
        theme.$html
          .find(`[data-theme="${theme.name}"]`)
          .addBack(`[data-theme="${theme.name}"]`)
          .attr("data-theme-mode", theme.name)
          .attr("data-theme", base_theme(theme.name));
      });
  }

  toggle_theme(theme_name) {
    const theme = THEMES.find((t) => t.name === theme_name);
    if (!theme) {
      // One of Frappe's own themes: let Frappe switch to it.
      super.toggle_theme(theme_name);
      frappe.ui.set_theme();
      return;
    }

    this.current_theme = theme.name;
    document.documentElement.setAttribute("data-theme-mode", theme.name);
    frappe.ui.set_theme();
    frappe.show_alert(__("Theme Changed"), 3);

    frappe.xcall("frappe.core.doctype.user.user.switch_theme", { theme: theme.value });
  }
};
