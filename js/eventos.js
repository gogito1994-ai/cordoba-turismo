document.addEventListener("DOMContentLoaded", () => {
  const thisMonthEl = document.getElementById("events-this-month");
  const calendarEl = document.getElementById("events-calendar");
  const fixedGridEl = document.getElementById("events-fixed-grid");
  const punctualListEl = document.getElementById("events-punctual-list");
  const modalEl = document.getElementById("event-modal");
  const modalContentEl = document.getElementById("event-modal-content");
  const modalCloseBtn = document.getElementById("event-modal-close");
  const modalBackdrop = document.getElementById("event-modal-backdrop");
  if (!fixedGridEl) return;

  let selectedMonth = new Date().getMonth() + 1;

  function monthLabel(monthNumber) {
    const locale = localeForLang();
    return new Date(2000, monthNumber - 1, 1).toLocaleDateString(locale, { month: "short" });
  }

  function renderCalendar() {
    const currentMonth = new Date().getMonth() + 1;
    const pills = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      .map((m) => {
        const active = selectedMonth === m ? "active" : "";
        const isNow = m === currentMonth ? "is-current" : "";
        return `<button type="button" class="events-month-pill ${active} ${isNow}" data-month="${m}">${monthLabel(m)}</button>`;
      })
      .join("");
    const allPill = `<button type="button" class="events-month-pill ${selectedMonth === null ? "active" : ""}" data-month="all">${t("events_calendar_all")}</button>`;

    calendarEl.innerHTML = `<h3 class="events-subheading">${t("events_calendar_title")}</h3><div class="events-month-pills">${allPill}${pills}</div>`;

    calendarEl.querySelectorAll(".events-month-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedMonth = btn.dataset.month === "all" ? null : parseInt(btn.dataset.month, 10);
        renderCalendar();
        renderFixedGrid();
      });
    });
  }

  function eventCardHtml(ev) {
    const badge = ev.periodico ? `<span class="event-card-badge">${t("events_periodico_badge")}</span>` : "";
    return `
      <article class="card event-card" data-id="${ev.id}">
        <div class="event-card-media"><img src="${ev.imagen}" alt="${tr(ev, "events", "nombre")}" loading="lazy" /></div>
        <div class="card-body">
          <span class="card-icon">${Icon(ev.icono)}</span>
          <h3>${tr(ev, "events", "nombre")}</h3>
          <div class="meta">${Icon("calendar")} ${tr(ev, "events", "fechaTexto")}</div>
          ${badge}
          <button type="button" class="btn btn-outline-dark event-card-btn" data-id="${ev.id}">${t("events_view_detail")}</button>
        </div>
      </article>`;
  }

  function renderFixedGrid() {
    const filtered =
      selectedMonth === null
        ? FIXED_EVENTS
        : FIXED_EVENTS.filter((ev) => {
            if (ev.periodico) return true;
            if (ev.esSemanaSanta) return [3, 4].includes(selectedMonth);
            return ev.meses.includes(selectedMonth);
          });

    fixedGridEl.innerHTML =
      `<h3 class="events-subheading">${t("events_fixed_title")}</h3><div class="grid">` +
      (filtered.map(eventCardHtml).join("") ||
        `<p class="empty-state">${t("events_this_month_empty")}</p>`) +
      `</div>`;

    fixedGridEl.querySelectorAll(".event-card, .event-card-btn").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openEventModal(el.dataset.id);
      });
    });
  }

  function renderPunctualList() {
    const upcoming = getUpcomingPunctualEvents(new Date());
    if (!upcoming.length) {
      punctualListEl.innerHTML = `<h3 class="events-subheading">${t("events_upcoming_title")}</h3><p class="empty-state">${t("events_upcoming_empty")}</p>`;
      return;
    }
    const locale = localeForLang();
    const items = upcoming
      .map((ev) => {
        const [startIso] = ev.fecha.split("/");
        const dateLabel = new Date(`${startIso}T00:00:00`).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
        });
        const tag = ev.enlace ? `<a href="${ev.enlace}" target="_blank" rel="noopener noreferrer">` : "<div>";
        const closeTag = ev.enlace ? "</a>" : "</div>";
        return `${tag}<article class="event-punctual-item">
          <span class="event-punctual-date">${dateLabel}</span>
          <div>
            <strong>${ev.nombre}</strong>
            <p>${ev.descripcion || ""}${ev.lugar ? ` — ${ev.lugar}` : ""}</p>
          </div>
        </article>${closeTag}`;
      })
      .join("");
    punctualListEl.innerHTML = `<h3 class="events-subheading">${t("events_upcoming_title")}</h3><div class="events-punctual-items">${items}</div>`;
  }

  function openEventModal(id) {
    const ev = FIXED_EVENTS.find((e) => e.id === id);
    if (!ev) return;
    const consejos = tr(ev, "events", "consejos");
    const consejosList = (Array.isArray(consejos) ? consejos : [])
      .map((c) => `<li>${c}</li>`)
      .join("");
    modalContentEl.innerHTML = `
      <div class="event-modal-media"><img src="${ev.imagen}" alt="${tr(ev, "events", "nombre")}" loading="lazy" /></div>
      <div class="event-modal-body">
        <span class="card-icon">${Icon(ev.icono)}</span>
        <h2>${tr(ev, "events", "nombre")}</h2>
        <div class="meta">${Icon("calendar")} ${tr(ev, "events", "fechaTexto")}</div>
        <p>${tr(ev, "events", "queEs")}</p>
        <h4>${t("events_tips_heading")}</h4>
        <ul class="event-modal-tips">${consejosList}</ul>
        <h4>${t("events_impact_heading")}</h4>
        <p>${tr(ev, "events", "impacto")}</p>
      </div>
    `;
    modalEl.classList.add("open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("event-modal-open");
    window.history.replaceState({}, "", `#${id}`);
  }

  function closeEventModal() {
    modalEl.classList.remove("open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("event-modal-open");
    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState({}, "", url);
  }

  modalCloseBtn.addEventListener("click", closeEventModal);
  modalBackdrop.addEventListener("click", closeEventModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl.classList.contains("open")) closeEventModal();
  });

  function injectEventsJsonLd() {
    const fixedEvents = FIXED_EVENTS.filter((ev) => !ev.periodico).map((ev) => ({
      "@type": "Event",
      name: tr(ev, "events", "nombre"),
      description: tr(ev, "events", "queEs"),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: "Córdoba", address: { "@type": "PostalAddress", addressLocality: "Córdoba", addressCountry: "ES" } },
      eventSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1Y",
        byMonth: ev.esSemanaSanta ? [3, 4] : ev.meses,
      },
    }));

    const punctualEvents = PUNCTUAL_EVENTS.map((ev) => {
      const [startDate, endDate] = ev.fecha.split("/");
      return {
        "@type": "Event",
        name: ev.nombre,
        description: ev.descripcion,
        startDate,
        endDate: endDate || startDate,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: ev.lugar || "Córdoba", address: { "@type": "PostalAddress", addressLocality: "Córdoba", addressCountry: "ES" } },
        ...(ev.enlace ? { url: ev.enlace } : {}),
      };
    });

    let ld = document.getElementById("events-jsonld");
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "events-jsonld";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [...fixedEvents, ...punctualEvents],
    });
  }

  function renderAll() {
    renderThisMonthBlock(thisMonthEl, { compact: false });
    renderCalendar();
    renderFixedGrid();
    renderPunctualList();
    injectEventsJsonLd();
  }

  document.addEventListener("lang-changed", renderAll);

  function openFromHash() {
    const hashId = window.location.hash.slice(1);
    if (hashId && FIXED_EVENTS.some((e) => e.id === hashId)) {
      openEventModal(hashId);
    }
  }

  window.addEventListener("hashchange", openFromHash);

  renderAll();
  openFromHash();
});
