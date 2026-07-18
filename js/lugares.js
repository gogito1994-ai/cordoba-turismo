document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("places-grid");
  const filtersEl = document.getElementById("filters");
  if (!grid || !filtersEl) return;

  let soloFavoritos = new URLSearchParams(location.search).get("favoritos") === "1";
  let precioFiltro = "todos";

  function renderFiltros() {
    const todosActivo = precioFiltro === "todos" && !soloFavoritos;

    filtersEl.innerHTML = `
      <button class="filter-btn${todosActivo ? " active" : ""}" id="filter-todos">${t("filter_all")}</button>
      <button class="filter-btn${precioFiltro === "gratis" ? " active" : ""}" data-precio="gratis">${t("filter_free")}</button>
      <button class="filter-btn${precioFiltro === "pago" ? " active" : ""}" data-precio="pago">${t("filter_paid")}</button>
      <button class="filter-btn favorite-filter${soloFavoritos ? " active" : ""}" id="fav-filter">${Icon("heart")} ${t("filter_favorites")}</button>
    `;

    document.getElementById("filter-todos").addEventListener("click", () => {
      precioFiltro = "todos";
      soloFavoritos = false;
      renderFiltros();
      renderGrid();
    });

    filtersEl.querySelectorAll(".filter-btn[data-precio]").forEach((btn) => {
      btn.addEventListener("click", () => {
        precioFiltro = precioFiltro === btn.dataset.precio ? "todos" : btn.dataset.precio;
        renderFiltros();
        renderGrid();
      });
    });

    document.getElementById("fav-filter").addEventListener("click", () => {
      soloFavoritos = !soloFavoritos;
      renderFiltros();
      renderGrid();
    });
  }

  function renderGrid() {
    let lista = PLACES;
    if (soloFavoritos) lista = lista.filter((p) => Favorites.has(p.id));
    if (precioFiltro === "gratis") lista = lista.filter((p) => p.esGratis);
    if (precioFiltro === "pago") lista = lista.filter((p) => !p.esGratis);

    const hasReserva = (p) =>
      typeof affiliateActsFor === "function" && affiliateActsFor(p.id).length > 0;
    lista = [...lista].sort(
      (a, b) =>
        (hasReserva(b) ? 1 : 0) - (hasReserva(a) ? 1 : 0) ||
        (b.imprescindible ? 1 : 0) - (a.imprescindible ? 1 : 0)
    );
    // Caballerizas Reales fijo en el 4º puesto (petición de negocio).
    const cab = lista.findIndex((p) => p.id === "caballerizas-reales");
    if (cab !== -1 && lista.length > 3) {
      lista.splice(3, 0, lista.splice(cab, 1)[0]);
    }

    if (lista.length === 0) {
      grid.innerHTML = `<p class="empty-state">${t("places_empty")}</p>`;
      return;
    }

    grid.innerHTML = `<p class="filter-note">${t("sort_note")}</p>` + lista.map((p) => placeCard(p)).join("");
  }

  function placeCard(p) {
    const isFav = Favorites.has(p.id);
    const nombre = tr(p, "places", "nombre");
    const badge = p.imprescindible
      ? `<span class="lugar-badge card-badge">${Icon("star")} ${t("lugar_essential_badge")}</span>`
      : "";
    const media = p.imagen
      ? `<div class="card-media">
           <img src="${p.imagen}" ${typeof wmSrcset === "function" ? wmSrcset(p.imagen) : ""} alt="${nombre}" loading="lazy" />
           <button class="favorite-btn${isFav ? " active" : ""}" data-id="${p.id}" data-name="${nombre}" aria-label="${t("aria_favorite")}">
             ${Icon("heart")}
           </button>
           ${badge}
         </div>`
      : "";

    const affiliateBtn =
      typeof affiliateCardLinkHtml === "function" ? affiliateCardLinkHtml(p.id) : "";

    return `
      <article class="card card-clickable">
        <a class="card-link" href="lugares/${p.slug || p.id}.html" aria-label="${nombre}"></a>
        ${media}
        <div class="card-body">
          <span class="card-icon">${Icon(p.icono)}</span>
          <span class="tag">${trCategory(p.categoria)}</span>
          <h3>${nombre}</h3>
          <p>${tr(p, "places", "descripcion")}</p>
          <div class="meta">${Icon("compass")} ${tr(p, "places", "tiempoVisita")}</div>
          <div class="meta">${Icon("tag")} ${tr(p, "places", "precio")}</div>
          ${affiliateBtn}
        </div>
      </article>`;
  }

  document.addEventListener("favorites-changed", () => {
    if (soloFavoritos) renderGrid();
  });

  document.addEventListener("lang-changed", () => {
    renderFiltros();
    renderGrid();
  });

  document.addEventListener("afiliados-loaded", renderGrid);

  renderFiltros();
  renderGrid();
});
