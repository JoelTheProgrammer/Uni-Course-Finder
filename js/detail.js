// js/detail.js
const API_BASE = "http://localhost:3000"; // backend base URL

async function loadCourse() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const goals = params.get("goals") || "";
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
    const fitEl = document.getElementById("programFit");
    const fitHeading = document.querySelector('[data-i18n="detail.fit"]');

    // title
    const title = lang === "sr" ? course.sr_title : course.en_title;
    titleEl.textContent = title;

    // badges
    const badges = [];
    if (course.tuition) badges.push(`<span class="chip">€${course.tuition}</span>`);
    if (course.degree) badges.push(`<span class="chip">${I18N.t("degrees." + course.degree, course.degree)}</span>`);
    if (course.field) badges.push(`<span class="chip field-${course.field}">${I18N.t("fields." + course.field, course.field)}</span>`);
    badgesEl.innerHTML = badges.join("");

    // description
    const desc = lang === "sr" ? course.sr_desc : course.en_desc;
    descEl.innerText = desc;

    // requirements
    reqsEl.innerHTML = "";
    const reqs = lang === "sr" ? course.sr_req : course.en_req;

    if (Array.isArray(reqs) && reqs.length > 0) {
        reqsEl.innerHTML = reqs.map(r => `<li>${r}</li>`).join("");
    } else if (typeof reqs === "string" && reqs.trim()) {
        // fallback if some entries are still plain strings
        reqsEl.innerHTML = `<li>${reqs}</li>`;
    } else {
        reqsEl.innerHTML = `<li data-i18n="detail.noReqs">${I18N.t("detail.noReqs", "No specific requirements listed.")}</li>`;
    }

    const jobsEl = document.getElementById("programJobs");

    // jobs
    jobsEl.innerHTML = "";
    const jobs = lang === "sr" ? course.sr_jobs : course.en_jobs;

    if (Array.isArray(jobs) && jobs.length > 0) {
        jobsEl.innerHTML = jobs.map(j => `<li>${j}</li>`).join("");
    } else if (typeof jobs === "string" && jobs.trim()) {
        jobsEl.innerHTML = `<li>${jobs}</li>`;
    } else {
        jobsEl.innerHTML = `<li data-i18n="detail.noJobs">${I18N.t("detail.noJobs", "No jobs listed.")}</li>`;
    }

    // links
    if (course.info_link) infoLink.href = course.info_link;
    else infoLink.style.display = "none";

    if (course.apply_link) applyLink.href = course.apply_link;
    else applyLink.style.display = "none";

    // fit explanation (only if goals provided)
    if (goals && fitEl) {
        fitEl.textContent = I18N.t("detail.loading_fit", "Generating a personalized explanation...");
        try {
            const lang = localStorage.getItem("lang") || "en";

            const resp = await fetch(`${API_BASE}/explain`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentInput: goals,
                    courseDescription: desc,
                    lang: lang
                })
            });

            const data = await resp.json();
            fitEl.textContent = data.explanation || I18N.t("detail.fit_fallback", "We could not generate an explanation right now.");
        } catch (e) {
            console.error(e);
            fitEl.textContent = I18N.t("detail.fit_error", "Could not load explanation.");
        }
        if (fitHeading) fitHeading.style.display = "";
    } else {
        // hide the section if no goals were passed
        if (fitHeading) fitHeading.style.display = "none";
        if (fitEl) fitEl.style.display = "none";
    }
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
            loadCourse(); // reload content and refetch explanation
        });
    });
});
