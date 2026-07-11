document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("routes-list");
  if (!list) return;

  const placeById = Object.fromEntries(PLACES.map((p) => [p.id, p]));

  function render() {
    list.innerHTML = ROUTES.map((r) => {
      const paradas = r.paradas
        .map((id) => placeById[id])
        .filter(Boolean)
        .map((p) => `<span class="stop-pill">${tr(p, "places", "nombre")}</span>`)
        .join("");

      return `
        <article class="route-card">
          <div class="route-head">
            <h3>${r.icono} ${tr(r, "routes", "nombre")}</h3>
            <div class="route-badges">
              <span class="badge">⏱️ ${tr(r, "routes", "duracion")}</span>
              <span class="badge">📶 ${tr(r, "routes", "dificultad")}</span>
            </div>
          </div>
          <p>${tr(r, "routes", "descripcion")}</p>
          <div class="route-stops">${paradas}</div>
        </article>`;
    }).join("");
  }

  document.addEventListener("lang-changed", render);
  render();
});
