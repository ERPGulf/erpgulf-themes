// Chart colours per theme.
// Frappe's default palette starts with two blues, so a two-series chart reads as one colour in
// two shades. Each theme gets a palette whose neighbouring colours are clearly different.
// Charts that name their own colours (on the Dashboard Chart) are not affected.
const CHART_PALETTES = {
  erpgulf: ["#d9372b", "#1b2030", "#d9a13b", "#4a8ad9", "#5aa77a", "#9aa3b5", "#8e6fd1", "#e58a7f", "#2f9c95", "#6b7385"],
  claudionday: ["#15b08f", "#073c44", "#7575ff", "#e0a23a", "#4e878f", "#e2675a", "#9ec8b9", "#5a8fd6", "#8e6fd1", "#525454"],
  claudionnight: ["#44c0a5", "#7575ff", "#e0a23a", "#4e9fd6", "#e2675a", "#9ec8b9", "#b08cf0", "#4e878f", "#d6c15a", "#979999"],
};

if (frappe.utils && typeof frappe.utils.get_chart_palette === "function") {
  const default_chart_palette = frappe.utils.get_chart_palette.bind(frappe.utils);

  frappe.utils.get_chart_palette = () => {
    const mode = document.documentElement.getAttribute("data-theme-mode");
    return CHART_PALETTES[mode] ? [...CHART_PALETTES[mode]] : default_chart_palette();
  };
}
