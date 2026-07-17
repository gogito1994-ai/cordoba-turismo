/*
 * Página "Tu estancia": lee data/extras.json y renderiza los extras con botón
 * de solicitud por WhatsApp (mensaje prellenado con el extra y el número de
 * apartamento guardado en localStorage por bienvenida.html).
 * Los datos de negocio (extras, precios) viven SOLO en el JSON.
 */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("extras-grid");
  if (!grid) return;

  const APT_KEY = "cordoba-apt";
  const apt = localStorage.getItem(APT_KEY);
  let EXTRAS_DATA = null;

  function extraText(extra, field) {
    const lang = Lang.get();
    return (extra[field] && (extra[field][lang] || extra[field].es)) || "";
  }

  function whatsappUrl(extra) {
    const titulo = extraText(extra, "titulo");
    const message = apt
      ? t("extra_whatsapp_message", { extra: titulo, apt })
      : t("extra_whatsapp_message_generic", { extra: titulo });
    const number = (typeof CORDOBAPP_CONFIG !== "undefined" && CORDOBAPP_CONFIG.WHATSAPP_GESTORA) || "";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function extraCardHtml(extra) {
    return `
      <article class="card extra-card">
        <div class="card-body">
          <span class="card-icon">${Icon(extra.icono)}</span>
          <h3>${extraText(extra, "titulo")}</h3>
          <p>${extraText(extra, "descripcion")}</p>
          <div class="meta">${Icon("tag")} ${extra.precio}</div>
          <div class="partner-card-actions">
            <a class="btn btn-primary" href="${whatsappUrl(extra)}" target="_blank" rel="noopener noreferrer" data-extra="${extra.id}">
              ${Icon("chat")} ${t("extra_request_whatsapp")}
            </a>
            ${extra.partner ? `<a class="btn btn-outline-dark" href="recomendados.html">${Icon("external-link")} ${t("nav_recommended")}</a>` : ""}
          </div>
        </div>
      </article>`;
  }

  function render() {
    const extras = (EXTRAS_DATA && EXTRAS_DATA.extras.filter((e) => e.activo)) || [];
    grid.innerHTML = extras.map(extraCardHtml).join("");
    grid.querySelectorAll("[data-extra]").forEach((a) => {
      a.addEventListener("click", () => {
        trackEvent("extra_solicitado", { extra: a.dataset.extra, apt: apt || "sin-apt" });
      });
    });
  }

  fetch("data/extras.json")
    .then((res) => res.json())
    .then((data) => {
      EXTRAS_DATA = data;
      render();
      document.addEventListener("lang-changed", render);
    })
    .catch(() => {});
});
