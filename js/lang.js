const Lang = {
  KEY: "cordoba-lang",
  SUPPORTED: ["es", "en", "fr"],

  get() {
    const stored = localStorage.getItem(this.KEY);
    return this.SUPPORTED.includes(stored) ? stored : "es";
  },

  set(lang) {
    if (!this.SUPPORTED.includes(lang)) return;
    localStorage.setItem(this.KEY, lang);
    document.documentElement.lang = lang;
  },
};

const CATEGORY_I18N = {
  Monumento: { en: "Monument", fr: "Monument" },
  "Barrio histórico": { en: "Historic neighborhood", fr: "Quartier historique" },
  Museo: { en: "Museum", fr: "Musée" },
  Plaza: { en: "Square", fr: "Place" },
  "Yacimiento arqueológico": { en: "Archaeological site", fr: "Site archéologique" },
  Iglesia: { en: "Church", fr: "Église" },
  Restaurante: { en: "Restaurant", fr: "Restaurant" },
  Tapas: { en: "Tapas", fr: "Tapas" },
  Mirador: { en: "Viewpoint", fr: "Point de vue" },
  Consigna: { en: "Luggage storage", fr: "Consigne à bagages" },
  Transporte: { en: "Transport", fr: "Transport" },
  Supermercado: { en: "Supermarket", fr: "Supermarché" },
  Farmacia: { en: "Pharmacy", fr: "Pharmacie" },
};

function t(key, vars) {
  const lang = Lang.get();
  let str = (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || UI_STRINGS.es[key] || key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace(`{${k}}`, vars[k]);
    });
  }
  return str;
}

function tr(item, collection, field) {
  if (!item) return "";
  const lang = Lang.get();
  if (lang === "es") return item[field];
  const entry = DATA_I18N[collection] && DATA_I18N[collection][item.id];
  const val = entry && entry[lang] && entry[lang][field];
  return val !== undefined ? val : item[field];
}

function trCategory(categoriaEs) {
  const lang = Lang.get();
  if (lang === "es") return categoriaEs;
  const entry = CATEGORY_I18N[categoriaEs];
  return (entry && entry[lang]) || categoriaEs;
}

function applyStaticI18n() {
  document.documentElement.lang = Lang.get();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === Lang.get());
  });

  if (document.body.dataset.i18nTitle) {
    document.title = `${t(document.body.dataset.i18nTitle)} — ${t("brand")}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyStaticI18n();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === Lang.get()) return;
      Lang.set(btn.dataset.lang);
      applyStaticI18n();
      document.dispatchEvent(new CustomEvent("lang-changed"));
    });
  });
});
