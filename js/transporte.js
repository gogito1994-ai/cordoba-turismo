document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("transport-grid");
  if (!grid) return;

  function render() {
    grid.innerHTML = TRANSPORT.map(
      (item) => `
        <article class="card">
          <div class="card-body">
            <span class="card-icon">${Icon(item.icono)}</span>
            <h3>${tr(item, "transport", "nombre")}</h3>
            <p>${tr(item, "transport", "descripcion")}</p>
            <div class="meta">${Icon("info")} ${tr(item, "transport", "info")}</div>
          </div>
        </article>`
    ).join("");
  }

  document.addEventListener("lang-changed", render);
  render();
});
