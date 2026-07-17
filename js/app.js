function trackEvent(name, props) {
  if (typeof window.umami === "object" && typeof window.umami.track === "function") {
    window.umami.track(name, props);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupStaticIcons();
  setupThemeToggle();
  setupNav();
  setupBottomNav();
  setupHeaderScroll();
  setupBackToTop();
  setupLightbox();
  setupFavorites();
  setupRipple();
  setupReveal();
  setupFooterYear();
  setupSeasonalTheme();
  setupHeroSlideshow();
  setupMonthHighlight();
  setupHomeWeather();
  setupServiceWorker();
  setupInstallBanner();
  setupGuestNav();
  setupWhatsAppFloat();
  setupCityPass();
});

/* "Mi estancia" en el menú y botón flotante de WhatsApp: solo para huéspedes
   (con apartamento guardado en localStorage vía bienvenida.html?apt=XX),
   para no molestar a los visitantes orgánicos. */

function guestApt() {
  return localStorage.getItem("cordoba-apt");
}

function sitePrefix() {
  return location.pathname.includes("/lugares/") ? "../" : "";
}

function setupGuestNav() {
  if (!guestApt()) return;
  const navList = document.querySelector(".nav-links");
  if (!navList || navList.querySelector('[data-page="estancia"]')) return;
  const li = document.createElement("li");
  li.innerHTML = `<a href="${sitePrefix()}estancia.html" data-page="estancia" data-i18n="nav_estancia">${t("nav_estancia")}</a>`;
  navList.appendChild(li);
  const current = document.body.dataset.page;
  if (current === "estancia") li.querySelector("a").classList.add("active");
}

function setupWhatsAppFloat() {
  const apt = guestApt();
  if (!apt) return;
  if (document.body.dataset.page === "bienvenida") return;

  const number = (typeof CORDOBAPP_CONFIG !== "undefined" && CORDOBAPP_CONFIG.WHATSAPP_GESTORA) || "";
  const btn = document.createElement("a");
  btn.className = "whatsapp-float";
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.setAttribute("aria-label", t("whatsapp_float_label"));

  function updateHref() {
    const message = t("welcome_whatsapp_message", { apt });
    btn.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    btn.title = t("whatsapp_float_label");
    btn.setAttribute("aria-label", t("whatsapp_float_label"));
  }

  btn.innerHTML = Icon("chat");
  updateHref();
  btn.addEventListener("click", () => {
    trackEvent("whatsapp_click", { apt, pagina: document.body.dataset.page || location.pathname });
  });
  document.body.appendChild(btn);
  document.addEventListener("lang-changed", updateHref);
}

/* Preventa del Córdoba Pass: la sección solo aparece cuando el endpoint de
   Formspree está configurado en js/config.js (sin el placeholder TU_FORM_ID). */

function setupCityPass() {
  const slot = document.getElementById("citypass-slot");
  if (!slot) return;
  const endpoint = (typeof CORDOBAPP_CONFIG !== "undefined" && CORDOBAPP_CONFIG.FORMSPREE_ENDPOINT) || "";
  if (!endpoint || endpoint.includes("TU_FORM_ID")) {
    slot.hidden = true;
    return;
  }
  slot.hidden = false;

  function render() {
    slot.innerHTML = `
      <div class="citypass-banner">
        <h3>${t("citypass_title")}</h3>
        <p>${t("citypass_desc")}</p>
        <form class="citypass-form" novalidate>
          <input type="email" required placeholder="${t("citypass_placeholder")}" aria-label="${t("citypass_placeholder")}" />
          <button type="submit" class="btn btn-primary">${t("citypass_button")}</button>
        </form>
      </div>`;
    slot.querySelector(".citypass-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = slot.querySelector("input[type=email]");
      const email = input.value.trim();
      if (!email || !input.checkValidity()) return;
      fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ email, origen: "citypass" }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("send failed");
          showToast(t("citypass_done"));
          trackEvent("citypass_interes", {});
          input.value = "";
        })
        .catch(() => showToast(t("citypass_error")));
    });
  }

  render();
  document.addEventListener("lang-changed", render);
}

function setupHomeWeather() {
  const widget = document.getElementById("home-weather");
  const tipBanner = document.getElementById("home-tip");
  const tipTextEl = document.getElementById("home-tip-text");
  if (!widget && !tipBanner) return;

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

  let lastTemp = null;

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
    if (!tipBanner) return;
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
    } else if (lastTemp !== null && lastTemp >= 32 && hour >= 13 && hour < 18) {
      tipKey = "ahora_tip_heat";
    } else if (hour < 9 || hour >= 21) {
      tipKey = "ahora_tip_closed_hours";
    }

    if (tipTextEl) tipTextEl.textContent = t(tipKey);
    tipBanner.hidden = false;
  }

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${CORDOBA_LAT}&longitude=${CORDOBA_LNG}&current=temperature_2m,weather_code&timezone=Europe%2FMadrid`
  )
    .then((res) => res.json())
    .then((data) => {
      const current = data && data.current;
      if (!current) throw new Error("sin datos");
      lastTemp = current.temperature_2m;
      if (widget) {
        widget.querySelector(".home-weather-icon").textContent = WEATHER_ICON[current.weather_code] || "🌡";
        widget.querySelector(".home-weather-temp").textContent = `${Math.round(current.temperature_2m)}°C`;
        widget.hidden = false;
      }
      renderTip();
    })
    .catch(() => {
      renderTip();
    });

  document.addEventListener("lang-changed", renderTip);
}

function setupSeasonalTheme() {
  const hero = document.querySelector(".hero");
  const slot = document.getElementById("season-banner-slot");
  if (!hero || !slot || typeof getCurrentSeason !== "function") return;

  const season = getCurrentSeason(new Date());
  if (!season) return;

  document.documentElement.dataset.season = season.id;

  const slideshow = document.getElementById("hero-slideshow");
  if (slideshow) {
    slideshow.querySelectorAll(".hero-bg-slide").forEach((s) => s.classList.remove("active"));
    const seasonSlide = document.createElement("div");
    seasonSlide.className = "hero-bg-slide active";
    seasonSlide.style.backgroundImage = `url('${season.heroImage}')`;
    slideshow.insertBefore(seasonSlide, slideshow.firstChild);
  }

  slot.innerHTML = `
    <div class="season-banner">
      <span class="season-banner-icon">${Icon("star")}</span>
      <span class="season-banner-text" data-i18n="${season.bannerKey}"></span>
      <a class="season-banner-cta" href="${season.ctaHref}" data-i18n="season_cta"></a>
    </div>
  `;
  applyStaticI18n();
}

function setupMonthHighlight() {
  const container = document.getElementById("events-this-month");
  if (!container || typeof renderThisMonthBlock !== "function") return;
  renderThisMonthBlock(container, { compact: true });
  document.addEventListener("lang-changed", () => renderThisMonthBlock(container, { compact: true }));
}

function setupServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

function setupInstallBanner() {
  let deferredPrompt = null;
  const dismissed = localStorage.getItem("cordoba-install-dismissed");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (dismissed) return;
    showInstallBanner();
  });

  function showInstallBanner() {
    if (document.querySelector(".install-banner")) return;
    const banner = document.createElement("div");
    banner.className = "install-banner";
    banner.innerHTML = `
      <span class="install-banner-icon">${Icon("landmark")}</span>
      <div class="install-banner-text">
        <strong>${t("install_banner_title")}</strong>
        <p>${t("install_banner_desc")}</p>
      </div>
      <button class="btn btn-primary install-banner-btn" type="button">${t("install_banner_cta")}</button>
      <button class="install-banner-close" type="button" aria-label="${t("aria_close")}">${Icon("x")}</button>
    `;
    document.body.appendChild(banner);
    void banner.offsetWidth;
    banner.classList.add("show");

    banner.querySelector(".install-banner-btn").addEventListener("click", () => {
      banner.remove();
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => {
        deferredPrompt = null;
      });
    });
    banner.querySelector(".install-banner-close").addEventListener("click", () => {
      localStorage.setItem("cordoba-install-dismissed", "1");
      banner.remove();
    });
  }
}

function setupBottomNav() {
  if (document.querySelector(".bottom-nav")) return;
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "Navegación principal");
  nav.innerHTML = `
    <a href="index.html" data-page="home" class="bottom-nav-item"><span data-icon="home"></span><span data-i18n="nav_home">Inicio</span></a>
    <a href="mapa.html" data-page="mapa" class="bottom-nav-item"><span data-icon="map"></span><span data-i18n="nav_map">Mapa</span></a>
    <a href="planificar.html" data-page="planificar" class="bottom-nav-item"><span data-icon="route"></span><span data-i18n="nav_planner">Planificar</span></a>
    <a href="index.html?chat=1" class="bottom-nav-item"><span data-icon="chat"></span><span data-i18n="nav_assistant">Asistente</span></a>
  `;
  document.body.appendChild(nav);
  nav.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = Icon(el.dataset.icon);
  });
  nav.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  const current = document.body.dataset.page;
  nav.querySelectorAll(".bottom-nav-item[data-page]").forEach((a) => {
    if (a.dataset.page === current) a.classList.add("active");
  });

  document.addEventListener("lang-changed", () => {
    nav.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
  });
}

function setupThemeToggle() {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    btn.innerHTML = Icon(theme === "dark" ? "sun" : "moon");
  }

  const stored = localStorage.getItem("cordoba-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = stored || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  btn.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("cordoba-theme", theme);
    applyTheme(theme);
  });
}

function setupStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = Icon(el.dataset.icon);
  });
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  const current = document.body.dataset.page;
  document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
    if (a.dataset.page === current) a.classList.add("active");
  });
}

function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const isHome = document.body.dataset.page === "home";

  if (!isHome) {
    header.classList.add("solid");
    return;
  }

  const update = () => header.classList.toggle("solid", window.scrollY > 60);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function setupBackToTop() {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.dataset.i18nAria = "aria_back_to_top";
  btn.setAttribute("aria-label", t("aria_back_to_top"));
  btn.innerHTML = Icon("arrow-up");
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupLightbox() {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.innerHTML = `
    <button class="lightbox-close" data-i18n-aria="aria_close" aria-label="${t("aria_close")}">${Icon("x")}</button>
    <img src="" alt="" />
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".lightbox-close");

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.classList.add("open");
  }

  function close() {
    overlay.classList.remove("open");
  }

  document.addEventListener("click", (e) => {
    const media = e.target.closest(".card-media img");
    if (media) {
      open(media.src, media.alt);
    }
  });

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setupFavorites() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".favorite-btn");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const id = btn.dataset.id;
    const name = btn.dataset.name || "";
    const isFav = Favorites.toggle(id);

    document.querySelectorAll(`.favorite-btn[data-id="${id}"]`).forEach((b) => {
      b.classList.toggle("active", isFav);
      if (isFav) {
        b.classList.remove("active");
        void b.offsetWidth;
        b.classList.add("active");
      }
    });

    showToast(t(isFav ? "toast_added" : "toast_removed", { name }));
    document.dispatchEvent(new CustomEvent("favorites-changed"));
  });
}

function setupRipple() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "btn-ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  function observeAll() {
    document
      .querySelectorAll(".card, .home-link-card")
      .forEach((el) => {
        if (!el.classList.contains("reveal") && !el.classList.contains("in-view")) {
          el.classList.add("reveal");
          const siblings = Array.from(el.parentElement.children).filter((c) =>
            c.classList.contains("card") || c.classList.contains("home-link-card")
          );
          const index = siblings.indexOf(el);
          el.style.transitionDelay = `${Math.min(index, 8) * 70}ms`;
          observer.observe(el);
        }
      });
  }

  observeAll();
  const mo = new MutationObserver(() => observeAll());
  mo.observe(document.body, { childList: true, subtree: true });
}

function setupHeroSlideshow() {
  const slides = document.querySelectorAll("#hero-slideshow .hero-bg-slide");
  if (slides.length < 2) return;

  let index = 0;
  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 6000);
}
