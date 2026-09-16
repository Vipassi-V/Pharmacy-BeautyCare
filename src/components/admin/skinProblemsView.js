import { adminStore } from '../../store/adminStore.js';

export function renderSkinProblemsView() {
  const { skinProblems } = adminStore;

  const rowsHtml = skinProblems.map((prob, idx) => {
    const isActive = prob.status === 'active';
    const isSevere = !!prob.isSevere;

    return `
      <tr style="border-bottom: 1px solid #e2e8f0; height: 72px;">
        <td style="padding: 0 1rem; font-weight: 700; color: var(--outline); font-size: 0.85rem; width: 40px;">
          #${idx + 1}
        </td>
        <td style="padding: 0 1rem;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${prob.image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=120&q=80'}" alt="${prob.title}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid #e2e8f0;" />
            <div>
              <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem;">${prob.title}</div>
              <div style="font-size: 0.8rem; color: var(--secondary);">${prob.nepaliTitle || ''}</div>
            </div>
          </div>
        </td>
        <td style="padding: 0 1rem;">
          <button 
            class="toggle-severe-btn" 
            data-prob-id="${prob.id}" 
            title="Click to toggle severe clinical condition flag"
            style="border: none; background: none; cursor: pointer; padding: 0;"
          >
            ${isSevere ? `
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; background: var(--warning-wash); color: var(--tertiary); border: 1px solid #fcd34d;">
                <span class="material-symbols-outlined" style="font-size: 14px;">priority_high</span>
                Severe Flag Active
              </span>
            ` : `
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background: #f1f5f9; color: var(--outline);">
                Standard OTC
              </span>
            `}
          </button>
        </td>
        <td style="padding: 0 1rem; font-size: 0.88rem; color: var(--on-surface-variant);">
          ${prob.linkedCount || 0} active products
        </td>
        <td style="padding: 0 1rem;">
          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; background: ${isActive ? '#f0fdf4' : '#f1f5f9'}; color: ${isActive ? 'var(--primary)' : 'var(--outline)'};">
            <span class="material-symbols-outlined" style="font-size: 14px;">${isActive ? 'check_circle' : 'do_not_disturb_on'}</span>
            ${isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td style="padding: 0 1rem; text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn-ghost edit-prob-btn" data-prob-id="${prob.id}" title="Edit Problem" style="padding: 6px; min-height: 36px; color: var(--primary);">
              <span class="material-symbols-outlined" style="font-size: 20px;">edit</span>
            </button>
            <button class="btn-ghost toggle-prob-status-btn" data-prob-id="${prob.id}" data-current-status="${prob.status}" title="${isActive ? 'Deactivate' : 'Activate'}" style="padding: 6px; min-height: 36px; color: ${isActive ? 'var(--tertiary)' : 'var(--secondary)'};">
              <span class="material-symbols-outlined" style="font-size: 20px;">${isActive ? 'visibility_off' : 'visibility'}</span>
            </button>
            <button class="btn-danger-ghost delete-prob-btn" data-prob-id="${prob.id}" title="Delete Problem" style="padding: 6px; min-height: 36px;">
              <span class="material-symbols-outlined" style="font-size: 20px;">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div>
      <!-- Header -->
      <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h1 class="font-headline-md" style="color: var(--on-surface);">Skin Problems & Conditions</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Configure skin concerns presented on tablet kiosks, altitude triggers, and severe consultation alerts.
          </p>
        </div>

        <button class="btn-primary" id="openAddProblemModalBtn" style="min-height: 48px; font-size: 0.95rem;">
          <span class="material-symbols-outlined">add</span>
          <span>Add Skin Problem</span>
        </button>
      </div>

      <!-- Table -->
      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1); overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; height: 48px;">
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">#</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Condition Details</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Clinical Severity</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Linked Products</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700;">Status</th>
              <th style="padding: 0 1rem; font-size: 0.78rem; color: var(--on-surface-variant); text-transform: uppercase; font-weight: 700; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${skinProblems.length > 0 ? rowsHtml : `
              <tr>
                <td colspan="6" style="padding: 3rem; text-align: center; color: var(--outline);">
                  <div style="font-weight: 700; color: var(--on-surface);">No Skin Problems Configured</div>
                  <div style="font-size: 0.85rem;">Click "Add Skin Problem" to create your first condition tile.</div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Add / Edit Skin Problem Modal
export function renderSkinProblemModal(problem = null) {
  const isEdit = !!problem;

  return `
    <div class="modal-backdrop" id="problemFormModalBackdrop">
      <div class="modal-dialog" style="max-width: 640px; max-height: 90vh; overflow-y: auto;">
        <div style="padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #ffffff; z-index: 10;">
          <h3 class="font-headline-sm" style="color: var(--on-surface);">
            ${isEdit ? 'Edit Skin Problem' : 'Add New Skin Problem'}
          </h3>
          <button class="btn-ghost" id="closeProblemModalBtn" style="padding: 6px; min-height: 36px;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="problemModalForm" style="padding: 1.5rem;">
          <input type="hidden" id="probFormId" value="${problem ? problem.id : ''}" />

          <div class="form-group">
            <label class="form-label" for="probFormTitle">Condition Title (English) <span style="color: var(--error);">*</span></label>
            <input type="text" id="probFormTitle" class="form-input" placeholder="e.g. High Altitude UV Damage & Melasma" value="${problem ? problem.title : ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="probFormNepaliTitle">Nepali Name / Translation</label>
            <input type="text" id="probFormNepaliTitle" class="form-input" placeholder="e.g. घामको डढेलो र कालो पोतो" value="${problem ? problem.nepaliTitle || '' : ''}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="probFormImageUrl">Image URL (or upload)</label>
            <div style="display: flex; gap: 8px;">
              <input type="url" id="probFormImageUrl" class="form-input" placeholder="https://..." value="${problem ? problem.image || '' : ''}" style="flex: 1;" />
              <button type="button" class="btn-secondary" id="probImageSampleBtn" style="min-height: 56px; padding: 0 1rem; font-size: 0.85rem;">
                Sample
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="probFormSummary">Short Summary (Shown on Kiosk tile) <span style="color: var(--error);">*</span></label>
            <input type="text" id="probFormSummary" class="form-input" placeholder="Brief 1-2 sentence description" value="${problem ? problem.summary : ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="probFormDescription">Full Clinical Details (Shown when expanded) <span style="color: var(--error);">*</span></label>
            <textarea id="probFormDescription" class="form-input" rows="4" style="height: auto; padding: 12px;" required placeholder="Detailed clinical etiology, active ingredient targets, and precautions...">${problem ? problem.description : ''}</textarea>
          </div>

          <!-- Severe Condition Switch -->
          <div style="background: var(--warning-wash-light); border: 1px solid #fcd34d; border-radius: var(--radius-lg); padding: 1rem; margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
              <span class="material-symbols-outlined" style="color: var(--tertiary); font-size: 24px; margin-top: 2px;">warning</span>
              <div>
                <div class="font-label-md" style="color: var(--tertiary);">Mark as Severe Clinical Condition</div>
                <div class="font-body-sm" style="color: #78350f; font-size: 0.8rem;">
                  Triggers the amber Pharmacist Consultation Advisory banner on the customer recommendations page.
                </div>
              </div>
            </div>
            <input type="checkbox" id="probFormIsSevere" ${problem && problem.isSevere ? 'checked' : ''} style="width: 22px; height: 22px; accent-color: var(--tertiary-container); cursor: pointer;" />
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.75rem;">
            <button type="button" class="btn-ghost" id="cancelProbFormBtn" style="flex: 1; border: 1.5px solid #cbd5e1;">Cancel</button>
            <button type="submit" class="btn-primary" style="flex: 1.2;">
              <span>${isEdit ? 'Save Changes' : 'Create Skin Problem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
