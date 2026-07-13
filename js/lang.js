const Lang = {
  KEY: "cordoba-lang",
  SUPPORTED: ["es", "en", "fr", "de"],

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
  Monumento: { en: "Monument", fr: "Monument", de: "Denkmal" },
  "Barrio histórico": { en: "Historic neighborhood", fr: "Quartier historique", de: "Historisches Viertel" },
  Museo: { en: "Museum", fr: "Musée", de: "Museum" },
  Plaza: { en: "Square", fr: "Place", de: "Platz" },
  "Yacimiento arqueológico": { en: "Archaeological site", fr: "Site archéologique", de: "Archäologische Stätte" },
  Iglesia: { en: "Church", fr: "Église", de: "Kirche" },
  Restaurante: { en: "Restaurant", fr: "Restaurant", de: "Restaurant" },
  Tapas: { en: "Tapas", fr: "Tapas", de: "Tapas" },
  Mirador: { en: "Viewpoint", fr: "Point de vue", de: "Aussichtspunkt" },
  Consigna: { en: "Luggage storage", fr: "Consigne à bagages", de: "Gepäckaufbewahrung" },
  Transporte: { en: "Transport", fr: "Transport", de: "Transport" },
  Supermercado: { en: "Supermarket", fr: "Supermarché", de: "Supermarkt" },
  Farmacia: { en: "Pharmacy", fr: "Pharmacie", de: "Apotheke" },
};

const LOCALE_BY_LANG = { es: "es-ES", fr: "fr-FR", de: "de-DE", en: "en-GB" };

function localeForLang() {
  return LOCALE_BY_LANG[Lang.get()] || LOCALE_BY_LANG.en;
}

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
