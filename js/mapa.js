document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("map");
  const filtersEl = document.getElementById("map-filters");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map("map").setView([37.8815, -4.7794], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  const categorias = ["Todos", ...new Set(PLACES.map((p) => p.categoria))];
  let activa = "Todos";
  let markers = [];

  function categoryLabel(cat) {
    return cat === "Todos" ? t("filter_all") : trCategory(cat);
  }

  function renderFiltros() {
    filtersEl.innerHTML = categorias
      .map(
        (cat) =>
          `<button class="filter-btn${cat === activa ? " active" : ""}" data-cat="${cat}">${categoryLabel(cat)}</button>`
      )
      .join("");

    filtersEl.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activa = btn.dataset.cat;
        renderFiltros();
        renderMarkers();
      });
    });
  }

  function renderMarkers() {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];

    const lista =
      activa === "Todos" ? PLACES : PLACES.filter((p) => p.categoria === activa);

    lista.forEach((p) => {
      const marker = L.marker([p.lat, p.lng]).addTo(map);
      marker.bindPopup(
        `<h4>${Icon(p.icono)} ${tr(p, "places", "nombre")}</h4><p>${trCategory(p.categoria)}</p><p>${tr(p, "places", "descripcion")}</p>`
      );
      markers.push(marker);
    });
  }

  document.addEventListener("lang-changed", () => {
    renderFiltros();
    renderMarkers();
  });

  renderFiltros();
  renderMarkers();
});
