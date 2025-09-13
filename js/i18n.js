// Simple attribute-based i18n.
// Use data-i18n for textContent and data-i18n-placeholder for placeholders.
const I18N = (() => {
  const state = { lang: localStorage.getItem("lang") || "en", dict: {} };

  async function load(lang) {
    try {
        const res = await fetch(`data/texts.${lang}.json`);
        if (!res.ok) throw new Error(res.statusText);
        state.dict = await res.json();
        state.lang = lang;
        localStorage.setItem("lang", lang);
        apply();
        markActive(lang);
    } catch (err) {
        console.error("i18n load failed", err);
        if (lang !== "en") return load("en"); // fallback to English
    }
  }



  function t(path, fallback = "") {
    return path.split(".").reduce((acc, key) => acc?.[key], state.dict) ?? fallback;
  }

  function apply() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"), el.textContent);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"), el.placeholder);
    });
    document.documentElement.lang = state.lang;
  }

  function markActive(lang) {
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  }

  function init() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => load(btn.dataset.lang));
    });
    load(state.lang);
  }

  return { init, t, load };
})();

document.addEventListener("DOMContentLoaded", I18N.init);
