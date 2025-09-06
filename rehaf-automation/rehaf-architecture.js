// rehaf-architecture.js
export function initRehafArchitecture(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="arch">
      <div class="container">
        <div class="box">
          <h2 style="color:var(--accent)">How it works</h2>
          <div class="diagram">
            <div class="card">
              <h4>Inputs</h4>
              <p>Emails, forms, messages, invoices, schedules.</p>
            </div>
            <div class="card">
              <h4>Automation Brain</h4>
              <p>AI assistants & workflows coordinate tasks, approvals, and data.</p>
            </div>
            <div class="card">
              <h4>Outputs</h4>
              <p>Reports, dashboards, messages, and actions — all on time.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}