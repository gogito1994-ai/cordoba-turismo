document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("lugar-content");
  if (!content) return;

  const params = new URLSearchParams(window.location.search);
  const id = document.body.dataset.placeId || params.get("id");
  const place = PLACES.find((p) => p.id === id);

  if (!place) {
    content.innerHTML = `
      <p class="empty-state">${t("lugar_not_found")}</p>
      <p style="text-align:center;"><a class="btn btn-primary" href="/lugares.html">${t("lugar_back_link")}</a></p>
    `;
    return;
  }

  let map = null;

  function haversine(a, b) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function nearbyPlaces() {
    return PLACES.filter((p) => p.id !== place.id)
      .map((p) => ({ p, dist: haversine(place, p) }))
      .filter((entry) => entry.dist <= 800)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6)
      .map((entry) => entry.p);
  }

  function galleryHtml() {
    const images = place.galeria && place.galeria.length ? place.galeria : [place.imagen];
    const nombre = tr(place, "places", "nombre");
    if (images.length === 1) {
      return `<div class="lugar-gallery lugar-gallery-single">
        <div class="card-media"><img src="${images[0]}" alt="${nombre}" /></div>
      </div>`;
    }
    const thumbs = images
      .map(
        (src, i) =>
          `<div class="card-media lugar-gallery-thumb"><img src="${src}" alt="${nombre}"${i === 0 ? "" : ' loading="lazy"'} /></div>`
      )
      .join("");
    return `<div class="lugar-gallery">${thumbs}</div>`;
  }

  function infoCardHtml() {
    const ticketBtn = place.ticketUrl
      ? `<a class="btn btn-primary btn-ticket" href="${place.ticketUrl}" target="_blank" rel="noopener noreferrer">${Icon("ticket")} ${t("ticket_button")}</a>`
      : "";
    return `
      <aside class="lugar-info-card">
        <h2>${t("lugar_info_heading")}</h2>
        <div class="lugar-info-row">
          <span class="lugar-info-icon">${Icon("clock")}</span>
          <div><strong>${t("lugar_schedule_label")}</strong><p>${tr(place, "places", "horario")}</p></div>
        </div>
        <div class="lugar-info-row">
          <span class="lugar-info-icon">${Icon("tag")}</span>
          <div><strong>${t("lugar_price_label")}</strong><p>${tr(place, "places", "precio")}</p></div>
        </div>
        <div class="lugar-info-row">
          <span class="lugar-info-icon">${Icon("compass")}</span>
          <div><strong>${t("lugar_duration_label")}</strong><p>${tr(place, "places", "tiempoVisita")}</p></div>
        </div>
        <div class="lugar-info-row">
          <span class="lugar-info-icon">${Icon("map")}</span>
          <div><strong>${t("lugar_getting_there_label")}</strong><p>${tr(place, "places", "comoLlegar")}</p></div>
        </div>
        <div class="lugar-info-row">
          <span class="lugar-info-icon">${Icon("info")}</span>
          <div><strong>${t("lugar_accessibility_label")}</strong><p>${tr(place, "places", "accesibilidad")}</p></div>
        </div>
        ${ticketBtn}
        ${typeof affiliateBlockHtml === "function" ? affiliateBlockHtml(place.id) : ""}
      </aside>`;
  }

  function tipsHtml() {
    const tips = DATA_I18N.places[place.id];
    const lang = Lang.get();
    const list =
      lang !== "es" && tips && tips[lang] && tips[lang].consejoLocal
        ? tips[lang].consejoLocal
        : place.consejoLocal;
    return `
      <div class="lugar-tips">
        <h2>${t("lugar_tips_heading")}</h2>
        <ul>${list.map((tip) => `<li>${Icon("star")} <span>${tip}</span></li>`).join("")}</ul>
      </div>`;
  }

  function nearbyHtml() {
    const nearby = nearbyPlaces();
    if (nearby.length === 0) {
      return `<div class="lugar-nearby"><h2>${t("lugar_nearby_heading")}</h2><p class="empty-state">${t("lugar_nearby_empty")}</p></div>`;
    }
    const chips = nearby
      .map(
        (p) =>
          `<a class="lugar-nearby-chip" href="/lugares/${p.slug || p.id}.html">${Icon(p.icono)} ${tr(p, "places", "nombre")}</a>`
      )
      .join("");
    return `<div class="lugar-nearby"><h2>${t("lugar_nearby_heading")}</h2><div class="lugar-nearby-chips">${chips}</div></div>`;
  }

  function setMetaTag(attr, key, value) {
    if (!value) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  function updateSeoTags() {
    const nombre = tr(place, "places", "nombre");
    const desc = tr(place, "places", "porQueVisitar").replace(/\s+/g, " ").slice(0, 155);
    const slug = place.slug || place.id;
    const url = `https://cordobapp.com/lugares/${slug}.html`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    setMetaTag("name", "description", desc);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", "Cordobapp");
    setMetaTag("property", "og:title", nombre);
    setMetaTag("property", "og:description", desc);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:image", place.imagen);
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", nombre);
    setMetaTag("name", "twitter:description", desc);
    setMetaTag("name", "twitter:image", place.imagen);

    let ld = document.getElementById("place-jsonld");
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "place-jsonld";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: nombre,
      description: tr(place, "places", "porQueVisitar"),
      image: place.imagen,
      url,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Córdoba",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: place.lat,
        longitude: place.lng,
      },
      isAccessibleForFree: !!place.esGratis,
    });
  }

  function render() {
    const nombre = tr(place, "places", "nombre");
    document.title = `${nombre} — ${t("brand")}`;
    updateSeoTags();

    const badge = place.imprescindible
      ? `<span class="lugar-badge">${Icon("star")} ${t("lugar_essential_badge")}</span>`
      : "";

    content.innerHTML = `
      <a class="lugar-back" href="/lugares.html">${Icon("arrow-up")} ${t("lugar_back_link")}</a>

      ${galleryHtml()}

      <div class="lugar-header">
        <span class="tag">${trCategory(place.categoria)}</span>
        ${badge}
        <h1>${nombre}</h1>
      </div>

      <div class="lugar-layout">
        <div class="lugar-main">
          <div class="lugar-why">
            <h2>${t("lugar_why_heading")}</h2>
            <p>${tr(place, "places", "porQueVisitar")}</p>
          </div>

          <details class="lugar-history">
            <summary>${t("lugar_history_heading")} — ${t("lugar_history_toggle")}</summary>
            <p>${tr(place, "places", "historia")}</p>
          </details>

          ${tipsHtml()}

          <div id="lugar-map" class="lugar-map"></div>

          ${nearbyHtml()}

          <div class="lugar-actions">
            <a class="btn btn-outline-dark" href="/mapa.html?focus=${place.id}">${Icon("map")} ${t("lugar_view_map")}</a>
            <button class="btn btn-outline-dark favorite-btn route-btn" data-id="${place.id}" data-name="${nombre}">${Icon("heart")} <span class="route-btn-label"></span></button>
            <a class="btn btn-outline-dark" href="/index.html?ask=${encodeURIComponent(t("chat_ask_prefill", { name: nombre }))}">${Icon("chat")} ${t("lugar_ask_assistant")}</a>
          </div>
        </div>

        <div class="lugar-side">
          ${infoCardHtml()}
        </div>
      </div>
    `;

    updateRouteBtn();
    setTimeout(setupMap, 0);
  }

  function updateRouteBtn() {
    const btn = content.querySelector(".route-btn");
    if (!btn) return;
    const isFav = Favorites.has(place.id);
    btn.classList.toggle("active", isFav);
    btn.querySelector(".route-btn-label").textContent = t(
      isFav ? "route_added_button" : "route_add_button"
    );
  }

  function setupMap() {
    const mapEl = document.getElementById("lugar-map");
    if (!mapEl || typeof L === "undefined") return;
    if (map) {
      map.remove();
      map = null;
    }
    map = L.map("lugar-map", { scrollWheelZoom: false }).setView([place.lat, place.lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    L.marker([place.lat, place.lng]).addTo(map).bindPopup(tr(place, "places", "nombre"));
  }

  document.addEventListener("favorites-changed", updateRouteBtn);

  document.addEventListener("lang-changed", render);
  document.addEventListener("afiliados-loaded", render);

  render();
});
