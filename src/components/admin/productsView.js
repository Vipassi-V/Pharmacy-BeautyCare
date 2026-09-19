import { adminStore } from '../../store/adminStore.js';

export function renderProductsView() {
  const { products, categories, skinProblems } = adminStore;

  const rowsHtml = products.map((prod, idx) => {
    const isActive = prod.status === 'active';
    const category = categories.find(c => c.id === prod.categoryId);
    const categoryName = category ? category.name : prod.categoryId;

    const linkedConcernsHtml = (prod.suitableConcerns || []).map(cid => {
      const concern = skinProblems.find(p => p.id === cid);
      return concern ? `<span style="font-size: 0.72rem; background: #eff4ff; color: var(--secondary); padding: 1px 6px; border-radius: 4px; font-weight: 600; display: inline-block; margin: 1px;">${concern.title.split(' ')[0]}...</span>` : '';
    }).join('');

    return `
      <tr>
        <td style="font-weight: 700; color: var(--outline); font-size: 0.85rem; width: 40px;">
          #${idx + 1}
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${prod.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=120&q=80'}" alt="${prod.name}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid #e2e8f0; flex-shrink: 0;" />
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--secondary); text-transform: uppercase;">${prod.brand}</div>
              <div style="font-weight: 700; color: var(--on-surface); font-size: 0.95rem; line-height: 1.25;">${prod.name}</div>
              <div style="font-size: 0.75rem; color: var(--outline); margin-top: 2px;">
                ${(prod.badges || []).join(' • ')}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size: 0.8rem; background: #f0fdf4; color: var(--primary-container); font-weight: 600; padding: 3px 8px; border-radius: 9999px;">
            ${categoryName}
          </span>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">
            Rs. ${(prod.price || 0).toLocaleString()}
          </div>
          <div style="font-size: 0.72rem; color: var(--outline);">NPR In-Store</div>
        </td>
        <td style="max-width: 180px;">
          <div style="display: flex; flex-wrap: wrap; gap: 2px;">
            ${linkedConcernsHtml || '<span style="font-size: 0.75rem; color: var(--outline);">All skin types</span>'}
          </div>
        </td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; background: ${isActive ? '#f0fdf4' : '#f1f5f9'}; color: ${isActive ? 'var(--primary)' : 'var(--outline)'};">
            <span class="material-symbols-outlined" style="font-size: 14px;">${isActive ? 'check_circle' : 'do_not_disturb_on'}</span>
            ${isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="btn-ghost edit-prod-btn" data-prod-id="${prod.id}" title="Edit Product" style="padding: 6px; min-height: 36px; color: var(--primary);">
              <span class="material-symbols-outlined" style="font-size: 20px;">edit</span>
            </button>
            <button class="btn-ghost toggle-prod-status-btn" data-prod-id="${prod.id}" data-current-status="${prod.status}" title="${isActive ? 'Deactivate' : 'Activate'}" style="padding: 6px; min-height: 36px; color: ${isActive ? 'var(--tertiary)' : 'var(--secondary)'};">
              <span class="material-symbols-outlined" style="font-size: 20px;">${isActive ? 'visibility_off' : 'visibility'}</span>
            </button>
            <button class="btn-danger-ghost delete-prod-btn" data-prod-id="${prod.id}" title="Delete Product" style="padding: 6px; min-height: 36px;">
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
          <h1 class="font-headline-md" style="color: var(--on-surface);">Product Catalog & Recommendations</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Maintain pharmacy formulations, pricing in NPR, and multi-link condition associations.
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-secondary" id="openImportWorkflowBtn" style="min-height: 46px; font-size: 0.95rem;">
            <span class="material-symbols-outlined">upload_file</span>
            <span>Excel / CSV Import</span>
          </button>
          <button class="btn-primary" id="openAddProductModalBtn" style="min-height: 46px; font-size: 0.95rem;">
            <span class="material-symbols-outlined">add</span>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <!-- Products Table -->
      <div class="table-responsive-wrapper">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product & Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Linked Problems</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.length > 0 ? rowsHtml : `
              <tr>
                <td colspan="7" style="padding: 3rem; text-align: center; color: var(--outline);">
                  <div style="font-weight: 700; color: var(--on-surface);">No Products Found</div>
                  <div style="font-size: 0.85rem;">Click "Add New Product" or use "Excel / CSV Import" to populate your catalog.</div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Add / Edit Product Modal with Live Kiosk Simulator Preview
export function renderProductModal(product = null) {
  const { categories, skinProblems } = adminStore;
  const isEdit = !!product;

  const defaultImg = product ? product.image : "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80";

  return `
    <div class="modal-backdrop" id="productFormModalBackdrop">
      <div class="modal-dialog" style="max-width: 960px;">
        <!-- Header -->
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #ffffff; z-index: 20;">
          <div>
            <h3 class="font-headline-sm" style="color: var(--on-surface); margin: 0;">
              ${isEdit ? 'Edit Clinical Product' : 'Add New Product & Live Preview'}
            </h3>
            <p class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.8rem; margin: 0;">
              See how this card renders on customer tablet kiosks in real time as you fill the fields.
            </p>
          </div>
          <button class="btn-ghost" id="closeProductModalBtn" style="padding: 6px; min-height: 36px;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; padding: 1.5rem; overflow-y: auto;">
          <!-- Left: Input Form -->
          <form id="productModalForm">
            <input type="hidden" id="prodFormId" value="${product ? product.id : ''}" />

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="prodFormBrand">Brand Name <span style="color: var(--error);">*</span></label>
                <input type="text" id="prodFormBrand" class="form-input" placeholder="e.g. CeraVe, The Ordinary" value="${product ? product.brand : ''}" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="prodFormCategory">Assigned Category <span style="color: var(--error);">*</span></label>
                <select id="prodFormCategory" class="form-input" style="height: 52px;" required>
                  ${categories.map(c => `
                    <option value="${c.id}" ${product && product.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="prodFormName">Product Name <span style="color: var(--error);">*</span></label>
              <input type="text" id="prodFormName" class="form-input" placeholder="e.g. Hydrating Gentle Foaming Cleanser" value="${product ? product.name : ''}" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="prodFormPrice">Price (NPR Rs.) <span style="color: var(--error);">*</span></label>
                <input type="number" id="prodFormPrice" class="form-input" placeholder="1850" value="${product ? product.price : '1500'}" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="prodFormBadges">Badges / Highlights (comma separated)</label>
                <input type="text" id="prodFormBadges" class="form-input" placeholder="SPF 50+, Ceramide 3" value="${product ? (product.badges || []).join(', ') : 'Hypoallergenic, Fragrance Free'}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="prodFormImage">Product Image (Supabase Storage / URL)</label>
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                <input type="url" id="prodFormImage" class="form-input" placeholder="https://..." value="${defaultImg}" style="flex: 1;" />
                <input type="file" id="prodFileInput" accept="image/*" style="display: none;" />
                <button type="button" class="btn-secondary" id="prodUploadFileBtn" style="min-height: 52px; padding: 0 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">cloud_upload</span>
                  <span>Upload</span>
                </button>
                <button type="button" class="btn-ghost" id="prodImageSampleBtn" style="min-height: 52px; padding: 0 0.75rem; font-size: 0.85rem; border: 1.5px solid #cbd5e1;">
                  Sample
                </button>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--outline);">
                <span>Upload to Supabase Storage bucket <code>product-images</code> or paste external URL</span>
                <button type="button" id="prodClearImageBtn" style="background: none; border: none; color: var(--error); cursor: pointer; font-size: 0.75rem; padding: 0;">Remove Image</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="prodFormInstruction">Application & Dosage Instructions <span style="color: var(--error);">*</span></label>
              <textarea id="prodFormInstruction" class="form-input" rows="3" style="height: auto; padding: 10px;" placeholder="Dispense 1-2 drops, massage over damp skin..." required>${product ? product.instruction : 'Apply 2-3 drops onto cleansed face every morning and night.'}</textarea>
            </div>

            <!-- Linked Problems Multi-select -->
            <div class="form-group">
              <label class="form-label">Linked Skin Problems (Multi-Select)</label>
              <div style="max-height: 140px; overflow-y: auto; border: 1.5px solid #cbd5e1; border-radius: var(--radius-md); padding: 8px; background: #ffffff; display: flex; flex-direction: column; gap: 6px;">
                ${skinProblems.map(prob => {
                  const isChecked = product && product.suitableConcerns && product.suitableConcerns.includes(prob.id);
                  return `
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--on-surface); cursor: pointer; padding: 4px;">
                      <input type="checkbox" name="prodLinkedConcerns" value="${prob.id}" ${isChecked ? 'checked' : ''} style="accent-color: var(--primary-container); width: 18px; height: 18px;" />
                      <span>${prob.title}</span>
                      ${prob.isSevere ? '<span style="font-size: 0.7rem; background: var(--warning-wash); color: var(--tertiary); padding: 1px 6px; border-radius: 4px; font-weight: 700;">Severe</span>' : ''}
                    </label>
                  `;
                }).join('')}
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
              <button type="button" class="btn-ghost" id="cancelProdFormBtn" style="flex: 1; border: 1.5px solid #cbd5e1;">Cancel</button>
              <button type="submit" class="btn-primary" style="flex: 1.2;">
                <span>${isEdit ? 'Save Changes' : 'Add to Catalog'}</span>
              </button>
            </div>
          </form>

          <!-- Right: Real-time Live Kiosk Card Simulator -->
          <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: var(--radius-xl); padding: 1.25rem; display: flex; flex-direction: column;">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">tablet_mac</span>
              Live Tablet Card Simulator
            </div>

            <div class="product-card" id="liveCardSimulator" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-level-1);">
              <img id="simCardImg" src="${defaultImg}" alt="Preview" style="width: 100%; aspect-ratio: 4 / 3; max-height: 180px; object-fit: cover; background: #f1f5f9;" />
              <div style="padding: 1rem; display: flex; flex-direction: column; gap: 6px;">
                <div id="simCardBrand" class="font-label-sm" style="color: var(--secondary); text-transform: uppercase;">
                  ${product ? product.brand : 'BRAND NAME'}
                </div>
                <div id="simCardName" class="font-headline-sm" style="color: var(--on-surface); font-size: 1rem; line-height: 1.3;">
                  ${product ? product.name : 'Product Title Preview'}
                </div>
                <div id="simCardBadges" class="product-badges">
                  <span class="product-badge">Hypoallergenic</span>
                </div>
                <div class="product-instruction-box" style="font-size: 0.78rem; padding: 6px 8px;">
                  <strong style="color: var(--secondary);">Usage:</strong> 
                  <span id="simCardInstruction">${product ? product.instruction : 'Apply smoothly every morning.'}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                  <div id="simCardPrice" class="product-price-tag" style="font-size: 1.1rem;">
                    Rs. ${product ? (product.price || 0).toLocaleString() : '1,500'}
                  </div>
                  <span style="font-size: 0.75rem; background: #f0fdf4; color: var(--primary); padding: 2px 8px; border-radius: 9999px; font-weight: 600;">
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
