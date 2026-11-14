"""Desk themes: which ones exist, saving a user's choice, and install / uninstall."""

import frappe
from frappe import _

MODULE = "ERPGulf Themes"

# User.desk_theme options. Frappe lowercases the value into <html data-theme-mode="...">,
# which is what the stylesheets and theme_switcher.js are keyed on.
THEMES = ("ERPGulf", "ClaudionDay", "ClaudionNight")
# Frappe's own themes stay available next to ours.
FRAPPE_THEMES = ("Light", "Dark", "Automatic")
ALL_THEMES = THEMES + FRAPPE_THEMES
DEFAULT_THEME = "ERPGulf"


@frappe.whitelist()
def switch_theme(theme: str):
    """Save the theme the user picked in the theme switcher."""
    key = (theme or "").replace(" ", "").lower()
    resolved = next((t for t in ALL_THEMES if t.lower() == key), None)
    if not resolved:
        frappe.throw(_("Theme {0} is not available").format(theme))
    frappe.db.set_value("User", frappe.session.user, "desk_theme", resolved)


def setup():
    """Runs after install and after every migrate. Safe to run repeatedly."""
    _set_property("options", "\n".join(ALL_THEMES), "Text")
    _set_property("default", DEFAULT_THEME, "Data")

    # Users with no theme (or one that no longer exists) get the default. A user's own choice,
    # including Frappe's Light, Dark and Automatic, is kept.
    User = frappe.qb.DocType("User")
    (
        frappe.qb.update(User)
        .set(User.desk_theme, DEFAULT_THEME)
        .where(User.desk_theme.isnull() | User.desk_theme.notin(ALL_THEMES))
    ).run()
    frappe.clear_cache(doctype="User")


def teardown():
    """Runs before uninstall: hand the desk back to Frappe's own themes."""
    for prop in ("options", "default"):
        frappe.delete_doc_if_exists("Property Setter", f"User-desk_theme-{prop}", force=True)

    User = frappe.qb.DocType("User")
    frappe.qb.update(User).set(User.desk_theme, "Light").where(User.desk_theme.isin(THEMES)).run()
    frappe.clear_cache(doctype="User")


def _set_property(prop: str, value: str, property_type: str):
    name = f"User-desk_theme-{prop}"
    if frappe.db.exists("Property Setter", name):
        if frappe.db.get_value("Property Setter", name, "value") != value:
            frappe.db.set_value("Property Setter", name, {"value": value, "module": MODULE})
        return

    frappe.get_doc(
        {
            "doctype": "Property Setter",
            "doctype_or_field": "DocField",
            "doc_type": "User",
            "field_name": "desk_theme",
            "property": prop,
            "property_type": property_type,
            "value": value,
            "module": MODULE,
        }
    ).insert(ignore_permissions=True)
