document.addEventListener("DOMContentLoaded", () => {
  const quizEl = document.getElementById("planner-quiz");
  const resultEl = document.getElementById("planner-result");
  if (!quizEl || !resultEl) return;

  const DAYS_OPTIONS = [
    { value: "medio", labelKey: "planner_days_half" },
    { value: "1", labelKey: "planner_days_1" },
    { value: "2", labelKey: "planner_days_2" },
    { value: "3+", labelKey: "planner_days_3" },
  ];
  const COMPANION_OPTIONS = [
    { value: "solo", icon: "user", labelKey: "planner_companion_solo" },
    { value: "pareja", icon: "heart", labelKey: "planner_companion_couple" },
    { value: "familia", icon: "home", labelKey: "planner_companion_family" },
    { value: "amigos", icon: "users", labelKey: "planner_companion_friends" },
  ];
  const INTEREST_OPTIONS = [
    { value: "historia", icon: "landmark", labelKey: "planner_interest_history" },
    { value: "gastronomia", icon: "utensils", labelKey: "planner_interest_food" },
    { value: "fotografia", icon: "camera", labelKey: "planner_interest_photo" },
    { value: "compras", icon: "tag", labelKey: "planner_interest_shopping" },
    { value: "flamenco", icon: "star", labelKey: "planner_interest_flamenco" },
    { value: "relax", icon: "heart", labelKey: "planner_interest_relax" },
  ];
  const PACE_OPTIONS = [
    { value: "tranquilo", labelKey: "planner_pace_calm" },
    { value: "intenso", labelKey: "planner_pace_intense" },
  ];

  const INTEREST_CATEGORY = {
    historia: ["Monumento", "Yacimiento arqueológico", "Iglesia", "Museo"],
    compras: ["Plaza"],
  };
  const PHOTOGENIC_IDS = ["puente-romano", "juderia", "mezquita", "calahorra", "palacio-viana"];
  const DAY_COLORS = ["#bd4e2a", "#2b4a5e", "#6e7b4a", "#8c3a22"];

  let profile = { days: "1", companions: "pareja", interests: ["historia"], pace: "tranquilo", date: "" };
  let currentItinerary = null;
  let dayMaps = [];

  /* ---------- utilidades ---------- */

  function haversineDist(aLat, aLng, bLat, bLng) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function walkMinutes(meters) {
    return Math.max(1, Math.round(meters / 83.3));
  }

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

  function seasonNote(dateStr) {
    if (!dateStr) return null;
    const d = new Date(`${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return null;
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();

    const easter = easterDate(year);
    const semanaSantaStart = new Date(easter);
    semanaSantaStart.setDate(easter.getDate() - 6);
    if (d >= semanaSantaStart && d <= easter) return { key: "planner_season_semana_santa" };
    if (month === 5 && day <= 14) return { key: "planner_season_patios" };
    if (month >= 6 && month <= 8) return { key: "planner_season_heat" };
    return null;
  }

  function collectionOfMeal(item) {
    return RESTAURANTS.some((r) => r.id === item.id) ? "restaurants" : "tapas";
  }

  function slotLabelKey(slot) {
    return {
      mañana: "planner_slot_morning",
      mediodia: "planner_slot_midday",
      tarde: "planner_slot_afternoon",
      noche: "planner_slot_night",
    }[slot];
  }

  function slotIcon(slot) {
    return { mañana: "compass", mediodia: "utensils", tarde: "camera", noche: "star" }[slot];
  }

  function clearDayMaps() {
    dayMaps.forEach((m) => m.remove());
    dayMaps = [];
  }

  /* ---------- motor de selección ---------- */

  function scorePlace(p, interests) {
    let score = p.imprescindible ? 4 : 0;
    interests.forEach((interest) => {
      const cats = INTEREST_CATEGORY[interest];
      if (cats && cats.includes(p.categoria)) score += 2;
      if (interest === "fotografia" && PHOTOGENIC_IDS.includes(p.id)) score += 2;
    });
    return score;
  }

  function buildCandidatePlaces(prof, includeMedina) {
    return PLACES.filter((p) => includeMedina || p.id !== "medina-azahara")
      .map((p) => ({ p, score: scorePlace(p, prof.interests) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  }

  function pickNearest(fromLatLng, pool, usedIds, topN) {
    const candidates = pool.filter((p) => !usedIds.has(p.id)).slice(0, topN);
    if (candidates.length === 0) return null;
    if (!fromLatLng) return candidates[0];
    let best = candidates[0];
    let bestDist = haversineDist(fromLatLng.lat, fromLatLng.lng, best.lat, best.lng);
    candidates.forEach((c) => {
      const dist = haversineDist(fromLatLng.lat, fromLatLng.lng, c.lat, c.lng);
      if (dist < bestDist) {
        best = c;
        bestDist = dist;
      }
    });
    return best;
  }

  function pickMeal(fromLatLng, usedMealIds, preferRestaurant) {
    const base = preferRestaurant ? [...RESTAURANTS, ...TAPAS] : [...TAPAS, ...RESTAURANTS];
    const pool = base.filter((m) => !usedMealIds.has(m.id)).slice(0, 8);
    if (pool.length === 0) return null;
    if (!fromLatLng) return pool[0];
    let best = pool[0];
    let bestDist = haversineDist(fromLatLng.lat, fromLatLng.lng, best.lat, best.lng);
    pool.forEach((m) => {
      const dist = haversineDist(fromLatLng.lat, fromLatLng.lng, m.lat, m.lng);
      if (dist < bestDist) {
        best = m;
        bestDist = dist;
      }
    });
    return best;
  }

  function makeStop(slot, collection, item, fromLatLng, isMeal) {
    const walk = fromLatLng
      ? (() => {
          const meters = Math.round(haversineDist(fromLatLng.lat, fromLatLng.lng, item.lat, item.lng));
          return { meters, minutes: walkMinutes(meters) };
        })()
      : null;
    return { slot, type: isMeal ? "meal" : "place", collection, id: item.id, walk };
  }

  function makeActivityStop(slot, labelKey) {
    return { slot, type: "activity", labelKey, walk: null };
  }

  function generateItinerary(prof) {
    const dayCount = prof.days === "medio" ? 1 : prof.days === "3+" ? 3 : parseInt(prof.days, 10);
    const isHalfDay = prof.days === "medio";
    const includeMedina = prof.days === "3+";
    const stopsPerSlot = prof.pace === "intenso" ? 2 : 1;
    const preferRestaurant = prof.interests.includes("gastronomia");

    const candidatePool = buildCandidatePlaces(prof, includeMedina);
    const usedPlaceIds = new Set();
    const usedMealIds = new Set();

    const days = [];
    let lastLatLng = null;

    for (let d = 1; d <= dayCount; d++) {
      const stops = [];
      const isMedinaDay = includeMedina && d === dayCount;
      lastLatLng = null;

      if (isMedinaDay) {
        const medina = PLACES.find((p) => p.id === "medina-azahara");
        stops.push(makeStop("mañana", "places", medina, lastLatLng));
        usedPlaceIds.add(medina.id);
        lastLatLng = { lat: medina.lat, lng: medina.lng };

        const lunch = pickMeal(lastLatLng, usedMealIds, preferRestaurant);
        if (lunch) {
          stops.push(makeStop("mediodia", collectionOfMeal(lunch), lunch, lastLatLng, true));
          usedMealIds.add(lunch.id);
          lastLatLng = { lat: lunch.lat, lng: lunch.lng };
        }

        for (let i = 0; i < stopsPerSlot; i++) {
          const next = pickNearest(lastLatLng, candidatePool, usedPlaceIds, 6);
          if (!next) break;
          stops.push(makeStop("tarde", "places", next, lastLatLng));
          usedPlaceIds.add(next.id);
          lastLatLng = { lat: next.lat, lng: next.lng };
        }

        const dinner = pickMeal(lastLatLng, usedMealIds, preferRestaurant);
        if (dinner) {
          stops.push(makeStop("noche", collectionOfMeal(dinner), dinner, lastLatLng, true));
          usedMealIds.add(dinner.id);
          lastLatLng = { lat: dinner.lat, lng: dinner.lng };
        }
        if (prof.interests.includes("flamenco")) {
          stops.push(makeActivityStop("noche", "planner_activity_flamenco"));
        }

        days.push({ index: d, stops });
        continue;
      }

      for (let i = 0; i < stopsPerSlot; i++) {
        const next = pickNearest(lastLatLng, candidatePool, usedPlaceIds, 6);
        if (!next) break;
        stops.push(makeStop("mañana", "places", next, lastLatLng));
        usedPlaceIds.add(next.id);
        lastLatLng = { lat: next.lat, lng: next.lng };
      }

      const lunch = pickMeal(lastLatLng, usedMealIds, preferRestaurant);
      if (lunch) {
        stops.push(makeStop("mediodia", collectionOfMeal(lunch), lunch, lastLatLng, true));
        usedMealIds.add(lunch.id);
        lastLatLng = { lat: lunch.lat, lng: lunch.lng };
      }

      if (!isHalfDay) {
        for (let i = 0; i < stopsPerSlot; i++) {
          const next = pickNearest(lastLatLng, candidatePool, usedPlaceIds, 6);
          if (!next) break;
          stops.push(makeStop("tarde", "places", next, lastLatLng));
          usedPlaceIds.add(next.id);
          lastLatLng = { lat: next.lat, lng: next.lng };
        }

        const dinner = pickMeal(lastLatLng, usedMealIds, preferRestaurant);
        if (dinner) {
          stops.push(makeStop("noche", collectionOfMeal(dinner), dinner, lastLatLng, true));
          usedMealIds.add(dinner.id);
          lastLatLng = { lat: dinner.lat, lng: dinner.lng };
        }
        if (prof.interests.includes("flamenco")) {
          stops.push(makeActivityStop("noche", "planner_activity_flamenco"));
        }
      }

      days.push({ index: d, stops });
    }

    return { profile: prof, days, season: seasonNote(prof.date) };
  }

  /* ---------- render del quiz ---------- */

  function optionCard(opt, groupKey, selectedValue, multi) {
    const isSelected = multi ? selectedValue.includes(opt.value) : selectedValue === opt.value;
    return `<button type="button" class="planner-option${isSelected ? " selected" : ""}" data-group="${groupKey}" data-value="${opt.value}">
      ${opt.icon ? Icon(opt.icon) : ""}
      <span>${t(opt.labelKey)}</span>
    </button>`;
  }

  function renderQuiz() {
    quizEl.hidden = false;
    resultEl.hidden = true;
    quizEl.innerHTML = `
      <div class="planner-question">
        <h3>${t("planner_q_days")}</h3>
        <div class="planner-options">${DAYS_OPTIONS.map((o) => optionCard(o, "days", profile.days, false)).join("")}</div>
      </div>
      <div class="planner-question">
        <h3>${t("planner_q_companions")}</h3>
        <div class="planner-options">${COMPANION_OPTIONS.map((o) => optionCard(o, "companions", profile.companions, false)).join("")}</div>
      </div>
      <div class="planner-question">
        <h3>${t("planner_q_interests")}</h3>
        <div class="planner-options">${INTEREST_OPTIONS.map((o) => optionCard(o, "interests", profile.interests, true)).join("")}</div>
      </div>
      <div class="planner-question">
        <h3>${t("planner_q_pace")}</h3>
        <div class="planner-options">${PACE_OPTIONS.map((o) => optionCard(o, "pace", profile.pace, false)).join("")}</div>
      </div>
      <div class="planner-question">
        <h3>${t("planner_q_date")}</h3>
        <input type="date" id="planner-date-input" class="planner-date-input" value="${profile.date}" />
        <p class="planner-date-hint">${t("planner_q_date_hint")}</p>
      </div>
      <button class="btn btn-primary planner-generate-btn" id="planner-generate-btn">${Icon("route")} ${t("planner_generate_button")}</button>
    `;
    bindQuizEvents();
  }

  function bindQuizEvents() {
    quizEl.querySelectorAll(".planner-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.dataset.group;
        const value = btn.dataset.value;
        if (group === "interests") {
          const idx = profile.interests.indexOf(value);
          if (idx >= 0) profile.interests.splice(idx, 1);
          else profile.interests.push(value);
        } else {
          profile[group] = value;
        }
        renderQuiz();
      });
    });

    const dateInput = document.getElementById("planner-date-input");
    dateInput.addEventListener("change", () => {
      profile.date = dateInput.value;
    });

    document.getElementById("planner-generate-btn").addEventListener("click", () => {
      if (profile.interests.length === 0) profile.interests = ["historia"];
      clearDayMaps();
      renderItinerary(generateItinerary(profile));
      if (typeof trackEvent === "function") {
        trackEvent("itinerario_generado", {
          dias: profile.days,
          compania: profile.companions,
          intereses: profile.interests.join(","),
        });
      }
    });
  }

  /* ---------- render del itinerario ---------- */

  function walkConnectorHtml(walk) {
    if (!walk) return "";
    return `<div class="planner-walk">${Icon("route")} ${t("planner_walk_label", {
      min: walk.minutes,
      km: (walk.meters / 1000).toFixed(1),
    })}</div>`;
  }

  function stopCardHtml(stop, dayIndex, stopIndex) {
    if (stop.type === "activity") {
      return `<div class="planner-stop planner-stop-activity">
        <span class="planner-stop-icon" style="background:var(--ocre)">${Icon("star")}</span>
        <div class="planner-stop-body">
          <h4>${t(stop.labelKey)}</h4>
          <p class="planner-stop-note">${t("planner_activity_note")}</p>
        </div>
      </div>`;
    }

    const item = resolveMapPoint({ collection: stop.collection, id: stop.id });
    if (!item) return "";
    const name = tr(item, stop.collection, "nombre");
    const desc = item.descripcion
      ? tr(item, stop.collection, "descripcion")
      : item.tipo
      ? tr(item, stop.collection, "tipo")
      : "";
    const media = item.imagen
      ? `<div class="planner-stop-media"><img src="${item.imagen}" alt="${name}" loading="lazy" /></div>`
      : `<div class="planner-stop-media planner-stop-media-fallback">${Icon(item.icono)}</div>`;
    const duration = item.tiempoVisita
      ? `<span class="planner-stop-meta">${Icon("clock")} ${tr(item, stop.collection, "tiempoVisita")}</span>`
      : "";
    const ficha =
      stop.collection === "places"
        ? `<a class="planner-stop-link" href="lugares/${item.slug || item.id}.html">${t("map_sheet_view_place")}</a>`
        : "";
    const reservar =
      stop.collection === "places" && typeof affiliateStopLinkHtml === "function"
        ? affiliateStopLinkHtml(item.id)
        : "";

    return `
      <div class="planner-stop">
        ${media}
        <div class="planner-stop-body">
          <h4>${name}</h4>
          ${desc ? `<p class="planner-stop-desc">${desc}</p>` : ""}
          <div class="planner-stop-metas">${duration}</div>
          <div class="planner-stop-actions">
            ${ficha}
            ${reservar}
            <button class="planner-regenerate-btn" data-day="${dayIndex}" data-stop="${stopIndex}">${Icon("route")} ${t("planner_regenerate")}</button>
          </div>
        </div>
      </div>`;
  }

  function renderDay(day) {
    let lastSlot = null;
    let timelineHtml = "";
    day.stops.forEach((stop, i) => {
      if (stop.walk) timelineHtml += walkConnectorHtml(stop.walk);
      if (stop.slot !== lastSlot) {
        timelineHtml += `<div class="planner-slot-heading">${Icon(slotIcon(stop.slot))} ${t(slotLabelKey(stop.slot))}</div>`;
        lastSlot = stop.slot;
      }
      timelineHtml += stopCardHtml(stop, day.index, i);
    });

    return `<div class="planner-day" data-day="${day.index}">
      <div class="planner-day-header"><h3>${t("planner_day_label", { n: day.index })}</h3></div>
      <div class="planner-day-map" id="planner-map-${day.index}"></div>
      <div class="planner-day-timeline">${timelineHtml}</div>
    </div>`;
  }

  function initDayMap(day) {
    const mapEl = document.getElementById(`planner-map-${day.index}`);
    if (!mapEl || typeof L === "undefined") return;
    const points = day.stops
      .filter((s) => s.type !== "activity")
      .map((s) => resolveMapPoint({ collection: s.collection, id: s.id }))
      .filter(Boolean);
    if (points.length === 0) {
      mapEl.style.display = "none";
      return;
    }

    const map = L.map(mapEl, { scrollWheelZoom: false }).setView([points[0].lat, points[0].lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const color = DAY_COLORS[(day.index - 1) % DAY_COLORS.length];
    const latlngs = points.map((p) => [p.lat, p.lng]);
    L.polyline(latlngs, { color, weight: 4, opacity: 0.8, dashArray: "1,10" }).addTo(map);
    points.forEach((p, i) => {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          html: `<span class="map-marker map-marker-number" style="background:${color}">${i + 1}</span>`,
          className: "map-marker-wrap",
          iconSize: [26, 26],
          iconAnchor: [13, 26],
        }),
      }).addTo(map);
    });
    map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });
    dayMaps.push(map);
  }

  function collectUsedIds(itinerary) {
    const usedPlaces = new Set();
    const usedMeals = new Set();
    itinerary.days.forEach((day) =>
      day.stops.forEach((s) => {
        if (s.type === "activity") return;
        if (s.collection === "places") usedPlaces.add(s.id);
        else usedMeals.add(s.id);
      })
    );
    return { usedPlaces, usedMeals };
  }

  function regenerateStop(dayIndex, stopIndex) {
    const day = currentItinerary.days.find((d) => d.index === dayIndex);
    if (!day) return;
    const stop = day.stops[stopIndex];
    if (!stop || stop.type === "activity") return;

    const { usedPlaces, usedMeals } = collectUsedIds(currentItinerary);
    const prevStop = day.stops[stopIndex - 1];
    const prevItem =
      prevStop && prevStop.type !== "activity" ? resolveMapPoint({ collection: prevStop.collection, id: prevStop.id }) : null;
    const fromLatLng = prevItem ? { lat: prevItem.lat, lng: prevItem.lng } : null;

    let replacement = null;
    let newCollection = stop.collection;

    if (stop.type === "meal") {
      const preferRestaurant = currentItinerary.profile.interests.includes("gastronomia");
      replacement = pickMeal(fromLatLng, usedMeals, preferRestaurant);
      if (replacement) newCollection = collectionOfMeal(replacement);
    } else {
      const includeMedina = currentItinerary.profile.days === "3+";
      const pool = buildCandidatePlaces(currentItinerary.profile, includeMedina);
      replacement = pickNearest(fromLatLng, pool, usedPlaces, 8);
    }

    if (!replacement) {
      showToast(t("planner_no_alternatives"));
      return;
    }

    stop.collection = newCollection;
    stop.id = replacement.id;
    if (fromLatLng) {
      const meters = Math.round(haversineDist(fromLatLng.lat, fromLatLng.lng, replacement.lat, replacement.lng));
      stop.walk = { meters, minutes: walkMinutes(meters) };
    }

    const nextStop = day.stops[stopIndex + 1];
    if (nextStop && nextStop.type !== "activity") {
      const nextItem = resolveMapPoint({ collection: nextStop.collection, id: nextStop.id });
      if (nextItem) {
        const meters = Math.round(haversineDist(replacement.lat, replacement.lng, nextItem.lat, nextItem.lng));
        nextStop.walk = { meters, minutes: walkMinutes(meters) };
      }
    }

    clearDayMaps();
    renderItinerary(currentItinerary);
  }

  /* ---------- compartir / guardar ---------- */

  function encodeItinerary(itinerary) {
    const compact = {
      p: itinerary.profile,
      d: itinerary.days.map((day) =>
        day.stops.map((s) => (s.type === "activity" ? ["a", s.slot, s.labelKey] : [s.collection, s.slot, s.id]))
      ),
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
  }

  function decodeItinerary(encoded) {
    try {
      const compact = JSON.parse(decodeURIComponent(escape(atob(encoded))));
      const prof = compact.p;
      const days = compact.d.map((stopsArr, i) => {
        const stops = [];
        let lastLatLng = null;
        stopsArr.forEach((entry) => {
          if (entry[0] === "a") {
            stops.push({ slot: entry[1], type: "activity", labelKey: entry[2], walk: null });
            return;
          }
          const [collection, slot, id] = entry;
          const item = resolveMapPoint({ collection, id });
          if (!item) return;
          const walk = lastLatLng
            ? (() => {
                const meters = Math.round(haversineDist(lastLatLng.lat, lastLatLng.lng, item.lat, item.lng));
                return { meters, minutes: walkMinutes(meters) };
              })()
            : null;
          stops.push({ slot, type: collection === "places" ? "place" : "meal", collection, id, walk });
          lastLatLng = { lat: item.lat, lng: item.lng };
        });
        return { index: i + 1, stops };
      });
      return { profile: prof, days, season: seasonNote(prof.date) };
    } catch (e) {
      return null;
    }
  }

  function updateShareUrl(itinerary) {
    window.location.hash = `i=${encodeItinerary(itinerary)}`;
  }

  function shareWhatsApp(itinerary) {
    const text = t("planner_whatsapp_text", { days: itinerary.days.length, url: window.location.href });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  function buildAssistantMessage(itinerary) {
    const parts = itinerary.days.map((day) => {
      const names = day.stops
        .filter((s) => s.type !== "activity")
        .map((s) => {
          const item = resolveMapPoint({ collection: s.collection, id: s.id });
          return item ? tr(item, s.collection, "nombre") : "";
        })
        .filter(Boolean);
      return `${t("planner_day_label", { n: day.index })}: ${names.join(", ")}`;
    });
    return `${t("planner_assistant_intro")}\n${parts.join("\n")}\n${t("planner_assistant_ask")}`;
  }

  /* ---------- render principal ---------- */

  function renderItinerary(itinerary) {
    currentItinerary = itinerary;
    quizEl.hidden = true;
    resultEl.hidden = false;

    const seasonHtml = itinerary.season
      ? `<div class="planner-season-note">${Icon("info")} ${t(itinerary.season.key)}</div>`
      : "";
    const note3plus =
      itinerary.profile.days === "3+"
        ? `<p class="planner-note">${t("planner_note_3plus")}</p>`
        : "";

    resultEl.innerHTML = `
      <div class="planner-result-header">
        <button class="planner-edit-btn" id="planner-edit-btn">${Icon("chevronDown")} ${t("planner_edit_answers")}</button>
        <h3>${t("planner_result_title")}</h3>
        ${seasonHtml}
        ${note3plus}
      </div>
      <div class="planner-days">${itinerary.days.map(renderDay).join("")}</div>
      <div class="planner-share-bar">
        <button class="btn btn-outline-dark" id="planner-copy-link">${Icon("external-link")} ${t("planner_copy_link")}</button>
        <button class="btn btn-outline-dark" id="planner-whatsapp">${Icon("send")} ${t("planner_share_whatsapp")}</button>
        <button class="btn btn-outline-dark" id="planner-pdf">${Icon("ticket")} ${t("planner_download_pdf")}</button>
        <button class="btn btn-primary" id="planner-ask-assistant">${Icon("chat")} ${t("planner_ask_assistant")}</button>
      </div>
    `;

    setTimeout(() => {
      itinerary.days.forEach(initDayMap);
      bindResultEvents();
    }, 0);

    updateShareUrl(itinerary);
  }

  function bindResultEvents() {
    document.getElementById("planner-edit-btn").addEventListener("click", () => {
      clearDayMaps();
      currentItinerary = null;
      window.location.hash = "";
      renderQuiz();
    });
    document.getElementById("planner-copy-link").addEventListener("click", () => {
      updateShareUrl(currentItinerary);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => showToast(t("planner_link_copied")));
      }
    });
    document.getElementById("planner-whatsapp").addEventListener("click", () => shareWhatsApp(currentItinerary));
    document.getElementById("planner-pdf").addEventListener("click", () => window.print());
    document.getElementById("planner-ask-assistant").addEventListener("click", () => {
      window.location.href = `index.html?ask=${encodeURIComponent(buildAssistantMessage(currentItinerary))}`;
    });
    resultEl.querySelectorAll(".planner-regenerate-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        regenerateStop(parseInt(btn.dataset.day, 10), parseInt(btn.dataset.stop, 10));
      });
    });
  }

  /* ---------- inicio ---------- */

  function init() {
    if (window.location.hash.startsWith("#i=")) {
      const decoded = decodeItinerary(window.location.hash.slice(3));
      if (decoded) {
        clearDayMaps();
        renderItinerary(decoded);
        return;
      }
    }
    renderQuiz();
  }

  document.addEventListener("lang-changed", () => {
    if (currentItinerary) {
      clearDayMaps();
      renderItinerary(currentItinerary);
    } else {
      renderQuiz();
    }
  });

  document.addEventListener("afiliados-loaded", () => {
    if (currentItinerary) {
      clearDayMaps();
      renderItinerary(currentItinerary);
    }
  });

  init();
});
