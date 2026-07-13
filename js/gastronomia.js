document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("food-grid");
  const historicGrid = document.getElementById("historic-grid");
  const restaurantsGrid = document.getElementById("restaurants-grid");
  const tapasGrid = document.getElementById("tapas-grid");
  const filtersEl = document.getElementById("gastro-filters");
  const routeCtaEl = document.getElementById("tapa-route-cta");
  const glossaryEl = document.getElementById("glossary-list");
  if (!grid) return;

  const filters = {
    vegetariano: false,
    conNinos: false,
    terraza: false,
    cercaJuderia: false,
    abiertoAhora: false,
  };

  /* ---------- platos icónicos ---------- */

  function dondeProbarHtml(f) {
    const spots = resolveDondeProbar(f.dondeProbar);
    if (!spots.length) return "";
    const items = spots
      .map((s) => {
        const link = s.collection
          ? `<a href="mapa.html?focus=${s.id}">${s.nombre}</a>`
          : `<span>${s.nombre}</span>`;
        return `<li>${link}<small>${s.zona || ""}${s.precio ? ` · ${s.precio}` : ""}</small></li>`;
      })
      .join("");
    return `
      <div class="donde-probar">
        <strong>${t("gastronomy_where_to_try")}</strong>
        <ul>${items}</ul>
      </div>`;
  }

  function foodCard(f) {
    const media = f.imagen
      ? `<div class="card-media"><img src="${f.imagen}" alt="${tr(f, "food", "nombre")}" loading="lazy" /></div>`
      : "";

    return `
      <article class="card">
        ${media}
        <div class="card-body">
          <span class="card-icon">${Icon(f.icono)}</span>
          <span class="tag">${tr(f, "food", "tipo")}</span>
          <h3>${tr(f, "food", "nombre")}</h3>
          <p>${tr(f, "food", "descripcion")}</p>
          ${dondeProbarHtml(f)}
        </div>
      </article>`;
  }

  /* ---------- tabernas históricas ---------- */

  function historicCard(v, collection) {
    const media = v.imagen
      ? `<div class="card-media"><img src="${v.imagen}" alt="${v.nombre}" loading="lazy" /></div>`
      : "";
    return `
      <article class="card">
        ${media}
        <div class="card-body">
          <span class="card-icon">${Icon(v.icono)}</span>
          <span class="tag">${tr(v, collection, "distincion")}</span>
          <h3>${v.nombre}</h3>
          <div class="meta">${Icon("map-pin")} ${v.direccion}</div>
          <p>${tr(v, collection, "historia")}</p>
          <div class="deberia-pedir">
            <strong>${t("gastronomy_should_order")}</strong>
            <p>${tr(v, collection, "queDeberiaPedir")}</p>
          </div>
        </div>
      </article>`;
  }

  /* ---------- restaurantes / tapas con filtros ---------- */

  function venueBadges(v) {
    const badges = [];
    if (v.vegetariano) badges.push(`<span class="venue-badge">${Icon("utensils")} ${t("filter_vegetariano")}</span>`);
    if (v.conNinos) badges.push(`<span class="venue-badge">${Icon("users")} ${t("filter_con_ninos")}</span>`);
    if (v.terraza) badges.push(`<span class="venue-badge">${Icon("sun")} ${t("filter_terraza")}</span>`);
    if (v.cercaJuderia) badges.push(`<span class="venue-badge">${Icon("map-pin")} ${t("filter_cerca_juderia")}</span>`);
    if (v.horario) {
      const status = gastroOpenStatus(v.horario, new Date());
      if (status !== "unknown") {
        badges.push(
          `<span class="venue-badge venue-badge-${status}">${Icon("clock")} ${t(status === "open" ? "filter_abierto_ahora" : "ahora_closed_now")}</span>`
        );
      }
    }
    return badges.join("");
  }

  function venueCard(v, collection) {
    const carta = tr(v, collection, "carta") || v.carta;
    const cartaItems = carta.map((plato) => `<li>${plato}</li>`).join("");
    const webBtn = v.web
      ? `<a class="btn btn-primary btn-ticket" href="${v.web}" target="_blank" rel="noopener noreferrer">${Icon("external-link")} ${t("web_reserve_button")}</a>`
      : "";
    const verificar = v.verificar ? `<p class="map-sheet-flag">${t("gastronomy_hours_unverified")}</p>` : "";
    const media = v.imagen
      ? `<div class="card-media"><img src="${v.imagen}" alt="${v.nombre}" loading="lazy" /></div>`
      : "";

    return `
      <article class="card">
        ${media}
        <div class="card-body">
          <span class="card-icon">${Icon(v.icono)}</span>
          <span class="tag">${tr(v, collection, "distincion")}</span>
          <h3>${v.nombre}</h3>
          <p>${tr(v, collection, "tipo")}${v.chef ? ` · Chef ${v.chef}` : ""}</p>
          <div class="meta">${Icon("map-pin")} ${v.direccion}</div>
          <div class="meta">${Icon("tag")} ${tr(v, collection, "precio")}</div>
          <div class="venue-badges">${venueBadges(v)}</div>
          ${verificar}
          <div class="carta">
            <strong>${t("carta_label")}</strong>
            <ul>${cartaItems}</ul>
          </div>
          ${webBtn}
        </div>
      </article>`;
  }

  function renderVenueGrids() {
    const filteredRestaurants = RESTAURANTS.filter((v) => matchesGastroFilters(v, filters));
    const filteredTapas = TAPAS.filter((v) => matchesGastroFilters(v, filters));

    restaurantsGrid.innerHTML =
      filteredRestaurants.map((r) => venueCard(r, "restaurants")).join("") ||
      `<p class="empty-state">${t("gastronomy_no_results")}</p>`;
    tapasGrid.innerHTML =
      filteredTapas.map((v) => venueCard(v, "tapas")).join("") ||
      `<p class="empty-state">${t("gastronomy_no_results")}</p>`;
  }

  function renderFilters() {
    const chips = [
      ["vegetariano", "filter_vegetariano"],
      ["conNinos", "filter_con_ninos"],
      ["terraza", "filter_terraza"],
      ["cercaJuderia", "filter_cerca_juderia"],
      ["abiertoAhora", "filter_abierto_ahora"],
    ];
    filtersEl.innerHTML = chips
      .map(
        ([key, labelKey]) =>
          `<button type="button" class="gastro-filter-chip${filters[key] ? " active" : ""}" data-filter="${key}">${t(labelKey)}</button>`
      )
      .join("");

    filtersEl.querySelectorAll(".gastro-filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.filter;
        filters[key] = !filters[key];
        renderFilters();
        renderVenueGrids();
      });
    });
  }

  /* ---------- ruta de la tapa ---------- */

  function renderTapaRouteCta() {
    if (!routeCtaEl || typeof buildTapasRouteMapUrl !== "function") return;
    const plannerUrl = buildTapasRoutePlannerUrl();
    routeCtaEl.innerHTML = `
      <div class="gastro-route-cta">
        <span class="card-icon">${Icon("route")}</span>
        <div>
          <h3>${t("gastronomy_tapa_route_title")}</h3>
          <p>${t("gastronomy_tapa_route_desc")}</p>
        </div>
        <div class="gastro-route-cta-actions">
          <a class="btn btn-outline-dark" href="${buildTapasRouteMapUrl()}">${Icon("map")} ${t("gastronomy_tapa_route_map")}</a>
          ${plannerUrl ? `<a class="btn btn-primary" href="${plannerUrl}">${Icon("route")} ${t("gastronomy_tapa_route_planner")}</a>` : ""}
        </div>
      </div>`;
  }

  /* ---------- glosario ---------- */

  function renderGlossary() {
    if (!glossaryEl) return;
    glossaryEl.innerHTML = glossaryLang()
      .map((entry) => `<div class="glossary-item"><strong>${entry.termino}</strong><p>${entry.significado}</p></div>`)
      .join("");
  }

  function injectLocalBusinessJsonLd() {
    const venues = [
      ...RESTAURANTS.map((v) => ({ v, type: "Restaurant", collection: "restaurants" })),
      ...TAPAS.map((v) => ({ v, type: "BarOrPub", collection: "tapas" })),
    ];
    const graph = venues.map(({ v, type, collection }) => ({
      "@type": type,
      name: v.nombre,
      description: tr(v, collection, "tipo"),
      address: { "@type": "PostalAddress", streetAddress: v.direccion, addressLocality: "Córdoba", addressCountry: "ES" },
      ...(v.lat && v.lng ? { geo: { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng } } : {}),
      ...(v.web ? { url: v.web } : {}),
      priceRange: tr(v, collection, "precio"),
    }));

    let ld = document.getElementById("venues-jsonld");
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "venues-jsonld";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  }

  function render() {
    grid.innerHTML = FOOD.map(foodCard).join("");
    if (historicGrid) {
      const historic = [...RESTAURANTS, ...TAPAS].filter((v) => v.esHistorica);
      historicGrid.innerHTML = historic
        .map((v) => historicCard(v, RESTAURANTS.includes(v) ? "restaurants" : "tapas"))
        .join("");
    }
    renderFilters();
    renderVenueGrids();
    renderTapaRouteCta();
    renderGlossary();
    injectLocalBusinessJsonLd();
  }

  document.addEventListener("lang-changed", render);

  render();
});
