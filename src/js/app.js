(() => {
  "use strict";

  const CONFIG = {
    version: "v2.2",
    links: [
      { key: "apply_job",   url: "https://forms.gle/hCTbFxT2b1V8CE2i7", info: "Apply to join REHAF.", icon: "📄" },
      { key: "hire_req",    url: "https://forms.gle/ut62zpkXB2kXNLqb6", info: "Request hiring for your business.", icon: "🧑‍💼" },
      { key: "consult_req", url: "https://forms.gle/ZfVrurQazxT8z7xL7", info: "Consultant/Other service request.", icon: "📝" },
      { key: "auto_soon",   url: "", info: "Automation Service — Coming Soon.", icon: "⚙️", soon: true },
      { key: "setup_guide", url: "/setup-business", info: "Start your business step-by-step.", icon: "🏢" }
    ],
    vacancies: { items: [] },
    i18n: {
      en: {
        welcome: "Hi there! I’m REHAF. I’m here to make your projects simple and your business happy.",
        consent: [
          "Please choose the right option, or your request will not proceed.",
          "By continuing, you agree that your request may be processed automatically and securely stored for service quality purposes."
        ],
        vacTitle: "Vacancies open for today",
        vacEmpty: "No vacancies available at the moment.",
        links: {
          apply_job:   { label: "Apply for a Job - seeking a job" },
          hire_req:    { label: "For Business Owners - Hiring Service Request" },
          consult_req: { label: "Other Service Request (Consultant Service)" },
          auto_soon:   { label: "Automation Service (Soon)" },
          setup_guide: { label: "Company Setup Guide (Abu Dhabi)" }
        }
      },
      ar: {
        welcome: "مرحباً! أنا رهف. أنا هنا لمساعدتك على ان تجعل مشاريعك سهلة و عملك ينموا بسعادة.",
        consent: [
          "يُرجى اختيار الخيار الصحيح، وإلا فلن تتم معالجة طلبك.",
          "بالمتابعة، فإنك توافق على أن تتم معالجة طلبك تلقائيًا وتخزينه بأمان لضمان جودة الخدمة."
        ],
        vacTitle: "الوظائف المتاحة اليوم",
        vacEmpty: "لا توجد وظائف متاحة حالياً.",
        links: {
          apply_job:   { label: "التقدم لوظيفة" },
          hire_req:    { label: "طلب خدمة اصحاب المشاريع  التوظيف" },
          consult_req: { label: "طلب خدمة أخرى (استشارات)" },
          auto_soon:   { label: "خدمة الأتمتة (قريبًا)" },
          setup_guide: { label: "دليل تأسيس شركة (أبوظبي)" }
        }
      }
    }
  };

  const $ = (s) => document.querySelector(s);
  const state = { lang: localStorage.getItem("rehaf_lang") || "en" };
  const DUBAI_TZ = "Asia/Dubai";

  // Set initial dir ASAP
  document.documentElement.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");

  function todayFormatted(lang) {
    const now = new Date();
    const opts = { day: "2-digit", month: "2-digit", year: "numeric", timeZone: DUBAI_TZ };
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", opts).format(now);
  }

  async function loadVacancies() {
    try {
      const res = await fetch("/vacancies.json?v=" + Date.now());
      if (!res.ok) throw new Error("vacancies.json not ok");
      const data = await res.json();
      CONFIG.vacancies.items = Array.isArray(data.items) ? data.items : [];
    } catch {
      CONFIG.vacancies.items = [];
    }
  }

  function t(path) {
    const parts = path.split(".");
    let curr = CONFIG.i18n[state.lang];
    for (const k of parts) {
      if (!curr) break;
      curr = curr[k];
    }
    return curr || path;
  }

  function render() {
    document.documentElement.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");

    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const welcomeEl = $("#welcomeText");
    if (welcomeEl) welcomeEl.textContent = t("welcome");

    // Consent block
    const consentHost = document.getElementById("consentText");
    if (consentHost) {
      const consentLines = CONFIG.i18n[state.lang].consent || [];
      consentHost.innerHTML =
        `<ul class="list-disc list-inside ${state.lang === "ar" ? "pr-5" : "pl-5"} m-0">
          ${consentLines.map(line => `<li class="text-start">${line}</li>`).join("")}
        </ul>`;
    }

    // Links
    const wrap = $("#links");
    if (wrap) {
      wrap.innerHTML = "";
      CONFIG.links.forEach((l) => {
        const a = document.createElement("a");
        a.href = l.url || "#";
        a.target = l.url && l.url.startsWith("http") ? "_blank" : "";
        a.className = "btn rounded-2xl p-4 block transition";

        const label = t(`links.${l.key}.label`);
        const soonBadge = l.soon ? `<span class="badge ml-2">${state.lang === "ar" ? "قريبًا" : "Soon"}</span>` : "";

        a.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl grid place-items-center text-xl bg-white/10">${l.icon || "🔗"}</div>
            <div class="flex-1">
              <div class="font-semibold text-xl">${label} ${soonBadge}</div>
              <div class="text-base opacity-90">${l.info || ""}</div>
            </div>
          </div>`;

        if (l.soon) {
          a.classList.add("disabled");
          a.removeAttribute("href");
        }
        wrap.appendChild(a);
      });
    }

    // Vacancies
    const vacTitleEl = $("#vacTitle");
    if (vacTitleEl) vacTitleEl.textContent = t("vacTitle");

    const todayDateEl = $("#todayDate");
    if (todayDateEl) todayDateEl.textContent = todayFormatted(state.lang);

    const list = $("#vacList");
    const empty = $("#vacEmpty");

    if (list) list.innerHTML = "";

    if (CONFIG.vacancies.items?.length) {
      if (empty) empty.textContent = "";
      CONFIG.vacancies.items.forEach((v) => {
        const title = state.lang === "ar" ? (v.title_ar || v.title_en) : (v.title_en || v.title_ar);
        const meta  = state.lang === "ar" ? (v.meta_ar  || "")       : (v.meta_en  || "");

        if (list) {
          list.insertAdjacentHTML("beforeend", `
            <li><div class="flex items-center gap-2">
              <span class="opacity-80">-</span>
              <span class="text-base">${title ?? ""}</span>
              <span class="text-sm opacity-70 ml-auto">${meta ?? ""}</span>
            </div></li>`);
        }
      });
    } else {
      if (empty) empty.textContent = t("vacEmpty");
    }
  }

  // Init
  loadVacancies().then(render);

  const langBtn = $("#langToggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      state.lang = (state.lang === "en") ? "ar" : "en";
      localStorage.setItem("rehaf_lang", state.lang);
      render();
      window.rehafFaqRender?.(); // refresh FAQ if open
    });
  }
})();