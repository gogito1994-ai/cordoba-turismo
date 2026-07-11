document.addEventListener("DOMContentLoaded", () => {
  setupStaticIcons();
  setupNav();
  setupHeaderScroll();
  setupBackToTop();
  setupLightbox();
  setupFavorites();
  setupRipple();
  setupReveal();
  setupFooterYear();
  setupHeroSearch();
});

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
      .querySelectorAll(".card, .route-card, .home-link-card")
      .forEach((el) => {
        if (!el.classList.contains("reveal") && !el.classList.contains("in-view")) {
          el.classList.add("reveal");
          observer.observe(el);
        }
      });
  }

  observeAll();
  const mo = new MutationObserver(() => observeAll());
  mo.observe(document.body, { childList: true, subtree: true });
}

function setupHeroSearch() {
  const form = document.getElementById("hero-search-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("hero-search-input");
    const q = encodeURIComponent(input.value.trim());
    window.location.href = q ? `buscar.html?q=${q}` : "buscar.html";
  });
}
