app_name = "erpgulf_themes"
app_title = "ERPGulf Themes"
app_publisher = "ERPGulf"
app_description = "Desk themes for Frappe v16.5+: Claudion Day, Claudion Night and ERPGulf"
app_email = "support@erpgulf.com"
app_license = "mit"

app_include_css = "erpgulf_themes.bundle.css"
app_include_js = "erpgulf_themes.bundle.js"

# Frappe's own switch_theme only saves Light / Dark / Automatic.
override_whitelisted_methods = {
    "frappe.core.doctype.user.user.switch_theme": "erpgulf_themes.theme.switch_theme",
}

after_install = "erpgulf_themes.theme.setup"
after_migrate = "erpgulf_themes.theme.setup"
before_uninstall = "erpgulf_themes.theme.teardown"
