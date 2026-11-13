# ERPGulf Themes

Desk themes for Frappe / ERPNext **v16.50 and above** (the release with the dock and module sidebars). Themes only: no doctypes, no reports, no business logic.

| Theme | Look |
| --- | --- |
| **Claudion Day** | Light theme, dark-green navigation, teal accent |
| **Claudion Night** | Dark theme, built on Frappe's own dark mode |
| **ERPGulf** | Navy shell and sidebar, light-grey page, white cards, red accent |

**For designers:** [DESIGN.md](DESIGN.md) lists every colour (with hex codes), the fonts, and how each element is styled in each theme.

## Install

```bash
bench get-app https://github.com/ERPGulf/erpgulf-themes.git
bench --site your-site install-app erpgulf_themes
bench build --app erpgulf_themes
```

## What it does

- Replaces the theme switcher (user menu → Toggle Theme, or `Ctrl+Shift+G`) with these three themes.
- Saves each user's choice on the server (`User.desk_theme`), so it follows them across browsers.
- Sets **Claudion Day** as the default for new users. To change the default, edit `DEFAULT_THEME` in `erpgulf_themes/theme.py`.
- On install and on every migrate, users who are on any other theme are moved to the default. A user's own choice among the three is never overwritten.

Frappe's built-in Light, Dark and Automatic themes are not offered while the app is installed.

## Uninstall

```bash
bench --site your-site uninstall-app erpgulf_themes
```

Uninstalling removes the theme options and puts every user back on Frappe's Light theme.

## Notes

- Works with both desktop layouts in v16.50 (the new "Apps" layout with the dock, and the old layout). The dock and the module sidebars are styled in all three themes.
- Module and sidebar icons are Frappe's own, coloured by the theme.
- Do not install alongside an app that ships the same themes (for example the theme code in `claudion4saudi`): both would override the theme switcher.
- Claudion Night sets the page to Frappe's `dark` theme and keys its own rules on `data-theme-mode="claudionnight"`, so everything in Frappe that checks for dark mode follows it.
- Fonts: Host Grotesk and Young Serif, both under the SIL Open Font License (see `erpgulf_themes/public/fonts/`).

## Layout

```
erpgulf_themes/
  hooks.py                      asset includes, switch_theme override, install hooks
  theme.py                      theme list, save choice, setup / teardown
  public/js/theme_switcher.js   the three-theme switcher
  public/scss/themes/           one stylesheet per theme, plus shared base
  public/fonts/  public/images/ fonts and icons the themes use
```

## License

MIT
