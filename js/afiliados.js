/*
 * Enlaces de afiliado a actividades (Civitatis / GetYourGuide).
 * Lee data/afiliados.json (IDs de afiliado y mapeo monumento→actividades).
 * Mientras los IDs sean placeholders, los enlaces se generan sin parámetro
 * de afiliado: funcionan igual, pero sin comisión.
 * Expone helpers globales usados por lugar.js, lugares.js y planificador.js,
 * y dispara el evento "afiliados-loaded" cuando los datos están listos.
 */

let AFILIADOS_DATA = null;

function affiliateUrl(act) {
  if (!AFILIADOS_DATA) return "";
  const plat = AFILIADOS_DATA.config[act.plataforma];
  if (!plat) return "";
  const isPlaceholder = /_AFF_ID|_PARTNER_ID/.test(plat.id);
  const url = plat.base + act.path;
  return isPlaceholder ? url : `${url}?${plat.param}=${encodeURIComponent(plat.id)}`;
}

function affiliateTitle(act) {
  const lang = Lang.get();
  return (act.titulo && (act.titulo[lang] || act.titulo.es)) || "";
}

function affiliateActsFor(placeId) {
  return (AFILIADOS_DATA && AFILIADOS_DATA.actividades[placeId]) || [];
}

function affiliateLinkAttrs(act) {
  return `href="${affiliateUrl(act)}" target="_blank" rel="noopener noreferrer sponsored" data-affiliate="${act.path}" data-plataforma="${act.plataforma}"`;
}

/* Bloque "Reserva tu visita" para las fichas de monumento (lugar.js). */
function affiliateBlockHtml(placeId) {
  const acts = affiliateActsFor(placeId);
  if (!acts.length) return "";
  const links = acts
    .map((act) => `<a class="btn btn-outline-dark affiliate-btn" ${affiliateLinkAttrs(act)}>${Icon("ticket")} ${affiliateTitle(act)}</a>`)
    .join("");
  return `
    <div class="affiliate-block">
      <h3>${t("reserve_block_title")}</h3>
      <div class="affiliate-block-links">${links}</div>
      <p class="disclosure-line">${t("disclosure_line")} <a href="/aviso-legal.html">${t("disclosure_more")}</a></p>
    </div>`;
}

/* Enlace discreto para tarjetas del listado de lugares. */
function affiliateCardLinkHtml(placeId) {
  const acts = affiliateActsFor(placeId);
  if (!acts.length) return "";
  const act = acts[0];
  return `<a class="btn btn-outline-dark affiliate-btn affiliate-card-btn" ${affiliateLinkAttrs(act)}>${Icon("ticket")} ${t("reserve_block_title")}</a>`;
}

/* Enlace "Reservar entrada →" para las paradas del planificador. */
function affiliateStopLinkHtml(placeId) {
  const acts = affiliateActsFor(placeId);
  if (!acts.length) return "";
  const act = acts[0];
  return `<a class="planner-stop-link affiliate-stop-link" ${affiliateLinkAttrs(act)}>${t("reserve_entry_link")} →</a>`;
}

function bindAffiliateEvents(root) {
  (root || document).querySelectorAll("[data-affiliate]").forEach((a) => {
    if (a._affBound) return;
    a._affBound = true;
    a.addEventListener("click", () => {
      trackEvent("affiliate_click", {
        plataforma: a.dataset.plataforma,
        actividad: a.dataset.affiliate,
        pagina: document.body.dataset.page || location.pathname,
      });
    });
  });
}

/* Bloque "Experiencias en Córdoba" (eventos y gastronomía). */
function renderExperienciasBlocks() {
  document.querySelectorAll("[data-experiencias-block]").forEach((slot) => {
    const exps = (AFILIADOS_DATA && AFILIADOS_DATA.experiencias) || [];
    if (!exps.length) {
      slot.hidden = true;
      return;
    }
    slot.hidden = false;
    slot.innerHTML = `
      <h3 class="events-subheading">${t("affiliate_experiences_title")}</h3>
      <div class="affiliate-experiences">
        ${exps
          .map(
            (act) => `
          <a class="affiliate-experience-card" ${affiliateLinkAttrs(act)}>
            <span class="card-icon">${Icon(act.icono || "star")}</span>
            <span>${affiliateTitle(act)}</span>
            <span class="affiliate-experience-arrow">${Icon("external-link")}</span>
          </a>`
          )
          .join("")}
      </div>
      <p class="disclosure-line">${t("disclosure_line")} <a href="aviso-legal.html">${t("disclosure_more")}</a></p>`;
    bindAffiliateEvents(slot);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/afiliados.json")
    .then((res) => res.json())
    .then((data) => {
      AFILIADOS_DATA = data;
      renderExperienciasBlocks();
      document.dispatchEvent(new CustomEvent("afiliados-loaded"));
      document.addEventListener("lang-changed", renderExperienciasBlocks);
    })
    .catch(() => {});

  // Los enlaces de afiliado pueden inyectarse en re-renders posteriores
  // (fichas, listado, planificador): delegación para no perder el tracking.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-affiliate]");
    if (a && !a._affBound) {
      trackEvent("affiliate_click", {
        plataforma: a.dataset.plataforma,
        actividad: a.dataset.affiliate,
        pagina: document.body.dataset.page || location.pathname,
      });
    }
  });
});
