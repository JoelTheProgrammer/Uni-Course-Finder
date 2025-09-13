async function loadCourse() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  // fetch courses.json
  const res = await fetch("data/courses.json");
  const courses = await res.json();
  const course = courses.find(c => c.id === id);
  if (!course) return;

  const lang = localStorage.getItem("lang") || "en";

  const titleEl = document.getElementById("programTitle");
  const badgesEl = document.getElementById("programBadges");
  const descEl = document.getElementById("programDesc");
  const reqsEl = document.getElementById("programReqs");
  const infoLink = document.getElementById("infoLink");
  const applyLink = document.getElementById("applyLink");

  // title
  titleEl.textContent = course.name;

  // badges
  const badges = [];
  if (course.tuition) badges.push(`<span class="chip">€${course.tuition}</span>`);
  if (course.degree) badges.push(`<span class="chip">${I18N.t(`degrees.${course.degree}`, course.degree)}</span>`);
  if (course.field) badges.push(`<span class="chip">${I18N.t(`fields.${course.field}`, course.field)}</span>`);
  badgesEl.innerHTML = badges.join("");

  // description
  descEl.innerText = lang === "sr" ? course.sr_desc : course.en_desc;

  // requirements
  reqsEl.innerHTML = "";
  if (lang === "sr" && course.sr_req) {
    reqsEl.innerHTML = `<li>${course.sr_req}</li>`;
  } else if (lang === "en" && course.en_req) {
    reqsEl.innerHTML = `<li>${course.en_req}</li>`;
  } else {
    reqsEl.innerHTML = `<li data-i18n="detail.noReqs">${I18N.t("detail.noReqs","No specific requirements listed.")}</li>`;
  }

  // links
  if (course.info_link) infoLink.href = course.info_link;
  else infoLink.style.display = "none";

  if (course.apply_link) applyLink.href = course.apply_link;
  else applyLink.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  // load saved language first
  const lang = localStorage.getItem("lang") || "en";
  if (typeof I18N?.load === "function") {
    await I18N.load(lang);
  }
  loadCourse();

  // language switcher
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const lang = btn.dataset.lang;
      localStorage.setItem("lang", lang);
      if (typeof I18N?.load === "function") {
        await I18N.load(lang);
      }
      loadCourse(); // reload content in the new language
    });
  });
});
