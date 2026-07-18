/*
 * Sistema de partners/recomendados. Lee data/partners.json y renderiza:
 * - Bloques contextuales por categoría (data-partner-block en cualquier página raíz).
 * - La página completa de recomendados con filtros (#recomendados-grid).
 * - El banner destacado de la portada (#partner-featured-slot).
 * Los datos de negocio viven SOLO en el JSON: para añadir o editar partners
 * no hace falta tocar este archivo.
 */

let PARTNERS_DATA = null;

function partnerDesc(p) {
  const lang = Lang.get();
  return (p.descripcion && (p.descripcion[lang] || p.descripcion.es)) || "";
}

function partnerCta(p) {
  const lang = Lang.get();
  return (p.ctaLabel && (p.ctaLabel[lang] || p.ctaLabel.es)) || t("partner_cta");
}

function partnerMapsUrl(p) {
  if (p.lat && p.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  }
  if (p.direccion) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.direccion)}`;
  }
  return "";
}

function partnerCardHtml(p) {
  const media = p.imagen
    ? `<div class="card-media"><img src="${p.imagen}" alt="${p.nombre}" loading="lazy" /></div>`
    : "";
  const code = p.codigo
    ? `<div class="partner-card-code">
        <span data-icon-inline="tag">${Icon("tag")}</span>
        <span>${p.descuento ? `${p.descuento} · ` : ""}<code>${p.codigo}</code></span>
        <button type="button" class="partner-copy-btn" data-partner="${p.id}" data-code="${p.codigo}">${t("partner_copy_code")}</button>
      </div>`
    : "";
  const mapsUrl = partnerMapsUrl(p);
  const actions = [
    p.url
      ? `<a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener noreferrer sponsored" data-partner-action="web" data-partner="${p.id}" data-categoria="${p.categoria}">${Icon("external-link")} ${t("web_reserve_button")}</a>`
      : "",
    !p.url && p.telefono
      ? `<a class="btn btn-primary" href="tel:${p.telefono.replace(/\s+/g, "")}" data-partner-action="tel" data-partner="${p.id}" data-categoria="${p.categoria}">${Icon("taxi")} ${t("partner_call")}</a>`
      : "",
    mapsUrl
      ? `<a class="btn btn-outline-dark" href="${mapsUrl}" target="_blank" rel="noopener noreferrer" data-partner-action="maps" data-partner="${p.id}" data-categoria="${p.categoria}">${Icon("map-pin")} ${t("map_sheet_directions")}</a>`
      : "",
  ].join("");

  return `
    <article class="card partner-card">
      ${media}
      <div class="card-body">
        <span class="tag partner-card-badge">${t("recommended_title")}</span>
        <h3>${p.nombre}</h3>
        <p>${partnerDesc(p)}</p>
        ${p.direccion ? `<div class="meta">${Icon("map-pin")} ${p.direccion}</div>` : ""}
        ${p.telefono && p.url ? `<div class="meta"><a href="tel:${p.telefono.replace(/\s+/g, "")}" class="partner-tel-link">${p.telefono}</a></div>` : ""}
        ${code}
        <div class="partner-card-actions">${actions}</div>
      </div>
    </article>`;
}

function disclosureHtml() {
  return `<p class="disclosure-line">${t("disclosure_line")} <a href="aviso-legal.html">${t("disclosure_more")}</a></p>`;
}

function copyTextFallback(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

function bindPartnerEvents(container) {
  container.querySelectorAll(".partner-copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const done = () => {
        showToast(t("partner_code_copied"));
        trackEvent("codigo_copiado", { partner: btn.dataset.partner });
      };
      navigator.clipboard
        .writeText(btn.dataset.code)
        .then(done)
        .catch(() => {
          if (copyTextFallback(btn.dataset.code)) done();
        });
    });
  });
  container.querySelectorAll("[data-partner-action]").forEach((a) => {
    a.addEventListener("click", () => {
      trackEvent("partner_click", {
        partner: a.dataset.partner,
        categoria: a.dataset.categoria,
        accion: a.dataset.partnerAction,
        pagina: document.body.dataset.page || location.pathname,
      });
    });
  });
}

function activePartners() {
  return (PARTNERS_DATA && PARTNERS_DATA.partners.filter((p) => p.activo)) || [];
}

/* ---------- bloques contextuales: <div data-partner-block="cat1,cat2" data-title-key="..."> ---------- */

function renderPartnerBlocks() {
  document.querySelectorAll("[data-partner-block]").forEach((slot) => {
    const cats = slot.dataset.partnerBlock.split(",").map((c) => c.trim());
    const titleKey = slot.dataset.titleKey;
    const list = activePartners().filter((p) => cats.includes(p.categoria));
    if (!list.length) {
      slot.innerHTML = "";
      slot.hidden = true;
      return;
    }
    slot.hidden = false;
    slot.innerHTML = `
      ${titleKey ? `<h3 class="events-subheading">${t(titleKey)}</h3>` : ""}
      <div class="grid">${list.map(partnerCardHtml).join("")}</div>
      ${disclosureHtml()}`;
    bindPartnerEvents(slot);
  });
}

/* ---------- banner destacado de portada ---------- */

function featuredBannerHtml(p) {
  const mapsUrl = partnerMapsUrl(p);
  return `
    <div class="partner-banner">
      <div class="partner-banner-icon">${Icon("suitcase")}</div>
      <div class="partner-banner-content">
        <span class="partner-banner-kicker">${t("recommended_title")}</span>
        <h3 class="partner-banner-title">${p.nombre}</h3>
        <p class="partner-banner-desc">${partnerDesc(p)}</p>
        ${p.codigo ? `
          <div class="partner-banner-discount">
            <div class="partner-banner-discount-line">
              ${Icon("tag")}
              <span>${t("partner_discount")}</span>
              <code>${p.codigo}</code>
            </div>
            <button type="button" class="partner-copy-btn" data-partner="${p.id}" data-code="${p.codigo}">${t("partner_copy_code")}</button>
          </div>` : ""}
        <div class="partner-banner-actions">
          ${p.url ? `<a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener noreferrer sponsored" data-partner-action="web" data-partner="${p.id}" data-categoria="${p.categoria}">${Icon("suitcase")} ${partnerCta(p)}</a>` : ""}
          ${mapsUrl ? `<a class="btn btn-outline-dark" href="${mapsUrl}" target="_blank" rel="noopener noreferrer" data-partner-action="maps" data-partner="${p.id}" data-categoria="${p.categoria}">${Icon("map-pin")} ${t("map_sheet_directions")}</a>` : ""}
        </div>
      </div>
    </div>`;
}

function renderFeaturedPartner() {
  const slot = document.getElementById("partner-featured-slot");
  if (!slot) return;
  const list = activePartners().filter((x) => x.destacado);
  if (!list.length) {
    slot.hidden = true;
    return;
  }
  slot.hidden = false;
  slot.innerHTML = list.map(featuredBannerHtml).join("") + disclosureHtml();
  bindPartnerEvents(slot);
}

/* ---------- página de recomendados con filtros ---------- */

let recomendadosFilter = null;

function renderRecomendados() {
  const grid = document.getElementById("recomendados-grid");
  const filtersEl = document.getElementById("recomendados-filters");
  if (!grid || !PARTNERS_DATA) return;

  const cats = PARTNERS_DATA.categorias.filter((c) =>
    activePartners().some((p) => p.categoria === c)
  );

  if (filtersEl) {
    const allChip = `<button type="button" class="gastro-filter-chip${recomendadosFilter === null ? " active" : ""}" data-cat="all">${t("filter_all")}</button>`;
    filtersEl.innerHTML =
      allChip +
      cats
        .map(
          (c) =>
            `<button type="button" class="gastro-filter-chip${recomendadosFilter === c ? " active" : ""}" data-cat="${c}">${t(`partner_cat_${c}`)}</button>`
        )
        .join("");
    filtersEl.querySelectorAll(".gastro-filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        recomendadosFilter = btn.dataset.cat === "all" ? null : btn.dataset.cat;
        renderRecomendados();
      });
    });
  }

  const list = activePartners().filter(
    (p) => recomendadosFilter === null || p.categoria === recomendadosFilter
  );
  grid.innerHTML =
    list.map(partnerCardHtml).join("") ||
    `<p class="empty-state">${t("recommended_empty")}</p>`;
  bindPartnerEvents(grid);
  injectPartnersJsonLd();
}

function injectPartnersJsonLd() {
  const graph = activePartners().map((p) => ({
    "@type": "LocalBusiness",
    name: p.nombre,
    description: partnerDesc(p),
    ...(p.url ? { url: p.url } : {}),
    ...(p.telefono ? { telephone: p.telefono } : {}),
    ...(p.direccion
      ? { address: { "@type": "PostalAddress", streetAddress: p.direccion, addressLocality: "Córdoba", addressCountry: "ES" } }
      : {}),
    ...(p.lat && p.lng ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}),
  }));
  let ld = document.getElementById("partners-jsonld");
  if (!ld) {
    ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "partners-jsonld";
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

/* ---------- carga ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const needsPartners =
    document.querySelector("[data-partner-block]") ||
    document.getElementById("partner-featured-slot") ||
    document.getElementById("recomendados-grid");
  if (!needsPartners) return;

  fetch("data/partners.json")
    .then((res) => res.json())
    .then((data) => {
      PARTNERS_DATA = data;
      renderAllPartners();
      document.addEventListener("lang-changed", renderAllPartners);
    })
    .catch(() => {});

  function renderAllPartners() {
    renderPartnerBlocks();
    renderFeaturedPartner();
    renderRecomendados();
  }
});
