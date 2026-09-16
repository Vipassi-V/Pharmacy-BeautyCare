import { adminStore } from '../../store/adminStore.js';

export function renderReportsView() {
  const { sessions } = adminStore;
  const stats7d = adminStore.get7DayConcernStats();

  return `
    <div>
      <!-- Header -->
      <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h1 class="font-headline-md" style="color: var(--on-surface);">Consultation Reports & History</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Epidemiological skin concern distribution in Tansen and historical kiosk consultation logs.
          </p>
        </div>

        <button class="btn-secondary" id="exportReportsCsvBtn" style="min-height: 48px; font-size: 0.95rem;">
          <span class="material-symbols-outlined">download</span>
          <span>Export CSV Report</span>
        </button>
      </div>

      <!-- Section 1: Most Selected Concerns from the Last 7 Days -->
      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <div>
            <h3 class="font-headline-sm" style="color: var(--on-surface);">
              7-Day Most Selected Concerns Analysis
            </h3>
            <p class="font-body-sm" style="color: var(--on-surface-variant);">
              Derived from ${sessions.length * 15} scanned sessions across terminal kiosks in Tansen.
            </p>
          </div>
          <span class="location-chip">Tansen, Palpa</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${stats7d.map((stat, idx) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem;">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 0.5rem;">
                <div>
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">RANK #${idx + 1}</span>
                  <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem;">${stat.title}</div>
                  <div style="font-size: 0.8rem; color: var(--secondary);">${stat.nepaliTitle || ''}</div>
                </div>
                ${stat.isSevere ? `
                  <span style="font-size: 0.7rem; background: var(--warning-wash); color: var(--tertiary); padding: 2px 6px; border-radius: 4px; font-weight: 700;">
                    Severe
                  </span>
                ` : ''}
              </div>

              <div style="display: flex; align-items: baseline; gap: 6px; margin: 0.75rem 0 0.5rem;">
                <span class="font-headline-sm" style="color: var(--on-surface); font-size: 1.4rem;">${stat.count}</span>
                <span style="font-size: 0.8rem; color: var(--outline);">patient scans (${stat.percentage}%)</span>
              </div>

              <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                <div style="width: ${stat.percentage * 2.5}%; height: 100%; background: ${stat.isSevere ? 'var(--tertiary-container)' : 'var(--primary-container)'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 2: Last Ten Session Records -->
      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1); overflow: hidden;">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <h3 class="font-headline-sm" style="color: var(--on-surface);">Last Ten Session Records</h3>
          <span style="font-size: 0.8rem; color: var(--outline);">Most recent consultation events</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; height: 48px;">
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Pass ID</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Customer Name</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Skin Type</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Concerns Flagged</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Severe Warning</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            ${sessions.slice(0, 10).map((s, idx) => `
              <tr style="border-bottom: 1px solid #f1f5f9; height: 56px;">
                <td style="padding: 0 1rem; font-weight: 700; color: var(--primary); font-family: monospace;">
                  ${s.id}
                </td>
                <td style="padding: 0 1rem; font-weight: 600; color: var(--on-surface);">
                  ${s.customerName}
                </td>
                <td style="padding: 0 1rem; text-transform: capitalize; color: var(--secondary); font-weight: 600;">
                  ${s.skinType}
                </td>
                <td style="padding: 0 1rem; color: var(--on-surface-variant);">
                  ${s.concerns.length} Concerns Selected
                </td>
                <td style="padding: 0 1rem;">
                  ${s.hasSevere ? `
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: var(--warning-wash); color: var(--tertiary);">
                      <span class="material-symbols-outlined" style="font-size: 14px;">priority_high</span>
                      Warning Triggered
                    </span>
                  ` : `
                    <span style="font-size: 0.75rem; color: var(--outline);">No</span>
                  `}
                </td>
                <td style="padding: 0 1rem; color: var(--outline); font-size: 0.8rem;">
                  ${new Date(s.timestamp).toLocaleDateString()} ${new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
