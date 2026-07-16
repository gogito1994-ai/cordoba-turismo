document.addEventListener("DOMContentLoaded", () => {
  const APT_KEY = "cordoba-apt";
  const params = new URLSearchParams(window.location.search);
  const aptParam = params.get("apt");

  if (aptParam) {
    localStorage.setItem(APT_KEY, aptParam);
    trackEvent("qr_scan", { apt: aptParam });
  }

  const apt = aptParam || localStorage.getItem(APT_KEY);

  const whatsappCard = document.getElementById("welcome-whatsapp-card");
  if (!whatsappCard) return;

  function updateWhatsappLink() {
    const message = apt
      ? t("welcome_whatsapp_message", { apt })
      : t("welcome_whatsapp_message_generic");
    const number = (typeof CORDOBAPP_CONFIG !== "undefined" && CORDOBAPP_CONFIG.WHATSAPP_GESTORA) || "";
    whatsappCard.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  updateWhatsappLink();
  document.addEventListener("lang-changed", updateWhatsappLink);
});
