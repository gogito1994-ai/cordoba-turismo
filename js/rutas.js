document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("routes-list");
  if (!list) return;

  const placeById = Object.fromEntries(PLACES.map((p) => [p.id, p]));
  let openRouteId = null;

  function render() {
    list.innerHTML = ROUTES.map((r) => {
      const paradas = r.paradas
        .map((id) => placeById[id])
        .filter(Boolean)
        .map((p) => `<span class="stop-pill">${Icon("map-pin")} ${tr(p, "places", "nombre")}</span>`)
        .join("");

      return `
        <article class="route-card" data-route-id="${r.id}">
          <div class="route-head">
            <h3><span class="card-icon">${Icon(r.icono)}</span> ${tr(r, "routes", "nombre")}</h3>
            <div class="route-badges">
              <span class="badge">${Icon("clock")} ${tr(r, "routes", "duracion")}</span>
              <span class="badge">${Icon("compass")} ${tr(r, "routes", "dificultad")}</span>
            </div>
          </div>
          <p>${tr(r, "routes", "descripcion")}</p>
          <div class="route-stops">${paradas}</div>
          <button type="button" class="btn btn-primary route-details-btn" data-route-id="${r.id}">
            ${Icon("route")} ${t("route_view_details")}
          </button>
        </article>`;
    }).join("");
  }

  // --- Modal de detalle ---

  const modal = document.createElement("div");
  modal.className = "route-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="route-modal-backdrop" id="route-modal-backdrop"></div>
    <div class="route-modal-panel" role="dialog" aria-modal="true">
      <button type="button" class="route-modal-close" id="route-modal-close" aria-label="${t("aria_close")}">${Icon("x")}</button>
      <div class="route-modal-content" id="route-modal-content"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalContent = modal.querySelector("#route-modal-content");
  const modalBackdrop = modal.querySelector("#route-modal-backdrop");
  const modalClose = modal.querySelector("#route-modal-close");

  function renderModalContent(route) {
    const tiempos = tr(route, "routes", "tiemposParadas") || route.tiemposParadas || [];
    const notas = tr(route, "routes", "notasParadas") || route.notasParadas || [];
    const consejos = tr(route, "routes", "consejos") || route.consejos || [];
    const distancia = tr(route, "routes", "distancia") || route.distancia || "";

    const stops = route.paradas
      .map((id) => placeById[id])
      .filter(Boolean)
      .map((p, i) => {
        const media = p.imagen
          ? `<img class="route-stop-img" src="${p.imagen}" alt="${tr(p, "places", "nombre")}" />`
          : "";
        return `
          <li class="route-stop">
            <div class="route-stop-number">${i + 1}</div>
            ${media}
            <div class="route-stop-info">
              <div class="route-stop-head">
                <h5>${tr(p, "places", "nombre")}</h5>
                ${tiempos[i] ? `<span class="route-stop-time">${Icon("clock")} ${tiempos[i]}</span>` : ""}
              </div>
              ${notas[i] ? `<p>${notas[i]}</p>` : ""}
            </div>
          </li>`;
      })
      .join("");

    const tips = consejos.map((c) => `<li>${c}</li>`).join("");

    modalContent.innerHTML = `
      <div class="route-modal-header">
        <span class="card-icon">${Icon(route.icono)}</span>
        <div>
          <h3>${tr(route, "routes", "nombre")}</h3>
          <div class="route-badges">
            <span class="badge">${Icon("clock")} ${tr(route, "routes", "duracion")}</span>
            <span class="badge">${Icon("compass")} ${tr(route, "routes", "dificultad")}</span>
            ${distancia ? `<span class="badge">${Icon("map-pin")} ${distancia}</span>` : ""}
          </div>
        </div>
      </div>
      <p class="route-modal-desc">${tr(route, "routes", "descripcion")}</p>
      <h4 class="route-modal-subheading">${t("route_itinerary_heading")}</h4>
      <ol class="route-itinerary">${stops}</ol>
      ${
        tips
          ? `<h4 class="route-modal-subheading">${t("route_tips_heading")}</h4>
             <ul class="route-tips">${tips}</ul>`
          : ""
      }
    `;
  }

  function openModal(routeId) {
    const route = ROUTES.find((r) => r.id === routeId);
    if (!route) return;
    openRouteId = routeId;
    renderModalContent(route);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("chat-open");
  }

  function closeModal() {
    openRouteId = null;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("chat-open");
  }

  list.addEventListener("click", (e) => {
    const trigger = e.target.closest(".route-card, .route-details-btn");
    if (!trigger) return;
    const routeId = trigger.dataset.routeId || trigger.closest("[data-route-id]")?.dataset.routeId;
    if (routeId) openModal(routeId);
  });

  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  document.addEventListener("lang-changed", () => {
    render();
    if (openRouteId) {
      const route = ROUTES.find((r) => r.id === openRouteId);
      if (route) renderModalContent(route);
    }
  });

  render();
});
