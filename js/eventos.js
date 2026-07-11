document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("events-grid");
  if (!grid) return;

  function render() {
    grid.innerHTML = EVENTS.map(
      (e) => `
        <article class="card">
          <div class="card-body">
            <span class="card-icon">${Icon(e.icono)}</span>
            <h3>${tr(e, "events", "nombre")}</h3>
            <p>${tr(e, "events", "descripcion")}</p>
            <div class="meta">${Icon("calendar")} ${tr(e, "events", "fecha")}</div>
            <div class="meta">${Icon("map-pin")} ${tr(e, "events", "lugar")}</div>
          </div>
        </article>`
    ).join("");
  }

  document.addEventListener("lang-changed", render);
  render();
});
