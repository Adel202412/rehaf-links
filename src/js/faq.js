(() => {
  "use strict";

  // --- FAQ content (EN / AR) ---
  const FAQ = {
    en: {
      title: "REHAF Assistant — FAQ",
      back: "Back to FAQ",
      close: "Close",
      list: [
        ["What is REHAF?",
`REHAF is a Business Solution Provider. We help with consultancy,
recruitment, management, cost analysis, business plans, design, AI automation,
and **customized solutions** for growth.`],
        ["What services does REHAF provide?",
`Our main service is **customizing solutions** for clients: hiring & recruitment,
project setup/design, and AI automation/digital solutions.`],
        ["How does pricing work?",
`Pricing depends on service type and customization. Some services may be free.
Start by filling the **Business Consultancy** form; we’ll contact you.`],
        ["Where can I apply for a job?",
`Fill the **Apply for a Job** form. Vacancies are shown at the bottom of the page.`],
        ["What vacancies are available today?",
`Vacancies (if any) are listed in **Vacancies open for today** on this page.`],
        ["How can I request hiring for my business?",
`Use the **Hiring Service Request** form; our team will contact you.`],
        ["How can I request a business consultancy?",
`Use the **Other Service Request (Consultant Service)** form and we’ll reach out.`],
        ["How long does hiring take?",
`It depends on applicants. Sometimes 5 minutes, up to 48 hours maximum.`],
        ["How can I contact REHAF?",
`Email: lilafutum@gmail.com. We’ll call after reviewing your request.`],
      ]
    },
    ar: {
      title: "مساعد REHAF — الأسئلة الشائعة",
      back: "الرجوع إلى الأسئلة",
      close: "إغلاق",
      list: [
        ["ما هي REHAF؟",
`REHAF هي مزود حلول أعمال. نساعد في الاستشارات والتوظيف والإدارة
وتحليل التكاليف وخطط الأعمال والتصميم وأتمتة الذكاء الاصطناعي
وحلول **مخصصة** للنمو.`],
        ["ما الخدمات التي تقدمها REHAF؟",
`خدمتنا الأساسية هي **تخصيص الحلول** للعملاء: التوظيف،
تأسيس/تصميم المشاريع، وحلول الأتمتة الرقمية.`],
        ["كيف تعمل سياسة الأسعار؟",
`الأسعار تعتمد على نوع الخدمة ومستوى التخصيص. بعض الخدمات قد تكون مجانية.
ابدأ بتعبئة نموذج **الاستشارة** وسنتواصل معك.`],
        ["أين يمكنني التقديم على وظيفة؟",
`عبّئ نموذج **التقدم لوظيفة**. تُعرض الوظائف في أسفل الصفحة.`],
        ["ما الوظائف المتاحة اليوم؟",
`إن وُجدت وظائف فستظهر في قسم **الوظائف المتاحة اليوم** في هذه الصفحة.`],
        ["كيف أطلب خدمة التوظيف لشركتي؟",
`استخدم نموذج **طلب خدمة التوظيف** وسيتواصل الفريق معك.`],
        ["كيف أطلب استشارة أعمال؟",
`استخدم نموذج **طلب خدمة أخرى (استشارات)** وسنتواصل معك.`],
        ["كم يستغرق التوظيف؟",
`يعتمد على المتقدمين. أحيانًا 5 دقائق وحتى 48 ساعة كحد أقصى.`],
        ["كيف أتواصل مع REHAF؟",
`البريد: lilafutum@gmail.com — سنتصل بك بعد مراجعة طلبك.`],
      ]
    }
  };

  const faqPanel = document.getElementById("faqPanel");
  const faqBody  = document.getElementById("faqBody");
  const faqTitle = document.getElementById("faqTitle");
  const faqBtn   = document.getElementById("faqBtn");
  const faqClose = document.getElementById("faqClose");

  if (!faqPanel || !faqBody || !faqTitle || !faqBtn || !faqClose) return;

  const getLang = () => localStorage.getItem("rehaf_lang") || "en";

  function renderFaqList() {
    const lang = getLang();
    const dict = FAQ[lang];
    faqTitle.textContent = dict.title;
    faqBody.innerHTML = "";

    dict.list.forEach(([q, _a], i) => {
      const row = document.createElement("div");
      row.className = "q-item";
      row.innerHTML = `<span class="q-dot"></span><span>${q}</span>`;
      row.addEventListener("click", () => renderFaqAnswer(i));
      faqBody.appendChild(row);
    });
  }

  function renderFaqAnswer(idx) {
    const lang = getLang();
    const dict = FAQ[lang];
    const [q, a] = dict.list[idx];

    faqTitle.textContent = dict.title;

    faqBody.innerHTML = `
      <div class="answer"><strong>${q}</strong>\n\n${a}</div>
      <div class="faq-actions">
        <button id="backFaq">${dict.back} ←</button>
        <button id="closeFaq">${dict.close}</button>
      </div>
    `;

    const backBtn = document.getElementById("backFaq");
    const closeBtn = document.getElementById("closeFaq");

    if (backBtn) backBtn.onclick = renderFaqList;
    if (closeBtn) closeBtn.onclick = () => { faqPanel.style.display = "none"; };
  }

  function openFaq(e) {
    if (e) e.preventDefault();
    faqPanel.style.display = "flex";
    renderFaqList();
  }

  function closeFaq() {
    faqPanel.style.display = "none";
  }

  faqBtn.addEventListener("click", openFaq, { passive: false });
  faqClose.addEventListener("click", closeFaq);

  // Hook used by app.js after language toggle
  window.rehafFaqRender = () => {
    if (faqPanel.style.display === "flex") renderFaqList();
  };
})();