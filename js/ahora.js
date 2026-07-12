document.addEventListener("DOMContentLoaded", () => {
  const weatherEl = document.getElementById("ahora-weather");
  const tipEl = document.getElementById("ahora-tip");
  const nearbyBtn = document.getElementById("ahora-nearby-btn");
  const nearbyResultsEl = document.getElementById("ahora-nearby-results");
  const openListEl = document.getElementById("ahora-open-list");
  if (!weatherEl) return;

  const CORDOBA_LAT = 37.8882;
  const CORDOBA_LNG = -4.7794;

  const WEATHER_ICON = {
    0: "☀", 1: "🌤", 2: "⛅", 3: "☁",
    45: "🌫", 48: "🌫",
    51: "🌦", 53: "🌦", 55: "🌦",
    61: "🌧", 63: "🌧", 65: "🌧",
    71: "🌨", 73: "🌨", 75: "🌨",
    80: "🌦", 81: "🌦", 82: "🌧",
    95: "⛈", 96: "⛈", 99: "⛈",
  };

  let currentTemp = null;

  /* ---------- clima ---------- */

  function loadWeather() {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${CORDOBA_LAT}&longitude=${CORDOBA_LNG}&current=temperature_2m,weather_code&timezone=Europe%2FMadrid`
    )
      .then((res) => res.json())
      .then((data) => {
        const current = data && data.current;
        if (!current) throw new Error("sin datos");
        currentTemp = current.temperature_2m;
        const icon = WEATHER_ICON[current.weather_code] || "🌡";
        weatherEl.innerHTML = `
          <span class="ahora-weather-icon" aria-hidden="true">${icon}</span>
          <div>
            <span class="ahora-weather-temp">${Math.round(currentTemp)}°C</span>
            <p class="ahora-weather-place">${t("ahora_weather_place")}</p>
          </div>
        `;
        renderTip();
      })
      .catch(() => {
        weatherEl.innerHTML = `<p class="empty-state">${t("ahora_weather_error")}</p>`;
        renderTip();
      });
  }

  /* ---------- consejo del día ---------- */

  function easterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  function renderTip() {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const easter = easterDate(now.getFullYear());
    const semanaSantaStart = new Date(easter);
    semanaSantaStart.setDate(easter.getDate() - 6);

    let tipKey = "ahora_tip_default";

    if (now >= semanaSantaStart && now <= easter) {
      tipKey = "ahora_tip_semana_santa";
    } else if (month === 5 && day <= 14) {
      tipKey = "ahora_tip_patios";
    } else if (currentTemp !== null && currentTemp >= 32 && hour >= 13 && hour < 18) {
      tipKey = "ahora_tip_heat";
    } else if (hour < 9 || hour >= 21) {
      tipKey = "ahora_tip_closed_hours";
    }

    tipEl.innerHTML = `
      <span class="ahora-tip-icon">${Icon("info")}</span>
      <div>
        <strong>${t("ahora_tip_heading")}</strong>
        <p>${t(tipKey)}</p>
      </div>
    `;
  }

  /* ---------- cerca de mí ---------- */

  function haversineDist(aLat, aLng, bLat, bLng) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function buildAllPoints() {
    return [
      ...PLACES.map((p) => ({ ...p, collection: "places" })),
      ...RESTAURANTS.map((r) => ({ ...r, collection: "restaurants" })),
      ...TAPAS.map((t) => ({ ...t, collection: "tapas" })),
      ...MIRADORES.map((m) => ({ ...m, collection: "miradores" })),
      ...CONSIGNAS.map((c) => ({ ...c, collection: "consignas" })),
      ...SUPERMERCADOS.map((s) => ({ ...s, collection: "supermercados" })),
      ...FARMACIAS.map((f) => ({ ...f, collection: "farmacias" })),
    ];
  }

  nearbyBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      nearbyResultsEl.innerHTML = `<p class="empty-state">${t("map_locate_unsupported")}</p>`;
      return;
    }
    nearbyBtn.classList.add("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        nearbyBtn.classList.remove("loading");
        const { latitude, longitude } = pos.coords;
        const points = buildAllPoints()
          .map((p) => ({ p, dist: haversineDist(latitude, longitude, p.lat, p.lng) }))
          .filter((entry) => entry.dist <= 800)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 8);

        if (points.length === 0) {
          nearbyResultsEl.innerHTML = `<p class="empty-state">${t("ahora_nearby_empty")}</p>`;
          return;
        }

        nearbyResultsEl.innerHTML = points
          .map(({ p, dist }) => {
            const name = tr(p, p.collection, "nombre");
            const href = p.collection === "places" ? `lugar.html?id=${p.id}` : `mapa.html?focus=${p.id}`;
            return `<a class="ahora-nearby-item" href="${href}">
              <span class="ahora-nearby-icon">${Icon(p.icono)}</span>
              <span><strong>${name}</strong><small>${Math.round(dist)} m</small></span>
            </a>`;
          })
          .join("");
      },
      () => {
        nearbyBtn.classList.remove("loading");
        nearbyResultsEl.innerHTML = `<p class="empty-state">${t("map_locate_denied")}</p>`;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  /* ---------- abierto ahora ---------- */

  const DAY_ORDER = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const DAY_ALIASES = { Mie: "Mié", Sab: "Sáb" };

  function normalizeDay(d) {
    return DAY_ALIASES[d] || d;
  }

  function parseOpenStatus(horario, now) {
    if (!horario) return "unknown";
    if (/24\s*h/i.test(horario)) return "open";

    const segments = horario.split(",");
    const currentDayName = DAY_ORDER[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let foundAnyDayPattern = false;
    let matchedToday = false;
    let openNow = false;

    segments.forEach((seg) => {
      const dayMatch = seg.match(
        /(Todos los días|Lun|Mar|Mié|Mie|Jue|Vie|Sáb|Sab|Dom)(?:-(Lun|Mar|Mié|Mie|Jue|Vie|Sáb|Sab|Dom))?/
      );
      if (!dayMatch) return;
      foundAnyDayPattern = true;

      let daysIncluded;
      if (/Todos los días/i.test(dayMatch[0])) {
        daysIncluded = DAY_ORDER;
      } else {
        const startDay = normalizeDay(dayMatch[1]);
        const endDay = dayMatch[2] ? normalizeDay(dayMatch[2]) : startDay;
        const startIdx = DAY_ORDER.indexOf(startDay);
        const endIdx = DAY_ORDER.indexOf(endDay);
        if (startIdx === -1 || endIdx === -1) return;
        daysIncluded = [];
        let i = startIdx;
        while (true) {
          daysIncluded.push(DAY_ORDER[i]);
          if (i === endIdx) break;
          i = (i + 1) % 7;
        }
      }

      if (!daysIncluded.includes(currentDayName)) return;
      matchedToday = true;

      const timeMatches = [...seg.matchAll(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g)];
      timeMatches.forEach((m) => {
        const startMin = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
        const endMin = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
        if (currentMinutes >= startMin && currentMinutes <= endMin) openNow = true;
      });
    });

    if (!foundAnyDayPattern) return "unknown";
    if (!matchedToday) return "closed";
    return openNow ? "open" : "closed";
  }

  function renderOpenList() {
    const now = new Date();
    const pool = [
      ...PLACES.map((p) => ({ ...p, collection: "places" })),
      ...FARMACIAS.map((f) => ({ ...f, collection: "farmacias" })),
      ...SUPERMERCADOS.map((s) => ({ ...s, collection: "supermercados" })),
      ...CONSIGNAS.map((c) => ({ ...c, collection: "consignas" })),
    ];

    const withStatus = pool.map((p) => ({ p, status: parseOpenStatus(p.horario, now) }));
    const open = withStatus.filter((x) => x.status === "open");
    const closed = withStatus.filter((x) => x.status === "closed");
    const unknown = withStatus.filter((x) => x.status === "unknown");

    function itemHtml(p) {
      const name = tr(p, p.collection, "nombre");
      const href = p.collection === "places" ? `lugar.html?id=${p.id}` : "mapa.html";
      return `<a class="ahora-open-item" href="${href}">
        <span class="ahora-open-icon">${Icon(p.icono)}</span>
        <span>${name}</span>
      </a>`;
    }

    openListEl.innerHTML = `
      <div class="ahora-open-group">
        <h4 class="ahora-open-group-title ahora-open-yes">${Icon("clock")} ${t("ahora_open_now")} (${open.length})</h4>
        <div class="ahora-open-items">${open.map((x) => itemHtml(x.p)).join("") || `<p class="empty-state">${t("ahora_open_none")}</p>`}</div>
      </div>
      <div class="ahora-open-group">
        <h4 class="ahora-open-group-title">${t("ahora_closed_now")} (${closed.length})</h4>
        <div class="ahora-open-items">${closed.map((x) => itemHtml(x.p)).join("")}</div>
      </div>
      ${
        unknown.length
          ? `<div class="ahora-open-group">
              <h4 class="ahora-open-group-title">${t("ahora_unknown_hours")} (${unknown.length})</h4>
              <div class="ahora-open-items">${unknown.map((x) => itemHtml(x.p)).join("")}</div>
            </div>`
          : ""
      }
    `;
  }

  document.addEventListener("lang-changed", () => {
    renderTip();
    renderOpenList();
  });

  loadWeather();
  renderOpenList();
});
