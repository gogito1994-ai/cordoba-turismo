document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("places-grid");
  const filtersEl = document.getElementById("filters");
  if (!grid || !filtersEl) return;

  const categorias = ["Todos", ...new Set(PLACES.map((p) => p.categoria))];
  let activa = "Todos";
  let soloFavoritos = false;
  let precioFiltro = "todos";

  function categoryLabel(cat) {
    return cat === "Todos" ? t("filter_all") : trCategory(cat);
  }

  function renderFiltros() {
    const catBtns = categorias
      .map(
        (cat) =>
          `<button class="filter-btn${cat === activa ? " active" : ""}" data-cat="${cat}">${categoryLabel(cat)}</button>`
      )
      .join("");

    const precioBtns = `
      <button class="filter-btn${precioFiltro === "gratis" ? " active" : ""}" data-precio="gratis">${t("filter_free")}</button>
      <button class="filter-btn${precioFiltro === "pago" ? " active" : ""}" data-precio="pago">${t("filter_paid")}</button>
    `;

    filtersEl.innerHTML = `${catBtns}${precioBtns}<button class="filter-btn favorite-filter${
      soloFavoritos ? " active" : ""
    }" id="fav-filter">${Icon("heart")} ${t("filter_favorites")}</button>`;

    filtersEl.querySelectorAll(".filter-btn[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activa = btn.dataset.cat;
        renderFiltros();
        renderGrid();
      });
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
    let lista = activa === "Todos" ? PLACES : PLACES.filter((p) => p.categoria === activa);
    if (soloFavoritos) lista = lista.filter((p) => Favorites.has(p.id));
    if (precioFiltro === "gratis") lista = lista.filter((p) => p.esGratis);
    if (precioFiltro === "pago") lista = lista.filter((p) => !p.esGratis);

    lista = [...lista].sort((a, b) => (b.imprescindible ? 1 : 0) - (a.imprescindible ? 1 : 0));

    if (lista.length === 0) {
      grid.innerHTML = `<p class="empty-state">${t("places_empty")}</p>`;
      return;
    }

    grid.innerHTML = `<p class="filter-note">${t("sort_essential")}</p>` + lista.map((p) => placeCard(p)).join("");
  }

  function placeCard(p) {
    const isFav = Favorites.has(p.id);
    const nombre = tr(p, "places", "nombre");
    const badge = p.imprescindible
      ? `<span class="lugar-badge card-badge">${Icon("star")} ${t("lugar_essential_badge")}</span>`
      : "";
    const media = p.imagen
      ? `<div class="card-media">
           <img src="${p.imagen}" alt="${nombre}" />
           <button class="favorite-btn${isFav ? " active" : ""}" data-id="${p.id}" data-name="${nombre}" aria-label="${t("aria_favorite")}">
             ${Icon("heart")}
           </button>
           ${badge}
         </div>`
      : "";

    const ticketBtn = p.ticketUrl
      ? `<a class="btn btn-primary btn-ticket" href="${p.ticketUrl}" target="_blank" rel="noopener noreferrer">${Icon("ticket")} ${t("ticket_button")}</a>`
      : "";

    return `
      <article class="card card-clickable">
        <a class="card-link" href="lugar.html?id=${p.id}" aria-label="${nombre}"></a>
        ${media}
        <div class="card-body">
          <span class="card-icon">${Icon(p.icono)}</span>
          <span class="tag">${trCategory(p.categoria)}</span>
          <h3>${nombre}</h3>
          <p>${tr(p, "places", "descripcion")}</p>
          <div class="meta">${Icon("compass")} ${tr(p, "places", "tiempoVisita")}</div>
          <div class="meta">${Icon("tag")} ${tr(p, "places", "precio")}</div>
          ${ticketBtn}
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

  renderFiltros();
  renderGrid();
});
