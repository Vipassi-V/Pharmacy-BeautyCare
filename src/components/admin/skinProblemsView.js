// src/components/admin/skinProblemsView.js
// Admin Skin Problems View & Add/Edit Modal with Client-Side WebP Processing.

import { adminStore } from '../../store/adminStore.js';

export function renderSkinProblemsView() {
  const { skinProblems } = adminStore;

  const rowsHtml = skinProblems.map((prob, idx) => {
    const isActive = prob.status === 'active';
    const isSevere = !!(prob.isSevere || prob.is_severe);

    return `
      <tr>
        <td style="font-weight: 700; color: var(--outline); font-size: 0.85rem; width: 40px;">
          #${idx + 1}
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${prob.image || prob.image_path || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=120&q=80'}" alt="${prob.title || prob.name}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid #e2e8f0; flex-shrink: 0;" />
            <div>
              <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem;">${prob.title || prob.name}</div>
              <div style="font-size: 0.8rem; color: var(--secondary);">${prob.nepaliTitle || ''}</div>
            </div>
          </div>
        </td>
        <td>
          <button 
            class="toggle-severe-btn" 
            data-prob-id="${prob.id}" 
            title="Click to toggle severe clinical advisory"
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
        <td style="font-size: 0.88rem; color: var(--on-surface-variant);">
          ${prob.linkedCount || 0} linked products
        </td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; background: ${isActive ? '#f0fdf4' : '#f1f5f9'}; color: ${isActive ? 'var(--primary)' : 'var(--outline)'};">
            <span class="material-symbols-outlined" style="font-size: 14px;">${isActive ? 'check_circle' : 'do_not_disturb_on'}</span>
            ${isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td style="text-align: right;">
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
      <div style="margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h1 class="font-headline-md" style="color: var(--on-surface);">Skin Problems & Conditions</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Configure skin concerns presented on tablet kiosks, altitude triggers, and severe consultation alerts.
          </p>
        </div>

        <button class="btn-primary" id="openAddProblemModalBtn" style="min-height: 46px; font-size: 0.95rem;">
          <span class="material-symbols-outlined">add</span>
          <span>Add Skin Problem</span>
        </button>
      </div>

      <!-- Table -->
      <div class="table-responsive-wrapper">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Condition Details</th>
              <th>Clinical Severity</th>
              <th>Linked Products</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
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
  const defaultImg = problem ? (problem.image || problem.image_path || '') : '';

  return `
    <div class="modal-backdrop" id="problemFormModalBackdrop">
      <div class="modal-dialog" style="max-width: 640px;">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <h3 class="font-headline-sm" style="color: var(--on-surface); margin: 0;">
            ${isEdit ? 'Edit Skin Problem' : 'Add New Skin Problem'}
          </h3>
          <button class="btn-ghost" id="closeProblemModalBtn" style="padding: 6px; min-height: 36px;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="problemModalForm" style="padding: 1.5rem; overflow-y: auto;">
          <input type="hidden" id="probFormId" value="${problem ? problem.id : ''}" />

          <div class="form-group">
            <label class="form-label" for="probFormTitle">Condition Title (English) <span style="color: var(--error);">*</span></label>
            <input type="text" id="probFormTitle" class="form-input" placeholder="e.g. High Altitude UV Damage & Melasma" value="${problem ? (problem.title || problem.name || '') : ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="probFormNepaliTitle">Nepali Name / Translation</label>
            <input type="text" id="probFormNepaliTitle" class="form-input" placeholder="e.g. घामको डढेलो र कालो पोतो" value="${problem ? (problem.nepaliTitle || '') : ''}" />
          </div>

          <!-- Condition Image with WebP Processing -->
          <div class="form-group">
            <label class="form-label" for="probFormImageUrl">Condition Cover Image (Auto-WebP, max 800&times;800px, &le; 250 KB)</label>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
              <input type="url" id="probFormImageUrl" class="form-input" placeholder="https://..." value="${defaultImg}" style="flex: 1;" />
              <input type="file" id="probFileInput" accept="image/jpeg, image/jpg, image/png, image/webp" style="display: none;" />
              <button type="button" class="btn-primary" id="probUploadFileBtn" style="min-height: 52px; padding: 0 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;">
                <span class="material-symbols-outlined" style="font-size: 18px;">cloud_upload</span>
                <span>Upload</span>
              </button>
              <button type="button" class="btn-ghost" id="probImageSampleBtn" style="min-height: 52px; padding: 0 0.75rem; font-size: 0.85rem; border: 1.5px solid #cbd5e1;">
                Sample
              </button>
            </div>
            
            <div id="probImageFeedback" style="font-size: 0.75rem; margin-top: 4px; color: var(--outline);">
              <span>Select JPEG, PNG, or WebP. Converted client-side before upload to Supabase.</span>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
              <button type="button" id="probClearImageBtn" style="background: none; border: none; color: var(--error); cursor: pointer; font-size: 0.75rem; padding: 0;">Remove Image</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="probFormSummary">Short Summary (Shown on Kiosk Card) <span style="color: var(--error);">*</span></label>
            <textarea id="probFormSummary" class="form-input" rows="2" style="height: auto; padding: 10px;" placeholder="Brief clinical overview for patients..." required>${problem ? (problem.summary || problem.description || '') : ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="probFormDescription">Full Clinical Description (Expanded details)</label>
            <textarea id="probFormDescription" class="form-input" rows="3" style="height: auto; padding: 10px;" placeholder="Detailed pathophysiology and treatment considerations...">${problem ? (problem.description || '') : ''}</textarea>
          </div>

          <div class="form-group" style="margin-top: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" id="probFormIsSevere" ${problem && (problem.isSevere || problem.is_severe) ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--tertiary);" />
              <div>
                <span class="font-label-md" style="color: var(--tertiary);">Flag as Severe Condition (Trigger Pharmacist Advisory)</span>
                <div class="font-body-sm" style="color: var(--outline); font-size: 0.78rem;">
                  Displays prominent amber consultation banner to caution patient against harsh active ingredients.
                </div>
              </div>
            </label>
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
