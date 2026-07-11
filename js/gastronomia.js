document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("food-grid");
  const restaurantsGrid = document.getElementById("restaurants-grid");
  const tapasGrid = document.getElementById("tapas-grid");

  function foodCard(f) {
    const media = f.imagen
      ? `<div class="card-media"><img src="${f.imagen}" alt="${tr(f, "food", "nombre")}" /></div>`
      : "";

    return `
      <article class="card">
        ${media}
        <div class="card-body">
          <span class="card-icon">${f.icono}</span>
          <span class="tag">${tr(f, "food", "tipo")}</span>
          <h3>${tr(f, "food", "nombre")}</h3>
          <p>${tr(f, "food", "descripcion")}</p>
        </div>
      </article>`;
  }

  function venueCard(v, collection) {
    const carta = tr(v, collection, "carta") || v.carta;
    const cartaItems = carta.map((plato) => `<li>${plato}</li>`).join("");
    const webBtn = v.web
      ? `<a class="btn btn-primary btn-ticket" href="${v.web}" target="_blank" rel="noopener noreferrer">${t("web_reserve_button")}</a>`
      : "";

    return `
      <article class="card">
        <div class="card-body">
          <span class="card-icon">${v.icono}</span>
          <span class="tag">${tr(v, collection, "distincion")}</span>
          <h3>${v.nombre}</h3>
          <p>${tr(v, collection, "tipo")}${v.chef ? ` · Chef ${v.chef}` : ""}</p>
          <div class="meta">📍 ${v.direccion}</div>
          <div class="meta">💶 ${tr(v, collection, "precio")}</div>
          <div class="carta">
            <strong>${t("carta_label")}</strong>
            <ul>${cartaItems}</ul>
          </div>
          ${webBtn}
        </div>
      </article>`;
  }

  function render() {
    if (grid) grid.innerHTML = FOOD.map(foodCard).join("");
    if (restaurantsGrid) {
      restaurantsGrid.innerHTML = RESTAURANTS.map((r) => venueCard(r, "restaurants")).join("");
    }
    if (tapasGrid) {
      tapasGrid.innerHTML = TAPAS.map((v) => venueCard(v, "tapas")).join("");
    }
  }

  document.addEventListener("lang-changed", render);
  render();
});
