document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  const filtersEl = document.getElementById("map-filters");
  const routesPanelEl = document.getElementById("map-routes-panel");
  const searchInput = document.getElementById("map-search-input");
  const searchResultsEl = document.getElementById("map-search-results");
  const locateBtn = document.getElementById("map-locate-btn");
  const sheetEl = document.getElementById("map-sheet");
  const sheetContentEl = document.getElementById("map-sheet-content");
  const sheetCloseBtn = document.getElementById("map-sheet-close");

  const ALL_POINTS = [
    ...PLACES.map((p) => ({ ...p, collection: "places" })),
    ...RESTAURANTS.map((r) => ({ ...r, collection: "restaurants" })),
    ...TAPAS.map((t) => ({ ...t, collection: "tapas" })),
    ...MIRADORES.map((m) => ({ ...m, collection: "miradores" })),
    ...CONSIGNAS.map((c) => ({ ...c, collection: "consignas" })),
    ...TRANSPORT_HUBS.map((h) => ({ ...h, collection: "transporte" })),
    ...SUPERMERCADOS.map((s) => ({ ...s, collection: "supermercados" })),
    ...FARMACIAS.map((f) => ({ ...f, collection: "farmacias" })),
  ];

  const categoriasPresentes = [...new Set(ALL_POINTS.map((p) => p.categoria))];
  const activeCategories = new Set(categoriasPresentes);
  let activeRouteId = null;
  const iconCache = {};

  const map = L.map("map", { zoomControl: true }).setView([37.8815, -4.7794], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  const markersLayer = L.layerGroup().addTo(map);
  const routeLayer = L.layerGroup().addTo(map);
  const nearbyLayer = L.layerGroup().addTo(map);
  let userMarker = null;
  let userCircle = null;

  function categoryIcon(categoria) {
    if (iconCache[categoria]) return iconCache[categoria];
    const cat = MAP_CATEGORIES[categoria] || { icon: "map-pin", color: "#bd4e2a" };
    const html = `<span class="map-marker" style="background:${cat.color}">${Icon(cat.icon)}</span>`;
    const icon = L.divIcon({
      html,
      className: "map-marker-wrap",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -30],
    });
    iconCache[categoria] = icon;
    return icon;
  }

  function numberIcon(n, color) {
    const html = `<span class="map-marker map-marker-number" style="background:${color}">${n}</span>`;
    return L.divIcon({
      html,
      className: "map-marker-wrap",
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -26],
    });
  }

  function pointDescription(point) {
    if (point.descripcion) return tr(point, point.collection, "descripcion");
    if (point.tipo) return tr(point, point.collection, "tipo");
    return "";
  }

  function pointName(point) {
    return tr(point, point.collection, "nombre");
  }

  function directionsUrl(point) {
    return `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
  }

  function sheetHtml(point) {
    const media = point.imagen
      ? `<div class="map-sheet-media"><img src="${point.imagen}" alt="${pointName(point)}" loading="lazy" /></div>`
      : `<div class="map-sheet-media map-sheet-media-fallback" style="background:${(MAP_CATEGORIES[point.categoria] || {}).color || "#bd4e2a"}">${Icon(point.icono)}</div>`;

    const badge = point.distincion
      ? `<p class="map-sheet-badge">${tr(point, point.collection, "distincion")}</p>`
      : "";

    const desc = pointDescription(point);

    const horario = point.horario
      ? `<div class="map-sheet-meta">${Icon("clock")} ${tr(point, point.collection, "horario")}</div>`
      : "";
    const precio = point.precio
      ? `<div class="map-sheet-meta">${Icon("tag")} ${tr(point, point.collection, "precio")}</div>`
      : "";

    const verificar = point.verificar
      ? `<p class="map-sheet-flag">${t("map_needs_check")}</p>`
      : "";

    const fichaBtn =
      point.collection === "places"
        ? `<a class="btn btn-primary" href="lugares/${point.slug || point.id}.html">${Icon("landmark")} ${t("map_sheet_view_place")}</a>`
        : "";
    const webBtn = point.web
      ? `<a class="btn btn-outline-dark" href="${point.web}" target="_blank" rel="noopener noreferrer">${Icon("external-link")} ${t("web_reserve_button")}</a>`
      : "";
    const directionsBtn = `<a class="btn btn-outline-dark" href="${directionsUrl(point)}" target="_blank" rel="noopener noreferrer">${Icon("map")} ${t("map_sheet_directions")}</a>`;

    return `
      ${media}
      <div class="map-sheet-body">
        <span class="tag">${trCategory(point.categoria)}</span>
        <h3>${pointName(point)}</h3>
        ${badge}
        ${desc ? `<p class="map-sheet-desc">${desc}</p>` : ""}
        ${horario}
        ${precio}
        ${verificar}
        <div class="map-sheet-actions">
          ${fichaBtn}
          ${directionsBtn}
          ${webBtn}
        </div>
      </div>
    `;
  }

  function openSheet(point, extraHtml) {
    sheetContentEl.innerHTML = extraHtml || sheetHtml(point);
    sheetEl.classList.add("open");
    sheetEl.setAttribute("aria-hidden", "false");
  }

  function closeSheet() {
    sheetEl.classList.remove("open");
    sheetEl.setAttribute("aria-hidden", "true");
  }

  sheetCloseBtn.addEventListener("click", closeSheet);

  function renderChips() {
    filtersEl.innerHTML = categoriasPresentes
      .map((cat) => {
        const meta = MAP_CATEGORIES[cat] || { icon: "map-pin", color: "#bd4e2a" };
        const active = activeCategories.has(cat);
        return `<button class="map-chip${active ? " active" : ""}" data-cat="${cat}" style="--chip-color:${meta.color}">${Icon(meta.icon)} ${trCategory(cat)}</button>`;
      })
      .join("");

    filtersEl.querySelectorAll(".map-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;
        if (activeCategories.has(cat)) {
          activeCategories.delete(cat);
        } else {
          activeCategories.add(cat);
        }
        btn.classList.toggle("active");
        renderMarkers();
      });
    });
  }

  function renderMarkers() {
    markersLayer.clearLayers();
    ALL_POINTS.filter((p) => activeCategories.has(p.categoria)).forEach((point) => {
      const marker = L.marker([point.lat, point.lng], { icon: categoryIcon(point.categoria) });
      marker.on("click", () => openSheet(point));
      marker._point = point;
      markersLayer.addLayer(marker);
    });
  }

  function renderRoutesPanel() {
    routesPanelEl.innerHTML = WALKING_ROUTES.map(
      (route) => `
      <button class="map-route-chip${activeRouteId === route.id ? " active" : ""}" data-route="${route.id}" style="--route-color:${route.color}">
        <span class="map-route-dot" style="background:${route.color}"></span>
        ${tr(route, "routes", "nombre")}
        <span class="map-route-duration">${tr(route, "routes", "duracion")}</span>
      </button>`
    ).join("");

    routesPanelEl.querySelectorAll(".map-route-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.route;
        activeRouteId = activeRouteId === id ? null : id;
        renderRoutesPanel();
        renderRoute();
      });
    });
  }

  function renderRoute() {
    routeLayer.clearLayers();
    if (!activeRouteId) return;

    const route = WALKING_ROUTES.find((r) => r.id === activeRouteId);
    if (!route) return;

    const stopPoints = route.paradas
      .map((ref) => {
        const point = resolveMapPoint(ref);
        return point ? { ...point, collection: ref.collection } : null;
      })
      .filter(Boolean);

    const latlngs = stopPoints.map((p) => [p.lat, p.lng]);
    L.polyline(latlngs, { color: route.color, weight: 4, opacity: 0.85, dashArray: "1,10", lineCap: "round" }).addTo(
      routeLayer
    );

    stopPoints.forEach((point, i) => {
      const marker = L.marker([point.lat, point.lng], { icon: numberIcon(i + 1, route.color) });
      marker.on("click", () => openSheet(point));
      routeLayer.addLayer(marker);
    });

    if (latlngs.length) {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60] });
    }
  }

  function normalize(str) {
    return (str || "")
      .toString()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }

  function renderSearchResults(query) {
    const q = normalize(query);
    if (!q) {
      searchResultsEl.innerHTML = "";
      searchResultsEl.classList.remove("open");
      return;
    }
    const matches = ALL_POINTS.filter((p) => normalize(pointName(p)).includes(q)).slice(0, 8);

    if (matches.length === 0) {
      searchResultsEl.innerHTML = `<p class="map-search-empty">${t("places_empty")}</p>`;
      searchResultsEl.classList.add("open");
      return;
    }

    searchResultsEl.innerHTML = matches
      .map(
        (p, i) =>
          `<button class="map-search-result" data-index="${i}">
            <span class="map-search-result-icon" style="background:${(MAP_CATEGORIES[p.categoria] || {}).color || "#bd4e2a"}">${Icon(p.icono)}</span>
            <span><strong>${pointName(p)}</strong><small>${trCategory(p.categoria)}</small></span>
          </button>`
      )
      .join("");
    searchResultsEl.classList.add("open");

    searchResultsEl.querySelectorAll(".map-search-result").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        goToPoint(matches[i]);
        searchInput.value = "";
        searchResultsEl.innerHTML = "";
        searchResultsEl.classList.remove("open");
      });
    });
  }

  function goToPoint(point) {
    if (!activeCategories.has(point.categoria)) {
      activeCategories.add(point.categoria);
      renderChips();
      renderMarkers();
    }
    map.flyTo([point.lat, point.lng], 17, { duration: 0.8 });
    openSheet(point);
  }

  searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
  searchInput.addEventListener("focus", () => renderSearchResults(searchInput.value));
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".map-search")) {
      searchResultsEl.classList.remove("open");
    }
  });

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function locateMe() {
    if (!navigator.geolocation) {
      showToast(t("map_locate_unsupported"));
      return;
    }
    locateBtn.classList.add("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locateBtn.classList.remove("loading");
        const { latitude, longitude } = pos.coords;
        nearbyLayer.clearLayers();

        if (userMarker) map.removeLayer(userMarker);
        if (userCircle) map.removeLayer(userCircle);

        userMarker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            html: `<span class="map-marker map-marker-user"></span>`,
            className: "map-marker-wrap",
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        }).addTo(map);
        userCircle = L.circle([latitude, longitude], {
          radius: 500,
          color: "#2b4a5e",
          fillColor: "#2b4a5e",
          fillOpacity: 0.08,
          weight: 1.5,
        }).addTo(map);

        map.flyTo([latitude, longitude], 15, { duration: 0.8 });

        const nearby = ALL_POINTS.filter((p) => activeCategories.has(p.categoria))
          .map((p) => ({ p, dist: haversine(latitude, longitude, p.lat, p.lng) }))
          .filter((entry) => entry.dist <= 500)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 10);

        const listHtml = nearby.length
          ? nearby
              .map(
                ({ p, dist }) =>
                  `<button class="map-nearby-item" data-id="${p.id}" data-collection="${p.collection}">
                    <span class="map-nearby-icon" style="background:${(MAP_CATEGORIES[p.categoria] || {}).color || "#bd4e2a"}">${Icon(p.icono)}</span>
                    <span><strong>${pointName(p)}</strong><small>${Math.round(dist)} m</small></span>
                  </button>`
              )
              .join("")
          : `<p class="map-search-empty">${t("map_locate_empty")}</p>`;

        openSheet(null, `
          <div class="map-sheet-body">
            <h3>${t("map_locate_heading")}</h3>
            <div class="map-nearby-list">${listHtml}</div>
          </div>
        `);

        sheetContentEl.querySelectorAll(".map-nearby-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            const found = nearby.find(
              (n) => n.p.id === btn.dataset.id && n.p.collection === btn.dataset.collection
            );
            if (found) goToPoint(found.p);
          });
        });
      },
      (err) => {
        locateBtn.classList.remove("loading");
        showToast(err.code === 1 ? t("map_locate_denied") : t("map_locate_error"));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  locateBtn.addEventListener("click", locateMe);

  document.addEventListener("lang-changed", () => {
    renderChips();
    renderRoutesPanel();
    if (sheetEl.classList.contains("open") && markersLayer) {
      closeSheet();
    }
  });

  renderChips();
  renderMarkers();
  renderRoutesPanel();

  const params = new URLSearchParams(window.location.search);
  const focusParam = params.get("focus");
  if (focusParam) {
    const focusIds = focusParam.split(",").map((id) => id.trim()).filter(Boolean);
    const targets = focusIds
      .map((id) => ALL_POINTS.find((p) => p.id === id))
      .filter(Boolean);
    if (targets.length === 1) {
      goToPoint(targets[0]);
    } else if (targets.length > 1) {
      let changed = false;
      targets.forEach((point) => {
        if (!activeCategories.has(point.categoria)) {
          activeCategories.add(point.categoria);
          changed = true;
        }
      });
      if (changed) {
        renderChips();
        renderMarkers();
      }
      map.fitBounds(
        L.latLngBounds(targets.map((p) => [p.lat, p.lng])),
        { padding: [60, 60], maxZoom: 16 }
      );
    }
  }

  const rutaParam = params.get("ruta");
  if (rutaParam && WALKING_ROUTES.some((r) => r.id === rutaParam)) {
    activeRouteId = rutaParam;
    renderRoutesPanel();
    renderRoute();
    const route = WALKING_ROUTES.find((r) => r.id === rutaParam);
    const stopPoints = route.paradas.map((ref) => resolveMapPoint(ref)).filter(Boolean);
    if (stopPoints.length) {
      map.fitBounds(
        L.latLngBounds(stopPoints.map((p) => [p.lat, p.lng])),
        { padding: [60, 60], maxZoom: 16 }
      );
    }
  }
});
