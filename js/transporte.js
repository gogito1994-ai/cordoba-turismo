document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("transport-grid");
  if (!grid) return;

  function render() {
    grid.innerHTML = TRANSPORT.map(
      (t2) => `
        <article class="card">
          <div class="card-body">
            <span class="card-icon">${t2.icono}</span>
            <h3>${tr(t2, "transport", "nombre")}</h3>
            <p>${tr(t2, "transport", "descripcion")}</p>
            <div class="meta">ℹ️ ${tr(t2, "transport", "info")}</div>
          </div>
        </article>`
    ).join("");
  }

  document.addEventListener("lang-changed", render);
  render();
});
