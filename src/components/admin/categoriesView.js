import { adminStore } from '../../store/adminStore.js';

export function renderCategoriesView() {
  const { categories } = adminStore;

  const rowsHtml = categories.map((cat, idx) => {
    const isActive = cat.status === 'active';
    return `
      <tr>
        <td style="font-weight: 700; color: var(--outline); font-size: 0.85rem; width: 48px;">
          #${idx + 1}
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff4ff; color: var(--secondary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-symbols-outlined" style="font-size: 20px;">${cat.icon || 'category'}</span>
            </div>
            <div>
              <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem;">${cat.name}</div>
              <div style="font-size: 0.78rem; color: var(--outline);">${cat.id}</div>
            </div>
          </div>
        </td>
        <td style="font-size: 0.9rem; color: var(--on-surface-variant);">
          ${cat.productCount || 0} active products
        </td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; background: ${isActive ? '#f0fdf4' : '#f1f5f9'}; color: ${isActive ? 'var(--primary)' : 'var(--outline)'};">
            <span class="material-symbols-outlined" style="font-size: 14px;">${isActive ? 'check_circle' : 'do_not_disturb_on'}</span>
            ${isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn-ghost edit-cat-btn" data-cat-id="${cat.id}" title="Edit Category" style="padding: 6px; min-height: 36px; color: var(--primary);">
              <span class="material-symbols-outlined" style="font-size: 20px;">edit</span>
            </button>
            <button class="btn-ghost toggle-cat-status-btn" data-cat-id="${cat.id}" data-current-status="${cat.status}" title="${isActive ? 'Deactivate' : 'Activate'}" style="padding: 6px; min-height: 36px; color: ${isActive ? 'var(--tertiary)' : 'var(--secondary)'};">
              <span class="material-symbols-outlined" style="font-size: 20px;">${isActive ? 'visibility_off' : 'visibility'}</span>
            </button>
            <button class="btn-danger-ghost delete-cat-btn" data-cat-id="${cat.id}" title="Delete Category" style="padding: 6px; min-height: 36px;">
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
          <h1 class="font-headline-md" style="color: var(--on-surface);">Product Categories</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Manage clinical category groupings displayed on customer kiosks and recommendation builders.
          </p>
        </div>

        <button class="btn-primary" id="openAddCategoryModalBtn" style="min-height: 46px; font-size: 0.95rem;">
          <span class="material-symbols-outlined">add</span>
          <span>Add New Category</span>
        </button>
      </div>

      <!-- Categories Table Container -->
      <div class="table-responsive-wrapper">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Products Linked</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${categories.length > 0 ? rowsHtml : `
              <tr>
                <td colspan="5" style="padding: 3rem; text-align: center; color: var(--outline);">
                  <div style="width: 52px; height: 52px; border-radius: 50%; background: #eff4ff; color: var(--secondary); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
                    <span class="material-symbols-outlined" style="font-size: 26px;">category</span>
                  </div>
                  <div style="font-weight: 700; color: var(--on-surface);">No Categories Found</div>
                  <div style="font-size: 0.85rem;">Click "Add New Category" to create your first clinical category.</div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Category Add / Edit Modal Form
export function renderCategoryModal(category = null) {
  const isEdit = !!category;
  const icons = ['soap', 'science', 'spa', 'wb_sunny', 'healing', 'medication', 'water_drop', 'sanitizer', 'local_pharmacy'];

  return `
    <div class="modal-backdrop" id="categoryFormModalBackdrop">
      <div class="modal-dialog" style="max-width: 480px;">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <h3 class="font-headline-sm" style="color: var(--on-surface); margin: 0;">
            ${isEdit ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button class="btn-ghost" id="closeCategoryModalBtn" style="padding: 6px; min-height: 36px;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="categoryModalForm" style="padding: 1.5rem;">
          <input type="hidden" id="catFormId" value="${category ? category.id : ''}" />

          <div class="form-group">
            <label class="form-label" for="catFormName">Category Name <span style="color: var(--error);">*</span></label>
            <input type="text" id="catFormName" class="form-input" placeholder="e.g. Cleansers & Face Wash" value="${category ? category.name : ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="catFormIcon">Material Icon Tag</label>
            <select id="catFormIcon" class="form-input" style="height: 52px;">
              ${icons.map(ic => `
                <option value="${ic}" ${category && category.icon === ic ? 'selected' : ''}>${ic}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="catFormOrder">Display Order (Sorting)</label>
            <input type="number" id="catFormOrder" class="form-input" placeholder="1" value="${category ? category.order || 1 : 1}" />
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.75rem;">
            <button type="button" class="btn-ghost" id="cancelCatFormBtn" style="flex: 1; border: 1.5px solid #cbd5e1;">Cancel</button>
            <button type="submit" class="btn-primary" style="flex: 1.2;">
              <span>${isEdit ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
