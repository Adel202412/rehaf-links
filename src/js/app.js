// src/js/app.js
// REHAF v2.2 — Links + Vacancies + 2 Popups (Consult + Hiring)
// - Inline "Start Here" button for consult_req + hire_req
// - Popup language follows selected language (EN/AR)
// - "Start Here" translated
// - Phone normalization for UAE numbers
const CONFIG = {
  version: "v2.2",
  links: [
    { key: "apply_job",   url: "https://forms.gle/hCTbFxT2b1V8CE2i7", info: "Apply to join REHAF.", icon: "📄" },
    { key: "hire_req",    url: "", info: "Request hiring for your business.", icon: "🧑‍💼" }, // now popup
    { key: "consult_req", url: "", info: "Consultant/Other service request.", icon: "📝" },   // now popup
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
      startHere: "Start Here",
      links: {
        apply_job:   { label: "Apply for a Job - seeking a job" },
        hire_req:    { label: "For Business Owners - Hiring Service Request" },
        consult_req: { label: "Other Service Request (Consultant Service)" },
        auto_soon:   { label: "Automation Service (Soon)" },
        setup_guide: { label: "Company Setup Guide (Abu Dhabi)" }
      },
      // Popup: Other Service (Consult)
      modal_consult: {
        headerTitle: "Tell us briefly how we can help you",
        headerSubtitle: "This will take less than a minute. We’ll review your request and contact you personally.",
        fields: [
          { id: "full_name", type: "text",     required: true,  label: "Full name",       placeholder: "Your name" },
          { id: "phone",     type: "tel",      required: true,  label: "Phone number",    placeholder: "+971 5X XXX XXXX" },
          { id: "email",     type: "email",    required: true,  label: "Email address",   placeholder: "name@email.com" },
          { id: "location",  type: "text",     required: true,  label: "Location",        placeholder: "City, Country (e.g. Abu Dhabi, UAE)" },
          { id: "request",   type: "textarea", required: true,  label: "Brief request",   placeholder: "Tell us in a few lines what you need help with", minLen: 10, full: true }
        ],
        buttons: { submit: "Send request", cancel: "Cancel", close: "Close" },
        errors: {
          full_name: "Please enter your name",
          phone: "Please enter a valid UAE phone number",
          email: "Please enter a valid email address",
          location: "Please tell us where you’re located",
          request: "Please add a short description of your request"
        },
        statusSending: "Sending…",
        statusFail: "Something went wrong. Please try again.",
        success: { title: "Thank you.", text: "We’ve received your request and will contact you shortly." }
      },
      // Popup: Hiring Service (Business Owner)
      modal_hire: {
        headerTitle: "Tell us briefly who you want to hire",
        headerSubtitle: "This will take less than a minute. We’ll review your request and contact you personally.",
        fields: [
          { id: "full_name",     type: "text",     required: true,  label: "Your name",            placeholder: "Full name" },
          { id: "phone",         type: "tel",      required: true,  label: "Phone number",         placeholder: "+971 5X XXX XXXX" },
          { id: "email",         type: "email",    required: false, label: "Email address (optional)", placeholder: "name@email.com" },
          { id: "company_name",  type: "text",     required: true,  label: "Company / business name", placeholder: "Your company name", full: true },
          { id: "location",      type: "text",     required: true,  label: "Company location",      placeholder: "City, Country (e.g. Abu Dhabi, UAE)" },
          { id: "positions",     type: "text",     required: true,  label: "Position(s) needed",   placeholder: "e.g. Carpenter, Admin, Cashier", full: true },
          { id: "headcount",     type: "text",     required: false, label: "How many people? (optional)", placeholder: "e.g. 1, 2, 5" },
          { id: "interview_method", type: "select", required: false, label: "Interview method (optional)", full: true,
            options: [
              { v: "face", label: "Face-to-face" },
              { v: "online", label: "Online" },
              { v: "direct", label: "No interview / direct hire" }
            ]
          },
          { id: "interview_location", type: "select", required: false, label: "Preferred interview location (optional)", full: true,
            options: [
              { v: "company_office", label: "Company office" },
              { v: "project_site",   label: "Project / site location" },
              { v: "rehaf_office",   label: "REHAF office" },
              { v: "online",         label: "Online" },
              { v: "other",          label: "Other (we will confirm)" }
            ]
          },
          { id: "notes", type: "textarea", required: false, label: "Notes (optional)", placeholder: "Anything important we should know?", minLen: 0, full: true }
        ],
        buttons: { submit: "Send request", cancel: "Cancel", close: "Close" },
        errors: {
          full_name: "Please enter your name",
          phone: "Please enter a valid UAE phone number",
          email: "Please enter a valid email address",
          company_name: "Please enter your company/business name",
          location: "Please tell us where your company is located",
          positions: "Please tell us the position(s) needed"
        },
        statusSending: "Sending…",
        statusFail: "Something went wrong. Please try again.",
        success: { title: "Thank you.", text: "We’ve received your hiring request and will contact you shortly." }
      }
    },
    ar: {
      welcome: "هلا! أنا REHAF. هدفي أخلي مشروعك أبسط… وشغلك يمشي بسلاسة.",
      consent: [
        "اختَر الخيار الصحيح عشان نقدر نكمّل طلبك.",
        "بالمتابعة أنت توافق إن طلبك ممكن يُعالج بشكل آلي وبشكل آمن لتحسين جودة الخدمة."
      ],
      vacTitle: "الوظائف المتاحة اليوم",
      vacEmpty: "حالياً ما في وظائف متاحة.",
      startHere: "ابدأ من هنا",
      links: {
        apply_job:   { label: "التقديم لوظيفة" },
        hire_req:    { label: "لأصحاب الأعمال — طلب خدمة التوظيف" },
        consult_req: { label: "طلب خدمة أخرى (استشارة/خدمة)" },
        auto_soon:   { label: "خدمة الأتمتة (قريباً)" },
        setup_guide: { label: "دليل تأسيس شركة (أبوظبي)" }
      },
      modal_consult: {
        headerTitle: "خبرنا باختصار كيف نقدر نساعدك",
        headerSubtitle: "ما ياخذ أكثر من دقيقة. بنراجع طلبك ونتواصل معاك بشكل شخصي.",
        fields: [
          { id: "full_name", type: "text",     required: true,  label: "الاسم",            placeholder: "اكتب اسمك" },
          { id: "phone",     type: "tel",      required: true,  label: "رقم الهاتف",       placeholder: "+971 5X XXX XXXX" },
          { id: "email",     type: "email",    required: true,  label: "البريد الإلكتروني", placeholder: "name@email.com" },
          { id: "location",  type: "text",     required: true,  label: "الموقع",           placeholder: "المدينة، الدولة (مثال: أبوظبي، الإمارات)" },
          { id: "request",   type: "textarea", required: true,  label: "طلبك باختصار",     placeholder: "اكتب لنا كم سطر عن اللي تحتاجه", minLen: 10, full: true }
        ],
        buttons: { submit: "إرسال الطلب", cancel: "إلغاء", close: "إغلاق" },
        errors: {
          full_name: "رجاءً اكتب اسمك",
          phone: "رجاءً اكتب رقم إماراتي صحيح",
          email: "رجاءً اكتب بريد إلكتروني صحيح",
          location: "رجاءً اكتب موقعك",
          request: "رجاءً اكتب وصف مختصر لطلبك"
        },
        statusSending: "جارٍ الإرسال…",
        statusFail: "صار خطأ. جرّب مرة ثانية.",
        success: { title: "تم.", text: "استلمنا طلبك وبنتواصل معاك قريباً." }
      },
      modal_hire: {
        headerTitle: "خبرنا باختصار من تبي توظّف",
        headerSubtitle: "ما ياخذ أكثر من دقيقة. بنراجع طلبك ونتواصل معاك بشكل شخصي.",
        fields: [
          { id: "full_name",     type: "text",     required: true,  label: "اسمك",                 placeholder: "الاسم الكامل" },
          { id: "phone",         type: "tel",      required: true,  label: "رقم الهاتف",            placeholder: "+971 5X XXX XXXX" },
          { id: "email",         type: "email",    required: false, label: "البريد الإلكتروني (اختياري)", placeholder: "name@email.com" },
          { id: "company_name",  type: "text",     required: true,  label: "اسم الشركة/النشاط",     placeholder: "اسم شركتك أو نشاطك", full: true },
          { id: "location",      type: "text",     required: true,  label: "موقع الشركة",           placeholder: "المدينة، الدولة (مثال: أبوظبي، الإمارات)" },
          { id: "positions",     type: "text",     required: true,  label: "الوظيفة المطلوبة",       placeholder: "مثال: نجّار، إداري، كاشير", full: true },
          { id: "headcount",     type: "text",     required: false, label: "عدد الأشخاص (اختياري)",  placeholder: "مثال: 1 أو 2 أو 5" },
          { id: "interview_method", type: "select", required: false, label: "طريقة المقابلة (اختياري)", full: true,
            options: [
              { v: "face",   label: "حضوري" },
              { v: "online", label: "أونلاين" },
              { v: "direct", label: "بدون مقابلة / توظيف مباشر" }
            ]
          },
          { id: "interview_location", type: "select", required: false, label: "مكان المقابلة المفضل (اختياري)", full: true,
            options: [
              { v: "company_office", label: "مكتب الشركة" },
              { v: "project_site",   label: "الموقع / موقع العمل" },
              { v: "rehaf_office",   label: "مكتب REHAF" },
              { v: "online",         label: "أونلاين" },
              { v: "other",          label: "شي ثاني (بنأكد معاك)" }
            ]
          },
          { id: "notes", type: "textarea", required: false, label: "ملاحظات (اختياري)", placeholder: "أي شي مهم تبي تضيفه؟", minLen: 0, full: true }
        ],
        buttons: { submit: "إرسال الطلب", cancel: "إلغاء", close: "إغلاق" },
        errors: {
          full_name: "رجاءً اكتب اسمك",
          phone: "رجاءً اكتب رقم إماراتي صحيح",
          email: "رجاءً اكتب بريد إلكتروني صحيح",
          company_name: "رجاءً اكتب اسم الشركة/النشاط",
          location: "رجاءً اكتب موقع الشركة",
          positions: "رجاءً اكتب الوظيفة المطلوبة"
        },
        statusSending: "جارٍ الإرسال…",
        statusFail: "صار خطأ. جرّب مرة ثانية.",
        success: { title: "تم.", text: "استلمنا طلب التوظيف وبنتواصل معاك قريباً." }
      }
    }
  }
};
/* =========================================================
   Helpers
   ========================================================= */
const $ = (s) => document.querySelector(s);
const state = { lang: localStorage.getItem("rehaf_lang") || "en" };
document.documentElement.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
const DUBAI_TZ = "Asia/Dubai";
function todayFormatted(lang) {
  const now = new Date();
  const opts = { day: "2-digit", month: "2-digit", year: "numeric", timeZone: DUBAI_TZ };
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", opts).format(now);
}
async function loadVacancies() {
  try {
    const res = await fetch("/vacancies.json?v=" + Date.now());
    if (!res.ok) throw 0;
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
function isValidEmail(email) {
  const v = String(email || "").trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}
/** Normalize UAE phone to +9715XXXXXXXX (strict). */
function normalizeUAEPhone(input) {
  let s = String(input || "").trim();
  s = s.replace(/[()\s\-]/g, "");
  if (!s) return { ok: false, e164: "" };
  if (s.startsWith("00971")) s = "+971" + s.slice(5);
  if (s.startsWith("05") && s.length === 10) s = "+971" + s.slice(1);
  if (/^5\d{8}$/.test(s)) s = "+971" + s;
  if (/^9715\d{8}$/.test(s)) s = "+" + s;
  if (s.startsWith("+971")) {
    const rest = s.slice(4);
    const ok = /^5\d{8}$/.test(rest);
    return { ok, e164: ok ? s : "" };
  }
  return { ok: false, e164: "" };
}
function safeHref() {
  try { return window.location.href; } catch { return ""; }
}
/* =========================================================
   Lead Modal Builder (single modal, 2 modes)
   ========================================================= */
let currentModalKey = null; // "modal_consult" | "modal_hire"
function getModalDict(modalKey) {
  return CONFIG.i18n[state.lang][modalKey];
}
function ensureModalExists() {
  if (document.getElementById("rehafLeadModal")) return;
  const modal = document.createElement("div");
  modal.id = "rehafLeadModal";
  modal.className = "rehaf-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="rehaf-modal__backdrop" data-rehaf-close="1"></div>
    <div class="rehaf-modal__panel" role="dialog" aria-modal="true" aria-label="REHAF Lead Form">
      <div class="rehaf-modal__header">
        <div class="rehaf-modal__brand">
          <div class="rehaf-modal__avatar" aria-hidden="true">
            <img id="rehafModalLogo" src="/assets/logo.webp" alt="REHAF">
          </div>
          <div class="rehaf-modal__headings">
            <div class="rehaf-modal__title" id="rehafModalTitle"></div>
            <div class="rehaf-modal__subtitle" id="rehafModalSubtitle"></div>
          </div>
        </div>
        <button type="button" class="rehaf-modal__close" id="rehafLeadClose" aria-label="Close">✕</button>
      </div>
      <div class="rehaf-modal__body">
        <form class="rehaf-form" id="rehafLeadForm" novalidate>
          <div class="rehaf-grid" id="rehafFields"></div>
          <div class="rehaf-actions">
            <button type="submit" class="rehaf-btn rehaf-btn--primary" id="rehafLeadSubmit"></button>
            <button type="button" class="rehaf-btn rehaf-btn--ghost" id="rehafCancelBtn" data-rehaf-close="1"></button>
            <span class="rehaf-status" id="rehafStatus"></span>
          </div>
          <!-- honeypot -->
          <input class="rehaf-hp" id="rehafHp" name="website" tabindex="-1" autocomplete="off" />
        </form>
        <div class="rehaf-success" id="rehafLeadSuccess" hidden>
          <div class="rehaf-success__title" id="rehafSuccessTitle"></div>
          <div class="rehaf-success__text" id="rehafSuccessText"></div>
          <button type="button" class="rehaf-btn rehaf-btn--primary" id="rehafSuccessClose"></button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
function buildFieldHTML(f) {
  const fullClass = f.full ? "rehaf-field--full" : "";
  const id = `rehaf_${f.id}`;
  const errId = `err_${f.id}`;
  if (f.type === "textarea") {
    return `
      <div class="${fullClass}">
        <label class="rehaf-label" for="${id}">${f.label}${f.required ? " *" : ""}</label>
        <textarea class="rehaf-textarea" id="${id}" name="${f.id}" placeholder="${f.placeholder || ""}"></textarea>
        <div class="rehaf-error" id="${errId}"></div>
      </div>
    `;
  }
  if (f.type === "select") {
    const opts = (f.options || []).map(o => `<option value="${o.v}">${o.label}</option>`).join("");
    return `
      <div class="${fullClass}">
        <label class="rehaf-label" for="${id}">${f.label}${f.required ? " *" : ""}</label>
        <select class="rehaf-input" id="${id}" name="${f.id}">
          <option value=""></option>
          ${opts}
        </select>
        <div class="rehaf-error" id="${errId}"></div>
      </div>
    `;
  }
  // default input
  return `
    <div class="${fullClass}">
      <label class="rehaf-label" for="${id}">${f.label}${f.required ? " *" : ""}</label>
      <input class="rehaf-input" id="${id}" name="${f.id}" type="${f.type || "text"}" placeholder="${f.placeholder || ""}" />
      <div class="rehaf-error" id="${errId}"></div>
    </div>
  `;
}
function setErr(fid, msg) {
  const el = document.getElementById(`err_${fid}`);
  if (el) el.textContent = msg || "";
}
function openLeadModal(modalKey) {
  ensureModalExists();
  currentModalKey = modalKey;
  const modal = document.getElementById("rehafLeadModal");
  const fieldsHost = document.getElementById("rehafFields");
  const form = document.getElementById("rehafLeadForm");
  const success = document.getElementById("rehafLeadSuccess");
  const status = document.getElementById("rehafStatus");
  if (!modal || !fieldsHost || !form) return;
  const dict = getModalDict(modalKey);
  // Header + buttons + success texts
  document.getElementById("rehafModalTitle").textContent = dict.headerTitle;
  document.getElementById("rehafModalSubtitle").textContent = dict.headerSubtitle;
  document.getElementById("rehafLeadSubmit").textContent = dict.buttons.submit;
  document.getElementById("rehafCancelBtn").textContent = dict.buttons.cancel;
  document.getElementById("rehafSuccessClose").textContent = dict.buttons.close;
  document.getElementById("rehafSuccessTitle").textContent = dict.success.title;
  document.getElementById("rehafSuccessText").textContent = dict.success.text;
  // Build fields
  fieldsHost.innerHTML = dict.fields.map(buildFieldHTML).join("");
  // Reset UI
  if (status) status.textContent = "";
  if (success) success.hidden = true;
  form.hidden = false;
  const hp = document.getElementById("rehafHp");
  if (hp) hp.value = "";
  // clear errors
  dict.fields.forEach(f => setErr(f.id, ""));
  // Open
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  // Focus first field
  setTimeout(() => {
    const first = dict.fields[0]?.id;
    if (first) document.getElementById(`rehaf_${first}`)?.focus();
  }, 50);
  // Close hooks
  modal.querySelectorAll("[data-rehaf-close='1']").forEach(el => {
    el.onclick = closeLeadModal;
  });
  document.getElementById("rehafLeadClose").onclick = closeLeadModal;
  // Esc key
  const onKey = (e) => { if (e.key === "Escape") closeLeadModal(); };
  document.addEventListener("keydown", onKey);
  modal._rehafOnKey = onKey;
}
function closeLeadModal() {
  const modal = document.getElementById("rehafLeadModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (modal._rehafOnKey) {
    document.removeEventListener("keydown", modal._rehafOnKey);
    modal._rehafOnKey = null;
  }
}
/* =========================================================
   Render main page
   ========================================================= */
function render() {
  document.documentElement.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
  $("#year").textContent = new Date().getFullYear();
  $("#welcomeText").textContent = t("welcome");
  // Consent list
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
  wrap.innerHTML = "";
  CONFIG.links.forEach((l) => {
    const label = t(`links.${l.key}.label`);
    const soonBadge = l.soon ? `<span class="badge ml-2">${state.lang === "ar" ? "قريبًا" : "Soon"}</span>` : "";
    // Cards that open popups (hire_req + consult_req)
    if (l.key === "consult_req" || l.key === "hire_req") {
      const card = document.createElement("div");
      card.className = "btn rounded-2xl p-4 block transition";
      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl grid place-items-center text-xl bg-white/10">
            ${l.icon || "🔗"}
          </div>
          <div class="flex-1">
            <div class="font-semibold text-xl">${label} ${soonBadge}</div>
            <div class="text-base opacity-90">${l.info || ""}</div>
          </div>
          <button type="button" class="rehaf-btn rehaf-btn--primary rehaf-start-btn whitespace-nowrap">
            ${CONFIG.i18n[state.lang].startHere}
          </button>
        </div>
      `;
      const modalKey = (l.key === "hire_req") ? "modal_hire" : "modal_consult";
      card.querySelector(".rehaf-start-btn").addEventListener("click", () => openLeadModal(modalKey));
      wrap.appendChild(card);
      return;
    }
    // Default anchors
    const a = document.createElement("a");
    a.href = l.url || "#";
    a.target = l.url && l.url.startsWith("http") ? "_blank" : "";
    a.className = "btn rounded-2xl p-4 block transition";
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
      a.removeAttribute("target");
    }
    wrap.appendChild(a);
  });
  // Vacancies
  $("#vacTitle").textContent = t("vacTitle");
  $("#todayDate").textContent = todayFormatted(state.lang);
  const list = $("#vacList");
  const empty = $("#vacEmpty");
  list.innerHTML = "";
  if (CONFIG.vacancies.items?.length) {
    empty.textContent = "";
    CONFIG.vacancies.items.forEach((v) => {
      const title = state.lang === "ar" ? (v.title_ar || v.title_en) : (v.title_en || v.title_ar);
      const meta  = state.lang === "ar" ? (v.meta_ar || "") : (v.meta_en || "");
      list.insertAdjacentHTML("beforeend", `
        <li><div class="flex items-center gap-2">
          <span class="opacity-80">-</span>
          <span class="text-base">${title}</span>
          <span class="text-sm opacity-70 ml-auto">${meta}</span>
        </div></li>
      `);
    });
  } else {
    empty.textContent = t("vacEmpty");
  }
  // If modal is open, update its language live
  const modal = document.getElementById("rehafLeadModal");
  if (modal && modal.classList.contains("is-open") && currentModalKey) {
    const wasOpen = currentModalKey;
    closeLeadModal();
    openLeadModal(wasOpen);
  }
}
/* =========================================================
   Boot + toggle + submit
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadVacancies().then(render);
  // Language toggle
  $("#langToggle").addEventListener("click", () => {
    state.lang = (state.lang === "en") ? "ar" : "en";
    localStorage.setItem("rehaf_lang", state.lang);
    render();
    window.rehafFaqRender?.();
  });
  // Submit handler (single handler for both modal types)
  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form || form.id !== "rehafLeadForm") return;
    e.preventDefault();
    if (!currentModalKey) return;
    const dict = getModalDict(currentModalKey);
    // Honeypot
    const hp = String(document.getElementById("rehafHp")?.value || "").trim();
    if (hp) return;
    // Collect values
    const values = {};
    dict.fields.forEach(f => {
      const el = document.getElementById(`rehaf_${f.id}`);
      values[f.id] = String(el?.value || "").trim();
      setErr(f.id, "");
    });
    // Validate
    let ok = true;
    for (const f of dict.fields) {
      const v = values[f.id];
      if (f.required && !v) {
        setErr(f.id, dict.errors[f.id] || "Required");
        ok = false;
        continue;
      }
      if (f.id === "email" && v) {
        if (!isValidEmail(v)) { setErr(f.id, dict.errors.email); ok = false; }
      }
      if (f.id === "phone") {
        const p = normalizeUAEPhone(v);
        if (!p.ok) { setErr(f.id, dict.errors.phone); ok = false; }
        else values.phone_e164 = p.e164;
      }
      if (f.id === "request" && v && (f.minLen || 0) > 0) {
        if (v.length < f.minLen) { setErr(f.id, dict.errors.request); ok = false; }
      }
    }
    if (!ok) return;
    // Build payload (Make/webhook later — URL left empty intentionally)
    const payload = {
      service_key: (currentModalKey === "modal_hire") ? "hire_req" : "consult_req",
      lang: state.lang,
      submitted_at: new Date().toISOString(),
      page: safeHref(),
      ...values
    };
    const status = document.getElementById("rehafStatus");
    const success = document.getElementById("rehafLeadSuccess");
    const leadForm = document.getElementById("rehafLeadForm");
    const WEBHOOK_URL = ""; // you will add it later
    try {
      if (status) status.textContent = dict.statusSending;
      if (WEBHOOK_URL) {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Webhook failed");
      }
      // Success UI
      if (status) status.textContent = "";
      if (leadForm) leadForm.hidden = true;
      if (success) success.hidden = false;
      document.getElementById("rehafSuccessClose").onclick = closeLeadModal;
    } catch {
      if (status) status.textContent = dict.statusFail;
    }
  });
});