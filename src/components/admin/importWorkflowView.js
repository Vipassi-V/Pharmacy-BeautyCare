import { adminStore } from '../../store/adminStore.js';

export function renderImportWorkflowView(importState = null) {
  const { categories, skinProblems } = adminStore;

  const sampleCsvContent = `"brand","name","categoryId","price","instruction","badges","linkedConcerns"
"CeraVe","Hydrating Facial Cleanser","face_wash",1850,"Massage 1 min on damp skin.","Ceramide, Non-comedogenic","mountain_uv_pigmentation, acute_barrier_breakdown"
"The Ordinary","Niacinamide 10% + Zinc 1%","serum",1650,"Apply 3 drops before creams.","Oil Control, Blemish Care","hormonal_inflammatory_acne"
"Biore","UV Aqua Rich Watery Essence SPF50+","sunscreen",1900,"Apply 2 fingers 15m prior to sun.","High Altitude SPF50, PA++++","mountain_uv_pigmentation"`;

  const parsedRows = importState ? importState.rows : [];
  const hasErrors = parsedRows.some(r => !r.isValid);

  return `
    <div>
      <!-- Header -->
      <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h1 class="font-headline-md" style="color: var(--on-surface);">Bulk Product Import (Excel / CSV)</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Download the pre-structured schema template, upload your file, validate errors, and confirm catalog additions.
          </p>
        </div>

        <button class="btn-secondary" id="downloadCsvTemplateBtn" style="min-height: 48px; font-size: 0.95rem;">
          <span class="material-symbols-outlined">download</span>
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      <!-- Import Workflow Steps -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
        <!-- Step 1 & 2: Dropzone Container -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-level-1);">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-outlined" style="font-size: 18px;">upload_file</span>
            Step 1: Upload Excel (.xlsx) or CSV (.csv) File
          </div>

          <div id="csvDropzone" style="border: 2px dashed #cbd5e1; border-radius: var(--radius-xl); padding: 3rem 1.5rem; text-align: center; background: #f8fafc; cursor: pointer; transition: all 0.2s ease;">
            <input type="file" id="csvFileInput" accept=".csv, .xlsx, .txt" style="display: none;" />
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #eff4ff; color: var(--secondary); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <span class="material-symbols-outlined" style="font-size: 32px;">cloud_upload</span>
            </div>
            <div class="font-headline-sm" style="color: var(--on-surface); font-size: 1.1rem; margin-bottom: 0.25rem;">
              Click to select or drag and drop your spreadsheet here
            </div>
            <div class="font-body-sm" style="color: var(--on-surface-variant); max-width: 420px; margin: 0 auto 1.25rem;">
              Supports UTF-8 CSV or standard Excel files with headers: <code>brand, name, categoryId, price, instruction</code>.
            </div>
            <button type="button" class="btn-primary" id="selectFileBtn" style="min-height: 44px; padding: 0 1.5rem;">
              Browse File
            </button>
          </div>
        </div>

        <!-- Step 3 & 4: Validation & Preview Table (if parsed) -->
        ${importState ? `
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.25rem;">
                  Step 2: Validation Preview (${parsedRows.length} Rows Detected)
                </div>
                <div class="font-body-sm" style="color: var(--on-surface-variant);">
                  ${hasErrors ? '<span style="color: var(--error); font-weight: 700;">Row errors detected.</span> Fix or remove invalid rows before importing.' : '<span style="color: var(--primary); font-weight: 700;">All rows valid!</span> Ready to import.'}
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem;">
                <button class="btn-ghost" id="clearImportBtn" style="border: 1.5px solid #cbd5e1;">Clear</button>
                <button class="btn-primary" id="confirmBulkImportBtn" ${hasErrors ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>
                  <span class="material-symbols-outlined">done_all</span>
                  <span>Confirm Import (${parsedRows.filter(r => r.isValid).length} Products)</span>
                </button>
              </div>
            </div>

            <!-- Table of rows -->
            <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: var(--radius-lg);">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; height: 44px;">
                    <th style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">Row</th>
                    <th style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">Status</th>
                    <th style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">Brand</th>
                    <th style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">Product Name</th>
                    <th style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">Category</th>
                    <th style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">Price</th>
                    <th style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">Errors / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${parsedRows.map((r, i) => `
                    <tr style="border-bottom: 1px solid #f1f5f9; height: 52px; background: ${r.isValid ? '#ffffff' : '#fff1f2'};">
                      <td style="padding: 0 0.75rem; font-weight: 700; color: var(--outline);">#${i + 1}</td>
                      <td style="padding: 0 0.75rem;">
                        ${r.isValid ? `
                          <span style="display: inline-flex; align-items: center; gap: 2px; color: var(--primary); background: #f0fdf4; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 0.72rem;">
                            <span class="material-symbols-outlined" style="font-size: 14px;">check</span>
                            Valid
                          </span>
                        ` : `
                          <span style="display: inline-flex; align-items: center; gap: 2px; color: var(--error); background: #fee2e2; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 0.72rem;">
                            <span class="material-symbols-outlined" style="font-size: 14px;">error</span>
                            Error
                          </span>
                        `}
                      </td>
                      <td style="padding: 0 0.75rem; font-weight: 600; color: var(--on-surface);">${r.brand || '—'}</td>
                      <td style="padding: 0 0.75rem; color: var(--on-surface);">${r.name || '—'}</td>
                      <td style="padding: 0 0.75rem; color: var(--secondary); font-weight: 600;">${r.categoryId || '—'}</td>
                      <td style="padding: 0 0.75rem; font-weight: 700; color: var(--primary);">Rs. ${r.price || 0}</td>
                      <td style="padding: 0 0.75rem; color: ${r.isValid ? 'var(--outline)' : 'var(--error)'}; font-size: 0.78rem;">
                        ${r.errors && r.errors.length > 0 ? r.errors.join(', ') : 'Ready to import'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
