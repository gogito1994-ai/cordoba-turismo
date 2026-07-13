/*
 * Widget de chat con IA para la guía de Córdoba.
 *
 * IMPORTANTE: sustituye WORKER_URL por la URL de tu Cloudflare Worker
 * una vez desplegado. Instrucciones completas en README-chat-ia.md.
 */
const WORKER_URL = "https://damp-water-c6b3.gogito1994.workers.dev/";
const DAILY_MESSAGE_LIMIT = 25;

document.addEventListener("DOMContentLoaded", () => {
  ensureWidgetDom();

  const launchers = [document.getElementById("chat-launcher"), document.getElementById("chat-fab")].filter(
    Boolean
  );
  const widget = document.getElementById("chat-widget");
  const backdrop = document.getElementById("chat-backdrop");
  const closeBtn = document.getElementById("chat-close");
  const locationBtn = document.getElementById("chat-location-btn");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  if (!widget || !form) return;

  let history = [];
  let requesting = false;
  let sharedLocation = null;

  /* ---------- inyección del DOM del widget (se comparte en todas las páginas) ---------- */

  function ensureWidgetDom() {
    if (document.getElementById("chat-widget")) return;

    const fab = document.createElement("button");
    fab.id = "chat-fab";
    fab.className = "chat-fab";
    fab.type = "button";
    fab.dataset.i18nAria = "chat_launch_button";
    fab.setAttribute("aria-label", t("chat_launch_button"));
    fab.innerHTML = Icon("chat");
    document.body.appendChild(fab);

    const widgetEl = document.createElement("div");
    widgetEl.className = "chat-widget";
    widgetEl.id = "chat-widget";
    widgetEl.setAttribute("aria-hidden", "true");
    widgetEl.innerHTML = `
      <div class="chat-backdrop" id="chat-backdrop"></div>
      <div class="chat-panel" role="dialog" aria-modal="true" aria-label="Chat">
        <div class="chat-header">
          <div class="chat-header-title">
            <span class="chat-bot-avatar">${Icon("bot")}</span>
            <div>
              <strong data-i18n="chat_title">Asistente de Córdoba</strong>
              <p data-i18n="chat_subtitle">Responde un asistente con IA. Puede cometer errores.</p>
            </div>
          </div>
          <div class="chat-header-actions">
            <button class="chat-location-btn" id="chat-location-btn" type="button" data-i18n-aria="chat_location_aria" aria-label="Compartir ubicación">${Icon("compass")}</button>
            <button class="chat-close" id="chat-close" data-i18n-aria="aria_close" aria-label="Cerrar">${Icon("x")}</button>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-suggestions" id="chat-suggestions"></div>
        <form class="chat-input-row" id="chat-form">
          <input type="text" id="chat-input" data-i18n-placeholder="chat_input_placeholder" placeholder="Escribe tu pregunta..." autocomplete="off" />
          <button type="submit" class="chat-send-btn" data-i18n-aria="aria_send" aria-label="Enviar">${Icon("send")}</button>
        </form>
      </div>
    `;
    document.body.appendChild(widgetEl);
    applyStaticI18n();
  }

  /* ---------- contexto de página ---------- */

  function currentPlaceId() {
    const fromBody = document.body.dataset.placeId;
    if (fromBody) return fromBody;
    if (window.location.pathname.split("/").pop() === "lugar.html") {
      return new URLSearchParams(window.location.search).get("id");
    }
    return null;
  }

  function getPageContext() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    let placeName = null;
    const id = currentPlaceId();
    if (id && typeof PLACES !== "undefined") {
      const place = PLACES.find((p) => p.id === id);
      if (place) placeName = tr(place, "places", "nombre");
    }
    return { page: path, placeName };
  }

  function getSuggestionKeys() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const hour = new Date().getHours();

    if (currentPlaceId()) return ["chat_suggestion_lugar_1", "chat_suggestion_lugar_2", "chat_suggestion_lugar_3"];
    if (path === "mapa.html") return ["chat_suggestion_mapa_1", "chat_suggestion_mapa_2", "chat_suggestion_3"];
    if (path === "planificar.html") return ["chat_suggestion_planificar_1", "chat_suggestion_planificar_2"];
    if (path === "gastronomia.html") return ["chat_suggestion_gastro_1", "chat_suggestion_gastro_2", "chat_suggestion_1"];
    if (hour >= 13 && hour < 16) return ["chat_suggestion_lunch_1", "chat_suggestion_lunch_2", "chat_suggestion_3", "chat_suggestion_4"];
    if (hour >= 20 || hour < 6) return ["chat_suggestion_evening_1", "chat_suggestion_evening_2", "chat_suggestion_3"];
    return ["chat_suggestion_1", "chat_suggestion_2", "chat_suggestion_3", "chat_suggestion_4"];
  }

  /* ---------- límite de uso diario (control de costes) ---------- */

  function checkAndConsumeDailyLimit() {
    const key = "cordoba-chat-usage";
    const today = new Date().toISOString().slice(0, 10);
    let usage;
    try {
      usage = JSON.parse(localStorage.getItem(key)) || {};
    } catch {
      usage = {};
    }
    if (usage.date !== today) usage = { date: today, count: 0 };
    if (usage.count >= DAILY_MESSAGE_LIMIT) return false;
    usage.count += 1;
    localStorage.setItem(key, JSON.stringify(usage));
    return true;
  }

  /* ---------- abrir / cerrar ---------- */

  function openChat() {
    const widgetNow = document.getElementById("chat-widget");
    widgetNow.classList.add("open");
    widgetNow.setAttribute("aria-hidden", "false");
    document.body.classList.add("chat-open");
    renderSuggestions();
    setTimeout(() => document.getElementById("chat-input").focus(), 50);
  }

  function closeChat() {
    const widgetNow = document.getElementById("chat-widget");
    widgetNow.classList.remove("open");
    widgetNow.setAttribute("aria-hidden", "true");
    document.body.classList.remove("chat-open");
  }

  function renderSuggestions() {
    const suggestionsNow = document.getElementById("chat-suggestions");
    if (history.length > 0) {
      suggestionsNow.innerHTML = "";
      return;
    }
    suggestionsNow.innerHTML = getSuggestionKeys()
      .map((key) => `<button type="button" class="chat-chip" data-key="${key}">${t(key)}</button>`)
      .join("");

    suggestionsNow.querySelectorAll(".chat-chip").forEach((chip) => {
      chip.addEventListener("click", () => sendMessage(chip.textContent));
    });
  }

  function scrollToBottom() {
    const messagesNow = document.getElementById("chat-messages");
    messagesNow.scrollTop = messagesNow.scrollHeight;
  }

  function addMessage(role, text) {
    const messagesNow = document.getElementById("chat-messages");
    const bubble = document.createElement("div");
    bubble.className = `chat-msg chat-msg-${role}`;
    if (role === "assistant") {
      bubble.innerHTML = `<span class="chat-msg-avatar">${Icon("bot")}</span><span class="chat-msg-text"></span>`;
      bubble.querySelector(".chat-msg-text").textContent = text;
    } else {
      bubble.textContent = text;
    }
    messagesNow.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function showTyping() {
    const messagesNow = document.getElementById("chat-messages");
    const typing = document.createElement("div");
    typing.className = "chat-msg chat-msg-assistant chat-typing";
    typing.id = "chat-typing-indicator";
    typing.innerHTML = `<span class="chat-msg-avatar">${Icon("bot")}</span><span class="chat-dots"><span></span><span></span><span></span></span>`;
    messagesNow.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.getElementById("chat-typing-indicator");
    if (typing) typing.remove();
  }

  /* ---------- marcadores PLACES: / ITINERARY: ---------- */

  function displayableText(fullText) {
    const idx = fullText.search(/\n(?:PLACES|ITINERARY):/);
    return idx === -1 ? fullText : fullText.slice(0, idx);
  }

  function extractMarkerIds(fullText, label) {
    const re = new RegExp(`${label}:\\s*([^\\n]+)`);
    const m = fullText.match(re);
    if (!m) return [];
    return m[1]
      .split(",")
      .map((s) => s.trim())
      .filter((id) => typeof PLACES !== "undefined" && PLACES.some((p) => p.id === id));
  }

  function placeCardsHtml(ids) {
    if (!ids.length || typeof PLACES === "undefined") return "";
    const cards = ids
      .map((id) => {
        const place = PLACES.find((p) => p.id === id);
        if (!place) return "";
        const name = tr(place, "places", "nombre");
        const media = place.imagen
          ? `<img src="${place.imagen}" alt="${name}" loading="lazy" />`
          : `<span class="chat-place-card-fallback">${Icon(place.icono)}</span>`;
        return `<a class="chat-place-card" href="/lugares/${place.slug || place.id}.html">${media}<span>${name}</span></a>`;
      })
      .join("");
    let html = `<div class="chat-place-cards">${cards}</div>`;
    if (ids.length > 1) {
      const mapHref = `/mapa.html?focus=${ids.join(",")}`;
      html += `<a class="chat-inline-btn" href="${mapHref}">${Icon("map")} ${t("chat_view_on_map")}</a>`;
    }
    return html;
  }

  function buildPlannerUrl(ids) {
    if (!ids.length) return null;
    const compact = {
      p: { days: "1", companions: "pareja", interests: ["historia"], pace: "tranquilo", date: "" },
      d: [ids.map((id) => ["places", "mañana", id])],
    };
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
      return `/planificar.html#i=${encoded}`;
    } catch {
      return null;
    }
  }

  function finalizeAssistantBubble(bubble, fullText) {
    const clean = displayableText(fullText).trim();
    bubble.querySelector(".chat-msg-text").textContent = clean;

    const placeIds = extractMarkerIds(fullText, "PLACES");
    const itineraryIds = extractMarkerIds(fullText, "ITINERARY");

    let extraHtml = placeCardsHtml(placeIds);
    const plannerUrl = buildPlannerUrl(itineraryIds);
    if (itineraryIds.length && plannerUrl) {
      extraHtml += `<a class="chat-inline-btn chat-inline-btn-primary" href="${plannerUrl}">${Icon("route")} ${t(
        "chat_open_planner"
      )}</a>`;
    }
    if (extraHtml) {
      const extra = document.createElement("div");
      extra.className = "chat-msg-extra";
      extra.innerHTML = extraHtml;
      bubble.appendChild(extra);
    }
    return clean;
  }

  /* ---------- envío con streaming ---------- */

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || requesting) return;

    if (!checkAndConsumeDailyLimit()) {
      addMessage("user", trimmed);
      addMessage("assistant", t("chat_rate_limit"));
      return;
    }

    requesting = true;
    document.getElementById("chat-suggestions").innerHTML = "";
    addMessage("user", trimmed);
    history.push({ role: "user", content: trimmed });
    input.value = "";
    showTyping();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort("timeout"), 25000);
    let assistantBubble = null;
    let fullText = "";

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          lang: Lang.get(),
          history: history.slice(-8, -1),
          context: getPageContext(),
          location: sharedLocation,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop();

        for (const chunk of chunks) {
          const dataLine = chunk.split("\n").find((line) => line.startsWith("data:"));
          if (!dataLine) continue;
          let payload;
          try {
            payload = JSON.parse(dataLine.slice(5).trim());
          } catch {
            continue;
          }
          if (payload.type === "content_block_delta" && payload.delta && payload.delta.type === "text_delta") {
            if (!assistantBubble) {
              hideTyping();
              assistantBubble = addMessage("assistant", "");
            }
            fullText += payload.delta.text;
            assistantBubble.querySelector(".chat-msg-text").textContent = displayableText(fullText);
            scrollToBottom();
          }
        }
      }

      hideTyping();
      if (!assistantBubble || !fullText) throw new Error("empty response");

      const cleanText = finalizeAssistantBubble(assistantBubble, fullText);
      history.push({ role: "assistant", content: cleanText });
      scrollToBottom();
    } catch (err) {
      hideTyping();
      const message = err === "timeout" || err?.name === "AbortError" ? t("chat_timeout") : t("chat_error");
      addMessage("assistant", message);
    } finally {
      clearTimeout(timeout);
      requesting = false;
    }
  }

  /* ---------- ubicación compartida ---------- */

  if (locationBtn) {
    locationBtn.addEventListener("click", () => {
      if (sharedLocation) {
        sharedLocation = null;
        locationBtn.classList.remove("active");
        showToast(t("chat_location_off"));
        return;
      }
      if (!navigator.geolocation) {
        showToast(t("map_locate_unsupported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sharedLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          locationBtn.classList.add("active");
          showToast(t("chat_location_on"));
        },
        () => showToast(t("map_locate_denied")),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  /* ---------- listeners ---------- */

  launchers.forEach((launcher) => {
    launcher.addEventListener("click", openChat);
    launcher.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openChat();
      }
    });
  });

  closeBtn.addEventListener("click", closeChat);
  backdrop.addEventListener("click", closeChat);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("chat-widget").classList.contains("open")) closeChat();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(document.getElementById("chat-input").value);
  });

  document.addEventListener("lang-changed", renderSuggestions);

  const params = new URLSearchParams(window.location.search);
  const askParam = params.get("ask");
  if (askParam) {
    openChat();
    sendMessage(askParam);
    const url = new URL(window.location.href);
    url.searchParams.delete("ask");
    window.history.replaceState({}, "", url);
  } else if (params.get("chat")) {
    openChat();
    const url = new URL(window.location.href);
    url.searchParams.delete("chat");
    window.history.replaceState({}, "", url);
  }
});
