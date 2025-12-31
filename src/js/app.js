// src/js/app.js

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

/* =========================================================
   REHAF Lead Popup (consult_req) — fast lead capture
   ========================================================= */

const LEAD_MODAL_COPY = {
  title: "Tell us briefly how we can help you",
  subtitle: "This will take less than a minute. We’ll review your request and contact you personally.",
  submit: "Send request",
  successTitle: "Thank you.",
  successText: "We’ve received your request and will contact you shortly."
};

function qs(id) { return document.getElementById(id); }
function trim(v) { return String(v || "").trim(); }
function setErr(id, msg) { const el = qs(id); if (el) el.textContent = msg || ""; }

function openLeadModal() {
  const modal = qs("rehafLeadModal");
  const closeBtn = qs("rehafLeadClose");
  const titleEl = qs("rehafModalTitle");
  const subEl = qs("rehafModalSubtitle");

  const form = qs("rehafLeadForm");
  const success = qs("rehafLeadSuccess");
  const status = qs("rehafStatus");

  if (!modal || !form || !closeBtn || !titleEl || !subEl) return;

  // Locked copy
  titleEl.textContent = LEAD_MODAL_COPY.title;
  subEl.textContent = LEAD_MODAL_COPY.subtitle;

  // Reset UI
  if (status) status.textContent = "";
  if (success) success.hidden = true;
  form.hidden = false;

  // Clear inputs
  ["rehafName", "rehafEmail", "rehafPhone", "rehafLocation", "rehafRequest", "rehafHp"].forEach((fid) => {
    const el = qs(fid);
    if (el) el.value = "";
  });

  // Clear errors
  ["errName", "errEmail", "errPhone", "errLocation", "errRequest"].forEach((eid) => setErr(eid, ""));

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  setTimeout(() => { qs("rehafName")?.focus(); }, 50);

  const onKey = (e) => { if (e.key === "Escape") closeLeadModal(); };
  document.addEventListener("keydown", onKey);

  // Close handling
  modal.querySelectorAll("[data-rehaf-close='1']").forEach((el) => { el.onclick = closeLeadModal; });
  closeBtn.onclick = closeLeadModal;

  modal._rehafOnKey = onKey;
}

function closeLeadModal() {
  const modal = qs("rehafLeadModal");
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  if (modal._rehafOnKey) {
    document.removeEventListener("keydown", modal._rehafOnKey);
    modal._rehafOnKey = null;
  }
}

function isValidEmail(email) {
  const v = String(email || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

// Normalize UAE phone to +9715XXXXXXXX (strict)
function normalizeUAEPhone(input) {
  let s = String(input || "").trim();
  s = s.replace(/[()\s\-]/g, "");

  if (!s) return { ok: false, e164: "" };

  // 00971 -> +971
  if (s.startsWith("00971")) s = "+971" + s.slice(5);

  // 05xxxxxxxx (10 digits) -> +9715xxxxxxxx
  if (s.startsWith("05") && s.length === 10) s = "+971" + s.slice(1);

  // 5xxxxxxxx (9 digits) -> +9715xxxxxxxx
  if (/^5\d{8}$/.test(s)) s = "+971" + s;

  // 9715xxxxxxxx (12 digits) -> +9715xxxxxxxx
  if (/^9715\d{8}$/.test(s)) s = "+" + s;

  if (s.startsWith("+971")) {
    const rest = s.slice(4);
    const ok = /^5\d{8}$/.test(rest);
    return { ok, e164: ok ? s : "" };
  }

  return { ok: false, e164: "" };
}

function locationHrefSafe() {
  try { return window.location.href; } catch { return ""; }
}

/* =========================================================
   Render
   ========================================================= */

function render() {
  document.documentElement.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const welcomeEl = $("#welcomeText");
  if (welcomeEl) welcomeEl.textContent = t("welcome");

  // Consent list
  const consentHost = document.getElementById("consentText");
  if (consentHost) {
    const consentLines = CONFIG.i18n[state.lang].consent || [];
    consentHost.innerHTML =
      `<ul class="list-disc list-inside ${state.lang === "ar" ? "pr-5" : "pl-5"} m-0">
        ${consentLines.map((line) => `<li class="text-start">${line}</li>`).join("")}
      </ul>`;
  }

  // Links
  const wrap = $("#links");
  if (wrap) {
    wrap.innerHTML = "";

    CONFIG.links.forEach((l) => {
      const label = t(`links.${l.key}.label`);
      const soonBadge = l.soon ? `<span class="badge ml-2">${state.lang === "ar" ? "قريبًا" : "Soon"}</span>` : "";

      // Special: consult_req becomes a card with a Start Here button
      if (l.key === "consult_req") {
        const card = document.createElement("div");
        card.className = "btn rounded-2xl p-4 block transition";

        card.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl grid place-items-center text-xl bg-white/10">${l.icon || "🔗"}</div>
            <div class="flex-1">
              <div class="font-semibold text-xl">${label} ${soonBadge}</div>
              <div class="text-base opacity-90">${l.info || ""}</div>
            </div>
          </div>
          <div class="mt-3 flex justify-end">
            <button type="button" class="rehaf-btn rehaf-btn--primary rehaf-start-btn">Start Here</button>
          </div>
        `;

        card.querySelector(".rehaf-start-btn")?.addEventListener("click", openLeadModal);
        wrap.appendChild(card);
        return;
      }

      // Default cards remain anchors
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
  }

  // Vacancies section
  const vacTitleEl = $("#vacTitle");
  const todayEl = $("#todayDate");
  if (vacTitleEl) vacTitleEl.textContent = t("vacTitle");
  if (todayEl) todayEl.textContent = todayFormatted(state.lang);

  const list = $("#vacList");
  const empty = $("#vacEmpty");

  if (list) list.innerHTML = "";

  if (CONFIG.vacancies.items?.length) {
    if (empty) empty.textContent = "";
    CONFIG.vacancies.items.forEach((v) => {
      const title = state.lang === "ar" ? (v.title_ar || v.title_en) : (v.title_en || v.title_ar);
      const meta = state.lang === "ar" ? (v.meta_ar || "") : (v.meta_en || "");
      list?.insertAdjacentHTML(
        "beforeend",
        `<li><div class="flex items-center gap-2">
          <span class="opacity-80">-</span>
          <span class="text-base">${title}</span>
          <span class="text-sm opacity-70 ml-auto">${meta}</span>
        </div></li>`
      );
    });
  } else {
    if (empty) empty.textContent = t("vacEmpty");
  }
}

/* =========================================================
   Boot + Language toggle + Lead form submit
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Initial render after vacancies load
  loadVacancies().then(render);

  // Language toggle
  const toggle = $("#langToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      state.lang = state.lang === "en" ? "ar" : "en";
      localStorage.setItem("rehaf_lang", state.lang);
      render();
      window.rehafFaqRender?.();
    });
  }

  // Lead form submit logic
  const form = qs("rehafLeadForm");
  const status = qs("rehafStatus");
  const success = qs("rehafLeadSuccess");
  const successClose = qs("rehafSuccessClose");

  if (successClose) successClose.onclick = closeLeadModal;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Honeypot: if filled, bot
      const hp = trim(qs("rehafHp")?.value);
      if (hp) return;

      const full_name = trim(qs("rehafName")?.value);
      const email = trim(qs("rehafEmail")?.value).toLowerCase();
      const phone_raw = trim(qs("rehafPhone")?.value);
      const locationText = trim(qs("rehafLocation")?.value);
      const request = trim(qs("rehafRequest")?.value);

      // Clear errors
      ["errName", "errEmail", "errPhone", "errLocation", "errRequest"].forEach((eid) => setErr(eid, ""));
      if (status) status.textContent = "";

      // Validate (soft messages)
      let ok = true;

      if (full_name.length < 2) { setErr("errName", "Please enter your name"); ok = false; }
      if (!isValidEmail(email)) { setErr("errEmail", "Please enter a valid email address"); ok = false; }

      const phone = normalizeUAEPhone(phone_raw);
      if (!phone.ok) { setErr("errPhone", "Please enter a valid phone number"); ok = false; }

      if (locationText.length < 2) { setErr("errLocation", "Please tell us where you’re located"); ok = false; }
      if (request.length < 10) { setErr("errRequest", "Please add a short description of your request"); ok = false; }

      if (!ok) return;

      // Payload (for later webhook use)
      const payload = {
        service_key: "consult_req",
        full_name,
        email,
        phone_e164: phone.e164,
        location: locationText,
        request,
        submitted_at: new Date().toISOString(),
        page: locationHrefSafe(),
        lang: state.lang
      };

      // Optional webhook: paste later if you want
      const WEBHOOK_URL = ""; // e.g. "https://hook.eu1.make.com/xxxxx"

      try {
        if (status) status.textContent = "Sending…";

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
        form.hidden = true;
        if (success) success.hidden = false;

      } catch {
        if (status) status.textContent = "Something went wrong. Please try again.";
      }
    });
  }
});