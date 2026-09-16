import { adminStore } from '../../store/adminStore.js';

export function renderDashboardView() {
  const { categories, skinProblems, products, sessions } = adminStore;
  const stats7d = adminStore.get7DayConcernStats();

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalConcerns = skinProblems.length;
  const severeConcerns = skinProblems.filter(p => p.isSevere).length;
  const totalSessions = sessions.length;

  return `
    <div>
      <!-- Page Title -->
      <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h1 class="font-headline-md" style="color: var(--on-surface);">Pharmacist Dashboard</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Real-time consultation analytics and clinical inventory overview in Tansen, Palpa.
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn-secondary" id="dashAddProductBtn" style="min-height: 44px; font-size: 0.9rem; padding: 0 1rem;">
            <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
            <span>Add Product</span>
          </button>
          <button class="btn-primary" id="dashViewReportsBtn" style="min-height: 44px; font-size: 0.9rem; padding: 0 1rem;">
            <span class="material-symbols-outlined" style="font-size: 18px;">analytics</span>
            <span>View Full Reports</span>
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div style="background: #ffffff; padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Active Products</span>
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #eff4ff; color: var(--secondary); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">inventory_2</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            ${activeProducts} <span style="font-size: 0.9rem; color: var(--outline); font-weight: 400;">/ ${totalProducts} total</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">Across ${categories.length} Categories</div>
        </div>

        <div style="background: #ffffff; padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Skin Problems</span>
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #f0fdf4; color: var(--primary-container); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">healing</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            ${totalConcerns}
          </div>
          <div style="font-size: 0.8rem; color: var(--tertiary); font-weight: 600;">${severeConcerns} Severe Safeguards</div>
        </div>

        <div style="background: #ffffff; padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">7-Day Consultations</span>
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #fef3c7; color: var(--tertiary); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">touch_app</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            168
          </div>
          <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">+24% vs previous week</div>
        </div>

        <div style="background: #ffffff; padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Altitude Warning Rate</span>
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #fee2e2; color: var(--error); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">shield_with_heart</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            28%
          </div>
          <div style="font-size: 0.8rem; color: var(--on-surface-variant);">Flagged for counter check</div>
        </div>
      </div>

      <!-- Split Analytics Grid: 7-Day Concerns & Recent Activity -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;">
        <!-- Left: Most Selected Concerns from the Last 7 Days -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div>
              <h3 class="font-headline-sm" style="color: var(--on-surface);">
                Most Selected Concerns (Last 7 Days)
              </h3>
              <p class="font-body-sm" style="color: var(--on-surface-variant);">
                Aggregated patient queries recorded across Palpa kiosk terminals.
              </p>
            </div>
            <span class="location-chip">Palpa Trends</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${stats7d.map((stat, idx) => `
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; color: var(--primary); width: 16px;">#${idx + 1}</span>
                    <span style="font-weight: 600; color: var(--on-surface);">${stat.title}</span>
                    ${stat.isSevere ? `
                      <span style="font-size: 0.7rem; background: var(--warning-wash); color: var(--tertiary); padding: 1px 6px; border-radius: 4px; font-weight: 700;">
                        Severe
                      </span>
                    ` : ''}
                  </div>
                  <span style="font-weight: 700; color: var(--on-surface);">${stat.count} scans (${stat.percentage}%)</span>
                </div>
                <!-- Progress bar -->
                <div style="width: 100%; height: 8px; background: #eff4ff; border-radius: 9999px; overflow: hidden;">
                  <div style="width: ${stat.percentage * 2.5}%; height: 100%; background: ${stat.isSevere ? 'var(--tertiary-container)' : 'var(--primary-container)'}; border-radius: 9999px; transition: width 0.4s ease;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Recent Session Records Snapshot -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div>
              <h3 class="font-headline-sm" style="color: var(--on-surface);">Recent Patient Sessions</h3>
              <p class="font-body-sm" style="color: var(--on-surface-variant);">Live terminal activity</p>
            </div>
            <button class="btn-ghost" id="dashSeeAllSessionsBtn" style="font-size: 0.85rem; padding: 0 8px;">
              See All
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${sessions.slice(0, 5).map(s => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border-radius: var(--radius-md); background: #f8fafc; border: 1px solid #f1f5f9;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary-container); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">
                    ${s.customerName.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: var(--on-surface);">${s.customerName}</div>
                    <div style="font-size: 0.75rem; color: var(--on-surface-variant); text-transform: capitalize;">
                      ${s.skinType} Skin • ${s.concerns.length} Concerns
                    </div>
                  </div>
                </div>

                <div style="text-align: right;">
                  ${s.hasSevere ? `
                    <span style="font-size: 0.7rem; background: var(--warning-wash); color: var(--tertiary); padding: 2px 6px; border-radius: 4px; font-weight: 700;">
                      Severe Warning
                    </span>
                  ` : `
                    <span style="font-size: 0.7rem; background: #f0fdf4; color: var(--primary); padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                      Routine Saved
                    </span>
                  `}
                  <div style="font-size: 0.7rem; color: var(--outline); margin-top: 2px;">
                    ${new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
