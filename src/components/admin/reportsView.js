import { adminStore } from '../../store/adminStore.js';

export function renderReportsView(selectedSession = null) {
  const { sessions } = adminStore;
  const stats7d = adminStore.get7DayConcernStats();

  const totalSessions = sessions.length;
  const severeCount = sessions.filter(s => s.hasSevere).length;
  const totalProductsPrescribed = sessions.reduce((acc, s) => acc + (s.matchedProductsCount || 0), 0);
  const totalPrescriptionValue = sessions.reduce((acc, s) => acc + (s.totalEstimatedPrice || 0), 0);

  return `
    <div>
      <!-- Header -->
      <div style="margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h1 class="font-headline-md" style="color: var(--on-surface);">Consultation Reports & History</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Real-time patient consultation logs, skin concern distribution, and prescribed regimens in Tansen, Palpa.
          </p>
        </div>

        <button class="btn-primary" id="exportReportsCsvBtn" style="min-height: 44px; font-size: 0.9rem; padding: 0 1.25rem;">
          <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
          <span>Export Full CSV Report</span>
        </button>
      </div>

      <!-- Section 1: KPI Analytics Overview Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Total Consultations</span>
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #eff4ff; color: var(--secondary); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">groups</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            ${totalSessions}
          </div>
          <div style="font-size: 0.8rem; color: var(--secondary); font-weight: 600;">Recorded In-Store Sessions</div>
        </div>

        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Severe Safeguards</span>
            <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--warning-wash); color: var(--tertiary); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">health_and_safety</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--tertiary); margin-bottom: 0.25rem;">
            ${severeCount}
          </div>
          <div style="font-size: 0.8rem; color: #92400e; font-weight: 600;">Clinical Pharmacist Warnings</div>
        </div>

        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Prescribed Products</span>
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #f0fdf4; color: var(--primary-container); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">inventory_2</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            ${totalProductsPrescribed}
          </div>
          <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">Regimen Units Recommended</div>
        </div>

        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Total Regimen Value</span>
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">payments</span>
            </div>
          </div>
          <div class="font-headline-lg" style="color: var(--primary); margin-bottom: 0.25rem;">
            Rs. ${totalPrescriptionValue.toLocaleString()}
          </div>
          <div style="font-size: 0.8rem; color: var(--outline); font-weight: 500;">NPR Estimated Counter Total</div>
        </div>
      </div>

      <!-- Section 2: Most Selected Concerns Analysis -->
      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.5rem; box-shadow: var(--shadow-level-1); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <div>
            <h3 class="font-headline-sm" style="color: var(--on-surface); margin: 0;">
              Epidemiological Concern Distribution
            </h3>
            <p class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.8rem; margin: 0;">
              Distribution of skin conditions recorded across consultations in Palpa.
            </p>
          </div>
          <span class="location-chip">Tansen, Palpa</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
          ${stats7d.map((stat, idx) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.15rem;">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 0.5rem;">
                <div>
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">RANK #${idx + 1}</span>
                  <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem;">${stat.title}</div>
                  <div style="font-size: 0.8rem; color: var(--secondary);">${stat.nepaliTitle || ''}</div>
                </div>
                ${stat.isSevere ? `
                  <span style="font-size: 0.7rem; background: var(--warning-wash); color: var(--tertiary); padding: 2px 6px; border-radius: 4px; font-weight: 700; border: 1px solid #fcd34d;">
                    Severe
                  </span>
                ` : ''}
              </div>

              <div style="display: flex; align-items: baseline; gap: 6px; margin: 0.75rem 0 0.5rem;">
                <span class="font-headline-sm" style="color: var(--on-surface); font-size: 1.35rem;">${stat.count}</span>
                <span style="font-size: 0.8rem; color: var(--outline);">patient scans (${stat.percentage}%)</span>
              </div>

              <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                <div style="width: ${stat.percentage * 2.5}%; height: 100%; background: ${stat.isSevere ? 'var(--tertiary-container)' : 'var(--primary-container)'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 3: Detailed Consultation Records Table -->
      <div class="table-responsive-wrapper">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h3 class="font-headline-sm" style="color: var(--on-surface); margin: 0;">Patient Consultation Logs</h3>
            <span style="font-size: 0.8rem; color: var(--outline);">Full historical record of walk-in patients, skin profiles, and prescribed regimens</span>
          </div>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--secondary); background: #eff4ff; padding: 4px 10px; border-radius: 9999px;">
            ${sessions.length} Logged Sessions
          </span>
        </div>

        <table class="admin-data-table">
          <thead>
            <tr>
              <th>Pass ID</th>
              <th>Patient / Customer</th>
              <th>Skin Type</th>
              <th>Selected Concerns</th>
              <th>Prescribed Regimen</th>
              <th>Est. Total</th>
              <th>Date & Time</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${sessions.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: var(--outline);">
                  <span class="material-symbols-outlined" style="font-size: 36px; display: block; margin-bottom: 8px;">folder_off</span>
                  No consultation sessions recorded yet. Completed kiosk consultations will appear here automatically.
                </td>
              </tr>
            ` : sessions.map((s, idx) => {
              const productNames = (s.products || []).map(p => p.name || p.product_name).filter(Boolean);
              return `
                <tr>
                  <td style="font-weight: 700; color: var(--primary); font-family: monospace; font-size: 0.9rem;">
                    ${s.id}
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: #f0fdf4; color: var(--primary-container); font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        ${(s.customerName || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: var(--on-surface); font-size: 0.925rem;">
                          ${s.customerName}
                        </div>
                        <div style="font-size: 0.725rem; color: var(--outline);">Walk-in Visitor</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="font-size: 0.78rem; background: #eff4ff; color: var(--secondary); padding: 3px 8px; border-radius: 9999px; font-weight: 600; white-space: nowrap;">
                      ${s.skinType}
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px; max-width: 220px;">
                      ${(s.concerns || []).map(c => `
                        <span style="font-size: 0.72rem; background: #f8fafc; border: 1px solid #e2e8f0; color: var(--on-surface); padding: 1px 6px; border-radius: 4px; font-weight: 500;">
                          ${c}
                        </span>
                      `).join('')}
                      ${s.hasSevere ? `
                        <span style="display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; background: var(--warning-wash); color: var(--tertiary); border: 1px solid #fcd34d;">
                          ⚠️ Severe
                        </span>
                      ` : ''}
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 0.825rem; color: var(--on-surface); font-weight: 600;">
                      ${s.matchedProductsCount || productNames.length} Product${(s.matchedProductsCount || productNames.length) === 1 ? '' : 's'}
                    </div>
                    <div style="font-size: 0.725rem; color: var(--outline); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      ${productNames.join(', ') || 'Custom regimen'}
                    </div>
                  </td>
                  <td>
                    <div style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">
                      Rs. ${(s.totalEstimatedPrice || 0).toLocaleString()}
                    </div>
                  </td>
                  <td style="color: var(--outline); font-size: 0.8rem; white-space: nowrap;">
                    ${s.timestamp ? `${new Date(s.timestamp).toLocaleDateString()} ${new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Recent'}
                  </td>
                  <td style="text-align: right;">
                    <button class="btn-ghost view-session-btn" data-session-idx="${idx}" title="View Full Prescription Regimen" style="padding: 6px 10px; min-height: 34px; font-size: 0.8rem; color: var(--primary); font-weight: 600;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">visibility</span>
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Detail Modal -->
      ${selectedSession ? renderSessionDetailModal(selectedSession) : ''}
    </div>
  `;
}

export function renderSessionDetailModal(session) {
  const products = session.products || [];
  return `
    <div class="modal-backdrop" id="sessionDetailBackdrop" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1.5rem;">
      <div style="background: #ffffff; border-radius: var(--radius-2xl); width: 100%; max-width: 620px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-level-3); border: 1px solid #e2e8f0; animation: modalPop 0.25s ease-out;">
        <!-- Modal Header -->
        <div style="padding: 1.25rem 1.5rem; background: var(--primary-container); color: #ffffff; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 255, 255, 0.15); display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">clinical_notes</span>
            </div>
            <div>
              <div style="font-size: 1rem; font-weight: 700;">Consultation Pass #${session.id}</div>
              <div style="font-size: 0.75rem; opacity: 0.9;">Patient: ${session.customerName}</div>
            </div>
          </div>
          <button class="btn-ghost" id="closeSessionDetailBtn" style="color: #ffffff; min-height: 36px; padding: 0 8px;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div style="padding: 1.5rem; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Patient Summary Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #f8fafc; padding: 1rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0;">
            <div>
              <div style="font-size: 0.725rem; color: var(--outline); text-transform: uppercase;">Skin Type Profile</div>
              <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem; margin-top: 2px;">${session.skinType}</div>
            </div>
            <div>
              <div style="font-size: 0.725rem; color: var(--outline); text-transform: uppercase;">Consultation Timestamp</div>
              <div style="font-weight: 600; color: var(--on-surface); font-size: 0.85rem; margin-top: 2px;">
                ${session.timestamp ? new Date(session.timestamp).toLocaleString() : 'Recent'}
              </div>
            </div>
          </div>

          <!-- Concerns Flagged -->
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--on-surface); text-transform: uppercase; margin-bottom: 0.5rem;">
              Targeted Skin Concerns (${session.concerns.length})
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${session.concerns.map(c => `
                <span style="font-size: 0.8rem; background: #eff4ff; color: var(--secondary); padding: 4px 10px; border-radius: 9999px; font-weight: 600;">
                  ${c}
                </span>
              `).join('')}
              ${session.hasSevere ? `
                <span style="font-size: 0.8rem; background: var(--warning-wash); color: var(--tertiary); padding: 4px 10px; border-radius: 9999px; font-weight: 700; border: 1px solid #fcd34d;">
                  ⚠️ Severe Barrier Warning Flagged
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Prescribed Products List -->
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--on-surface); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
              <span>Prescribed Regimen Items (${products.length})</span>
              <span style="color: var(--primary); font-weight: 800; font-size: 0.95rem;">Total: Rs. ${(session.totalEstimatedPrice || 0).toLocaleString()}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${products.length === 0 ? `
                <div style="padding: 1rem; text-align: center; color: var(--outline); font-size: 0.85rem; background: #f8fafc; border-radius: 8px;">
                  No specific products attached to snapshot.
                </div>
              ` : products.map((p, idx) => `
                <div style="border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 0.85rem 1rem; background: #ffffff;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <div>
                      <span style="font-size: 0.7rem; font-weight: 700; color: var(--secondary); text-transform: uppercase;">Step ${idx + 1} • ${p.category || p.category_name || 'Regimen'}</span>
                      <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem;">${p.name || p.product_name}</div>
                      ${p.brand ? `<div style="font-size: 0.75rem; color: var(--outline);">${p.brand}</div>` : ''}
                    </div>
                    <div style="font-weight: 800; color: var(--primary); font-size: 0.95rem;">
                      Rs. ${(Number(p.price) || 0).toLocaleString()}
                    </div>
                  </div>
                  ${p.instruction ? `
                    <div style="margin-top: 6px; font-size: 0.78rem; color: var(--on-surface-variant); background: #f8fafc; padding: 4px 8px; border-radius: 4px;">
                      <strong>Usage:</strong> ${p.instruction}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div style="padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
          <button class="btn-primary" id="closeSessionDetailBottomBtn" style="min-height: 40px; padding: 0 1.25rem; font-size: 0.9rem;">
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
