document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const grid = document.getElementById("search-grid");
  if (!input || !grid) return;

  function normalize(str) {
    const nfd = str.toLowerCase().normalize("NFD");
    let out = "";
    for (const ch of nfd) {
      const code = ch.codePointAt(0);
      if (code >= 0x0300 && code <= 0x036f) continue;
      out += ch;
    }
    return out;
  }

  function buildItems() {
    return [
      ...PLACES.map((p) => ({
        tipo: t("type_lugar"),
        icono: p.icono,
        nombre: tr(p, "places", "nombre"),
        descripcion: tr(p, "places", "descripcion"),
        imagen: p.imagen,
        id: p.id,
        esFavoriteable: true,
      })),
      ...EVENTS.map((e) => ({
        tipo: t("type_evento"),
        icono: e.icono,
        nombre: tr(e, "events", "nombre"),
        descripcion: `${tr(e, "events", "descripcion")} (${tr(e, "events", "fecha")})`,
      })),
      ...FOOD.map((f) => ({
        tipo: t("type_gastronomia"),
        icono: f.icono,
        nombre: tr(f, "food", "nombre"),
        descripcion: tr(f, "food", "descripcion"),
        imagen: f.imagen,
      })),
      ...TRANSPORT.map((tr2) => ({
        tipo: t("type_transporte"),
        icono: tr2.icono,
        nombre: tr(tr2, "transport", "nombre"),
        descripcion: tr(tr2, "transport", "descripcion"),
      })),
      ...RESTAURANTS.map((r) => ({
        tipo: t("type_restaurante"),
        icono: r.icono,
        nombre: r.nombre,
        descripcion: `${tr(r, "restaurants", "distincion")} · ${tr(r, "restaurants", "tipo")}. ${t("carta_label")}: ${(tr(r, "restaurants", "carta") || r.carta).join(", ")}`,
      })),
      ...TAPAS.map((v) => ({
        tipo: t("type_tapas"),
        icono: v.icono,
        nombre: v.nombre,
        descripcion: `${tr(v, "tapas", "distincion")} · ${tr(v, "tapas", "tipo")}. ${t("carta_label")}: ${(tr(v, "tapas", "carta") || v.carta).join(", ")}`,
      })),
    ];
  }

  function render(query) {
    const items = buildItems();
    const q = normalize(query.trim());
    const results = q
      ? items.filter(
          (it) => normalize(it.nombre).includes(q) || normalize(it.descripcion).includes(q)
        )
      : items;

    if (results.length === 0) {
      grid.innerHTML = `<p class="empty-state">${t("search_empty", { query })}</p>`;
      return;
    }

    grid.innerHTML = results.map((it) => resultCard(it)).join("");
  }

  function resultCard(it) {
    const isFav = it.esFavoriteable && Favorites.has(it.id);
    const media = it.imagen
      ? `<div class="card-media">
           <img src="${it.imagen}" alt="${it.nombre}" />
           ${
             it.esFavoriteable
               ? `<button class="favorite-btn${isFav ? " active" : ""}" data-id="${it.id}" data-name="${it.nombre}" aria-label="${t("aria_favorite")}">
                    ${Icon("heart")}
                  </button>`
               : ""
           }
         </div>`
      : "";

    return `
      <article class="card">
        ${media}
        <div class="card-body">
          <span class="card-icon">${Icon(it.icono)}</span>
          <span class="tag">${it.tipo}</span>
          <h3>${it.nombre}</h3>
          <p>${it.descripcion}</p>
        </div>
      </article>`;
  }

  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";
  if (initialQuery) input.value = initialQuery;

  input.addEventListener("input", () => render(input.value));
  document.addEventListener("lang-changed", () => render(input.value));
  render(initialQuery);
});
