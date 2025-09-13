// js/results.js
let filtered = []; // make this global so we can re-render later

document.addEventListener("DOMContentLoaded", async () => {
  // Load language first so UI strings render correctly.
  const lang = localStorage.getItem("lang") || "en";
  if (typeof I18N?.load === "function") {
    await I18N.load(lang);
  }

  // Read filters from the query string.
  const params = new URLSearchParams(location.search);
  const chosen = {
    field: params.get("field") || "",
    degree: params.get("degree") || "",
    budget: Number(params.get("budget") ?? Number.MAX_SAFE_INTEGER)
  };

  // Show applied filters as chips.
  const applied = document.getElementById("applied");
  const chips = [];
  if (chosen.field) chips.push(`<span class="chip">${I18N.t(`fields.${chosen.field}`, chosen.field)}</span>`);
  if (chosen.degree) chips.push(`<span class="chip">${I18N.t(`degrees.${chosen.degree}`, chosen.degree)}</span>`);
  if (isFinite(chosen.budget)) chips.push(`<span class="chip">≤ €${chosen.budget.toLocaleString()}</span>`);
  applied.innerHTML = chips.join("");

  // Load courses and filter.
  let all = [];
  try {
    const res = await fetch("data/courses.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    all = await res.json();
  } catch (err) {
    console.error("Failed to load courses.json:", err);
    renderError(I18N.t("results.empty", "No programs match your preferences. Try a higher budget or broader field."));
    return;
  }

  filtered = all
    .filter(c =>
      (!chosen.field || c.field === chosen.field) &&
      (!chosen.degree || c.degree === chosen.degree) &&
      (!isFinite(chosen.budget) || c.tuition <= chosen.budget)
    )
    .sort((a, b) => a.tuition - b.tuition); // cheapest first

  renderResults(filtered);
});

// language switcher
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const lang = btn.dataset.lang;
    localStorage.setItem("lang", lang);
    if (typeof I18N?.load === "function") {
      await I18N.load(lang);
    }
    renderResults(filtered); // redraw cards with new desc
  });
});

function renderResults(items) {
  const wrap = document.getElementById("results");
  if (!items.length) {
    wrap.innerHTML = `<p class="sub" style="margin:8px 0 0">${I18N.t(
      "results.empty",
      "No programs match your preferences. Try a higher budget or broader field."
    )}</p>`;
    return;
  }
  wrap.innerHTML = items.map(cardHTML).join("");
}

function renderError(message) {
  const wrap = document.getElementById("results");
  wrap.innerHTML = `<p class="sub" style="margin:8px 0 0">${message}</p>`;
}

function cardHTML(c) {
  const tuition = `€${Number(c.tuition).toLocaleString()}`;
  const desc = (localStorage.getItem("lang") || "en") === "sr" ? c.sr_desc : c.en_desc;

  return `
    <article class="course">
      <div class="course-head">
        <h2 class="course-title">${c.name}</h2>
        <div class="course-badges">
          <span class="chip">${I18N.t(`fields.${c.field}`, c.field)}</span>
          <span class="chip">${I18N.t(`degrees.${c.degree}`, c.degree)}</span>
        </div>
      </div>
      <ul class="course-meta">
        <li><strong data-i18n="results.location">${I18N.t("results.location", "Location")}</strong>: ${c.location}</li>
        <li><strong data-i18n="results.tuition">${I18N.t("results.tuition", "Tuition")}</strong>: ${tuition}</li>
        <li><strong data-i18n="results.language">${I18N.t("results.language", "Language")}</strong>: ${String(c.language || "").toUpperCase()}</li>
      </ul>
      <p class="course-desc">${desc || ""}</p>
      <div class="actions" style="margin-top:12px">
        <a href="detail.html?id=${c.id}" class="cta-link" data-i18n="results.more">View details</a>
      </div>
    </article>
  `;
}
