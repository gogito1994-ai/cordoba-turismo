/*
 * Widget de chat con IA para la guía de Córdoba.
 *
 * IMPORTANTE: sustituye WORKER_URL por la URL de tu Cloudflare Worker
 * una vez desplegado. Instrucciones completas en README-chat-ia.md.
 */
const WORKER_URL = "https://damp-water-c6b3.gogito1994.workers.dev/";

document.addEventListener("DOMContentLoaded", () => {
  const launcher = document.getElementById("chat-launcher");
  const widget = document.getElementById("chat-widget");
  if (!launcher || !widget) return;

  const backdrop = document.getElementById("chat-backdrop");
  const closeBtn = document.getElementById("chat-close");
  const messagesEl = document.getElementById("chat-messages");
  const suggestionsEl = document.getElementById("chat-suggestions");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  const SUGGESTION_KEYS = [
    "chat_suggestion_1",
    "chat_suggestion_2",
    "chat_suggestion_3",
    "chat_suggestion_4",
  ];

  let history = [];
  let requesting = false;

  function openChat() {
    widget.classList.add("open");
    widget.setAttribute("aria-hidden", "false");
    document.body.classList.add("chat-open");
    renderSuggestions();
    setTimeout(() => input.focus(), 50);
  }

  function closeChat() {
    widget.classList.remove("open");
    widget.setAttribute("aria-hidden", "true");
    document.body.classList.remove("chat-open");
  }

  function renderSuggestions() {
    if (history.length > 0) {
      suggestionsEl.innerHTML = "";
      return;
    }
    suggestionsEl.innerHTML = SUGGESTION_KEYS.map(
      (key) => `<button type="button" class="chat-chip" data-key="${key}">${t(key)}</button>`
    ).join("");

    suggestionsEl.querySelectorAll(".chat-chip").forEach((chip) => {
      chip.addEventListener("click", () => sendMessage(chip.textContent));
    });
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-msg chat-msg-${role}`;
    if (role === "assistant") {
      bubble.innerHTML = `<span class="chat-msg-avatar">${Icon("bot")}</span><span class="chat-msg-text"></span>`;
      bubble.querySelector(".chat-msg-text").textContent = text;
    } else {
      bubble.textContent = text;
    }
    messagesEl.appendChild(bubble);
    scrollToBottom();
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "chat-msg chat-msg-assistant chat-typing";
    typing.id = "chat-typing-indicator";
    typing.innerHTML = `<span class="chat-msg-avatar">${Icon("bot")}</span><span class="chat-dots"><span></span><span></span><span></span></span>`;
    messagesEl.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.getElementById("chat-typing-indicator");
    if (typing) typing.remove();
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || requesting) return;

    requesting = true;
    suggestionsEl.innerHTML = "";
    addMessage("user", trimmed);
    history.push({ role: "user", content: trimmed });
    input.value = "";
    showTyping();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort("timeout"), 20000);

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          lang: Lang.get(),
          history: history.slice(-8, -1),
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`status ${res.status}`);

      const data = await res.json();
      hideTyping();

      if (!data || typeof data.reply !== "string") throw new Error("bad payload");

      addMessage("assistant", data.reply);
      history.push({ role: "assistant", content: data.reply });
    } catch (err) {
      hideTyping();
      const message = err === "timeout" || err?.name === "AbortError" ? t("chat_timeout") : t("chat_error");
      addMessage("assistant", message);
    } finally {
      clearTimeout(timeout);
      requesting = false;
    }
  }

  launcher.addEventListener("click", openChat);
  launcher.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openChat();
    }
  });
  closeBtn.addEventListener("click", closeChat);
  backdrop.addEventListener("click", closeChat);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("open")) closeChat();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  document.addEventListener("lang-changed", renderSuggestions);

  const askParam = new URLSearchParams(window.location.search).get("ask");
  if (askParam) {
    openChat();
    sendMessage(askParam);
    const url = new URL(window.location.href);
    url.searchParams.delete("ask");
    window.history.replaceState({}, "", url);
  }
});
