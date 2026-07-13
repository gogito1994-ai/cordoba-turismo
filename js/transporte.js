document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("transport-grid");
  if (!grid) return;

  function detailItemHtml(d) {
    return `
      <div class="transport-detail-item">
        <strong>${d.nombre}</strong>
        ${d.direccion ? `<div class="meta">${Icon("map-pin")} ${d.direccion}</div>` : ""}
        <p>${d.descripcion}</p>
      </div>`;
  }

  function render() {
    grid.innerHTML = TRANSPORT.map((item) => {
      const detalle = tr(item, "transport", "detalle") || item.detalle;
      const detailHtml = Array.isArray(detalle) && detalle.length
        ? `<div class="transport-detail">${detalle.map(detailItemHtml).join("")}</div>`
        : "";
      return `
        <details class="card transport-card">
          <summary class="transport-summary">
            <span class="card-icon">${Icon(item.icono)}</span>
            <div class="transport-summary-body">
              <h3>${tr(item, "transport", "nombre")}</h3>
              <p>${tr(item, "transport", "descripcion")}</p>
              <div class="meta">${Icon("info")} ${tr(item, "transport", "info")}</div>
            </div>
            <span class="transport-toggle-icon">${Icon("chevronDown")}</span>
          </summary>
          ${detailHtml}
        </details>`;
    }).join("");
  }

  document.addEventListener("lang-changed", render);
  render();
});
