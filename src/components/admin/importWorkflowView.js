// src/components/admin/importWorkflowView.js
// Bulk Product Import Workflow (Excel / CSV) with Two-Stage Validation & Execution.

import { adminStore } from '../../store/adminStore.js';

export function renderImportWorkflowView(importState = null) {
  const { categories, skinProblems } = adminStore;
  const isParsed = !!importState && !!importState.rows;
  const isCompleted = !!importState && !!importState.importCompleted;

  const rows = isParsed ? importState.rows : [];
  const validRows = isParsed ? rows.filter(r => r.isValid) : [];
  const invalidRows = isParsed ? rows.filter(r => !r.isValid) : [];
  const hasErrors = invalidRows.length > 0;

  return `
    <div>
      <!-- Header -->
      <div style="margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h1 class="font-headline-md" style="color: var(--on-surface);">Bulk Product Import (Excel / CSV)</h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Download the official 7-column schema template, upload your product spreadsheet, inspect validation errors, and confirm catalog additions.
          </p>
        </div>

        <button class="btn-secondary" id="downloadCsvTemplateBtn" style="min-height: 46px; font-size: 0.95rem;">
          <span class="material-symbols-outlined">download</span>
          <span>Download Excel / CSV Template</span>
        </button>
      </div>

      <!-- Import Workflow Steps -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
        
        <!-- Stage 2 Completed Results Banner (if finished) -->
        ${isCompleted ? `
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #86efac; padding: 2rem; box-shadow: var(--shadow-level-1);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: #f0fdf4; color: var(--primary); display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 28px;">task_alt</span>
              </div>
              <div>
                <h3 class="font-headline-sm" style="color: var(--primary); margin: 0;">Stage 2: Import Completed Successfully</h3>
                <p class="font-body-sm" style="color: var(--on-surface-variant); margin: 0;">
                  Imported <strong>${importState.successfulRowsCount || 0}</strong> products into catalog.
                </p>
              </div>
            </div>

            ${importState.failedRowsCount > 0 ? `
              <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 1.25rem; font-size: 0.85rem; color: var(--error);">
                <strong>Notice:</strong> ${importState.failedRowsCount} row(s) encountered database insertion errors and were skipped.
              </div>
            ` : ''}

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn-primary" id="viewCatalogAfterImportBtn">
                <span class="material-symbols-outlined">inventory_2</span>
                <span>View Product Catalog</span>
              </button>
              <button class="btn-ghost" id="importAnotherFileBtn" style="border: 1.5px solid #cbd5e1;">
                <span class="material-symbols-outlined">upload_file</span>
                <span>Import Another File</span>
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Stage 1 Step 1: Dropzone File Upload -->
        ${!isCompleted ? `
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">upload_file</span>
              <span>Step 1: Upload Product Spreadsheet (.xlsx / .csv)</span>
            </div>

            <div id="csvDropzone" style="border: 2px dashed #cbd5e1; border-radius: var(--radius-xl); padding: 2.5rem 1.5rem; text-align: center; background: #f8fafc; cursor: pointer; transition: all 0.2s ease;">
              <input type="file" id="csvFileInput" accept=".csv, .xlsx, .xls, .txt" style="display: none;" />
              <div style="width: 56px; height: 56px; border-radius: 50%; background: #eff4ff; color: var(--secondary); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
                <span class="material-symbols-outlined" style="font-size: 28px;">cloud_upload</span>
              </div>
              <div class="font-headline-sm" style="color: var(--on-surface); font-size: 1.05rem; margin-bottom: 0.25rem;">
                ${isParsed ? `Loaded: <strong>${importState.filename || 'Product File'}</strong> (Click to change file)` : 'Click to select or drag &amp; drop your spreadsheet here'}
              </div>
              <div class="font-body-sm" style="color: var(--on-surface-variant); max-width: 520px; margin: 0 auto 1rem; font-size: 0.82rem;">
                Supports standard CSV and Excel exports with 7 required headers: <code>name, brand, category, price, instruction, linked_skin_problems, is_active</code>.
              </div>
              <button type="button" class="btn-primary" id="selectFileBtn" style="min-height: 40px; padding: 0 1.25rem; font-size: 0.85rem;">
                Browse Spreadsheet
              </button>
            </div>

            <!-- Images not imported notice -->
            <div style="margin-top: 1rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.82rem; color: #92400e; display: flex; align-items: flex-start; gap: 8px;">
              <span class="material-symbols-outlined" style="font-size: 18px; flex-shrink: 0; margin-top: 1px;">image_not_supported</span>
              <span><strong>Product images are not imported from Excel.</strong> Upload each product image manually after importing.</span>
            </div>
          </div>
        ` : ''}

        <!-- Stage 1 Step 2: Validation Preview & Summary (if parsed) -->
        ${isParsed && !isCompleted ? `
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.5rem; box-shadow: var(--shadow-level-1);">
            
            <!-- Summary Metric Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem;">
                <div style="font-size: 0.75rem; color: var(--outline); text-transform: uppercase; font-weight: 700;">Total Rows</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--on-surface); margin-top: 2px;">${rows.length}</div>
              </div>

              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-lg); padding: 1rem;">
                <div style="font-size: 0.75rem; color: var(--primary); text-transform: uppercase; font-weight: 700;">Valid Rows</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-top: 2px;">${validRows.length}</div>
              </div>

              <div style="background: ${hasErrors ? '#fff1f2' : '#f8fafc'}; border: 1px solid ${hasErrors ? '#fecdd3' : '#e2e8f0'}; border-radius: var(--radius-lg); padding: 1rem;">
                <div style="font-size: 0.75rem; color: ${hasErrors ? 'var(--error)' : 'var(--outline)'}; text-transform: uppercase; font-weight: 700;">Invalid Rows</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: ${hasErrors ? 'var(--error)' : 'var(--outline)'}; margin-top: 2px;">${invalidRows.length}</div>
              </div>

              <div style="background: #eff4ff; border: 1px solid #bfdbfe; border-radius: var(--radius-lg); padding: 1rem;">
                <div style="font-size: 0.75rem; color: var(--secondary); text-transform: uppercase; font-weight: 700;">DB Categories</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--secondary); margin-top: 2px;">${categories.length}</div>
              </div>
            </div>

            <!-- Validation Warnings & Available Entities Reference -->
            ${importState.unknownCategories && importState.unknownCategories.length > 0 ? `
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 1rem; font-size: 0.82rem; color: #92400e;">
                <div style="font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">warning</span>
                  <span>Unrecognized Category Names in File:</span>
                </div>
                <div style="margin-bottom: 6px;">
                  ${importState.unknownCategories.map(c => `<span style="background: #fef3c7; color: #78350f; padding: 2px 8px; border-radius: 4px; margin-right: 4px; font-weight: 700;">${c}</span>`).join('')}
                </div>
                <div>
                  <strong>Available in Database:</strong> ${categories.map(c => `<span style="background: #ecfdf5; color: var(--primary); padding: 2px 6px; border-radius: 4px; margin-right: 4px;">${c.name}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${importState.unknownSkinProblems && importState.unknownSkinProblems.length > 0 ? `
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 1rem; font-size: 0.82rem; color: #92400e;">
                <div style="font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 18px;">healing</span>
                  <span>Unrecognized Skin Problem Names in File:</span>
                </div>
                <div style="margin-bottom: 6px;">
                  ${importState.unknownSkinProblems.map(p => `<span style="background: #fef3c7; color: #78350f; padding: 2px 8px; border-radius: 4px; margin-right: 4px; font-weight: 700;">${p}</span>`).join('')}
                </div>
                <div>
                  <strong>Available in Database:</strong> ${skinProblems.map(p => `<span style="background: #eff4ff; color: var(--secondary); padding: 2px 6px; border-radius: 4px; margin-right: 4px;">${p.title || p.name}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Stage 1 Actions -->
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; padding-top: 0.5rem; border-top: 1px solid #f1f5f9;">
              <div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--on-surface);">
                  Stage 1: Validation Preview (${rows.length} Rows Evaluated)
                </div>
                <div class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.78rem;">
                  No records have been written to the database yet. Confirming below will insert valid rows and create condition links.
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button class="btn-ghost" id="clearImportBtn" style="border: 1.5px solid #cbd5e1;">Clear</button>
                <button class="btn-primary" id="confirmBulkImportBtn" ${validRows.length === 0 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>
                  <span class="material-symbols-outlined">done_all</span>
                  <span>Confirm Import (${validRows.length} Valid Products)</span>
                </button>
              </div>
            </div>

            <!-- Table of Rows -->
            <div class="table-responsive-wrapper">
              <table class="admin-data-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Status</th>
                    <th>Product &amp; Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Linked Problems</th>
                    <th>Errors / Validation Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((r, i) => `
                    <tr style="background: ${r.isValid ? '#ffffff' : '#fff1f2'};">
                      <td style="font-weight: 700; color: var(--outline); width: 45px;">#${r.rowIndex || (i + 1)}</td>
                      <td>
                        ${r.isValid ? `
                          <span style="display: inline-flex; align-items: center; gap: 2px; color: var(--primary); background: #f0fdf4; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.72rem;">
                            <span class="material-symbols-outlined" style="font-size: 14px;">check</span>
                            Valid
                          </span>
                        ` : `
                          <span style="display: inline-flex; align-items: center; gap: 2px; color: var(--error); background: #fee2e2; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.72rem;">
                            <span class="material-symbols-outlined" style="font-size: 14px;">error</span>
                            Error
                          </span>
                        `}
                      </td>
                      <td>
                        <div style="font-weight: 700; color: var(--on-surface); font-size: 0.9rem;">${r.name || '<em style="color:var(--error);">[Missing Name]</em>'}</div>
                        <div style="font-size: 0.75rem; color: var(--secondary); text-transform: uppercase;">${r.brand || '<em style="color:var(--error);">[Missing Brand]</em>'}</div>
                      </td>
                      <td>
                        ${r.categoryId ? `
                          <span style="font-size: 0.78rem; background: #ecfdf5; color: var(--primary); font-weight: 600; padding: 2px 8px; border-radius: 9999px;">
                            ${r.categoryName || r.category}
                          </span>
                        ` : `
                          <span style="font-size: 0.78rem; background: #fee2e2; color: var(--error); font-weight: 600; padding: 2px 8px; border-radius: 9999px;">
                            ${r.category || '[None]'}
                          </span>
                        `}
                      </td>
                      <td style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">
                        Rs. ${(r.price || 0).toLocaleString()}
                      </td>
                      <td style="max-width: 180px;">
                        ${r.resolvedProblemNames && r.resolvedProblemNames.length > 0 ? `
                          <div style="display: flex; flex-wrap: wrap; gap: 2px;">
                            ${r.resolvedProblemNames.map(p => `<span style="font-size: 0.7rem; background: #eff4ff; color: var(--secondary); padding: 1px 6px; border-radius: 4px;">${p.split(' ')[0]}...</span>`).join('')}
                          </div>
                        ` : (r.linked_skin_problems_raw ? `<span style="font-size: 0.75rem; color: var(--error);">${r.linked_skin_problems_raw}</span>` : '<span style="font-size: 0.72rem; color: var(--outline);">None</span>')}
                      </td>
                      <td style="color: ${r.isValid ? 'var(--outline)' : 'var(--error)'}; font-size: 0.78rem; max-width: 240px; word-break: break-word;">
                        ${r.errors && r.errors.length > 0 ? `<strong>${r.errors.join(' • ')}</strong>` : (r.warnings && r.warnings.length > 0 ? `<span style="color: #92400e;">${r.warnings.join(' • ')}</span>` : 'Ready for database insertion')}
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
