// src/components/admin/settingsView.js
// Pharmacy & System Settings View with Dedicated Pharmacy Branding & Logo Management.

import { adminStore } from '../../store/adminStore.js';

export function renderSettingsView(logoUploadState = null) {
  const { settings } = adminStore;
  const currentLogo = settings.logoUrl;

  return `
    <div style="max-width: 860px;">
      <!-- Header -->
      <div style="margin-bottom: 2rem;">
        <h1 class="font-headline-md" style="color: var(--on-surface);">Pharmacy & System Settings</h1>
        <p class="font-body-sm" style="color: var(--on-surface-variant);">
          Configure clinic branding, high-altitude warning parameters, kiosk session timeouts, and verified administrator credentials.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Card 1: Pharmacy Branding & Logo Upload -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined" style="font-size: 22px;">palette</span>
            <span>Pharmacy Branding & Clinic Emblem</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: start;">
            <!-- Logo Preview Container -->
            <div>
              <label class="form-label" style="margin-bottom: 0.5rem; display: block;">Active Pharmacy Logo</label>
              <div id="settingsLogoPreviewBox" style="width: 100%; height: 160px; border-radius: var(--radius-lg); border: 1.5px dashed #cbd5e1; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; padding: 12px; box-sizing: border-box;">
                ${currentLogo ? `
                  <img id="activeLogoImg" src="${currentLogo}" alt="Pharmacy Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                ` : `
                  <div style="text-align: center; color: var(--outline);">
                    <span class="material-symbols-outlined" style="font-size: 40px; color: var(--outline-variant); margin-bottom: 4px;">image</span>
                    <div style="font-size: 0.82rem; font-weight: 600;">No Custom Logo Uploaded</div>
                    <div style="font-size: 0.72rem; color: var(--outline);">Kiosk displays default clinical emblem</div>
                  </div>
                `}
              </div>

              <div style="margin-top: 6px; font-size: 0.75rem; color: var(--outline); display: flex; justify-content: space-between;">
                <span>Bucket: <code>pharmacy-assets</code> &bull; <code>${settings.logoPath || 'No logo stored'}</code></span>
                ${settings.logoVersion ? `<span>v${settings.logoVersion}</span>` : ''}
              </div>
            </div>

            <!-- Upload / Replace / Remove Controls -->
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <div>
                <label class="form-label" style="margin-bottom: 0.5rem; display: block;">Manage Brand Asset</label>
                <div style="font-size: 0.82rem; color: var(--on-surface-variant); line-height: 1.4; margin-bottom: 1rem;">
                  Upload your clinic's horizontal emblem. The system automatically converts the file to <strong>WebP</strong> format, fits it within <strong>600 &times; 300 px</strong>, and maintains a maximum file size of <strong>150 KB</strong>.
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
                  <input type="file" id="pharmacyLogoFileInput" accept="image/jpeg, image/jpg, image/png, image/webp" style="display: none;" />
                  
                  <button type="button" class="btn-primary" id="selectLogoFileBtn" style="min-height: 44px; padding: 0 1.25rem; font-size: 0.88rem;">
                    <span class="material-symbols-outlined" style="font-size: 18px;">cloud_upload</span>
                    <span>${currentLogo ? 'Replace Logo' : 'Upload Logo'}</span>
                  </button>

                  ${currentLogo ? `
                    <button type="button" class="btn-danger-ghost" id="removeLogoBtn" style="min-height: 44px; padding: 0 1rem; font-size: 0.88rem;">
                      <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                      <span>Remove</span>
                    </button>
                  ` : ''}
                </div>

                <!-- Accepted Formats Notice -->
                <div style="background: #eff4ff; border-radius: var(--radius-md); padding: 8px 12px; font-size: 0.75rem; color: var(--secondary); display: flex; align-items: center; gap: 6px;">
                  <span class="material-symbols-outlined" style="font-size: 16px;">info</span>
                  <span>Accepted formats: <strong>JPEG, PNG, WebP</strong> (auto-converted to WebP, &le; 150 KB)</span>
                </div>
              </div>

              <!-- Processing / Upload Progress State Container -->
              <div id="logoProcessingFeedback" style="margin-top: 1rem;">
                ${logoUploadState ? `
                  <div style="padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.82rem; ${logoUploadState.error ? 'background: #fee2e2; color: var(--error); border: 1px solid #fca5a5;' : (logoUploadState.isDone ? 'background: #f0fdf4; color: var(--primary); border: 1px solid #86efac;' : 'background: #f8fafc; color: var(--primary-container); border: 1px solid #cbd5e1;')}">
                    <div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
                      ${logoUploadState.error ? `
                        <span class="material-symbols-outlined" style="font-size: 18px;">error</span>
                        <span>Upload Failed: ${logoUploadState.error}</span>
                      ` : (logoUploadState.isDone ? `
                        <span class="material-symbols-outlined" style="font-size: 18px;">check_circle</span>
                        <span>${logoUploadState.message || 'Logo successfully processed and updated!'}</span>
                      ` : `
                        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 18px;">sync</span>
                        <span>${logoUploadState.phase || 'Processing image...'}</span>
                      `)}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>

        <form id="adminSettingsForm" style="display: flex; flex-direction: column; gap: 2rem;">
          <!-- Card 2: Pharmacy Business Details -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 20px;">storefront</span>
              <span>1. Pharmacy Information</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="settingPharmacyName">Pharmacy Business Name</label>
                <input type="text" id="settingPharmacyName" class="form-input setting-input" value="${settings.pharmacyName || ''}" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="settingLeadPharmacist">Attending Pharmacist</label>
                <input type="text" id="settingLeadPharmacist" class="form-input setting-input" value="${settings.leadPharmacist || ''}" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="settingLocation">City & District Location</label>
                <input type="text" id="settingLocation" class="form-input setting-input" value="${settings.location || ''}" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="settingPhone">Contact Phone Number</label>
                <input type="text" id="settingPhone" class="form-input setting-input" value="${settings.phone || ''}" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="settingSubLocation">Street / Ward Address</label>
              <input type="text" id="settingSubLocation" class="form-input setting-input" value="${settings.subLocation || ''}" placeholder="e.g. Bishal Bazaar, Ward No. 3" />
            </div>
          </div>

          <!-- Card 3: Kiosk Welcome & Advisory Copy -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 20px;">message</span>
              <span>2. Welcome Greeting & Altitude Safeguard Texts</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="settingWelcomeTitle">Tablet Kiosk Welcome Header</label>
              <input type="text" id="settingWelcomeTitle" class="form-input setting-input" value="${settings.welcomeTitle || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="settingWelcomeSubtitle">Welcome Subtitle</label>
              <input type="text" id="settingWelcomeSubtitle" class="form-input setting-input" value="${settings.welcomeSubtitle || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="settingSevereWarningText">
                Severe Condition & Professional-Attention Advisory
              </label>
              <textarea id="settingSevereWarningText" class="form-input setting-input" rows="3" style="height: auto; padding: 10px;" required>${settings.severeWarningText || ''}</textarea>
              <div style="font-size: 0.78rem; color: var(--outline); margin-top: 4px;">
                Displayed prominently in the amber banner when high altitude UV or barrier irritation conditions are chosen.
              </div>
            </div>
          </div>

          <!-- Card 4: Session & Inactivity Settings -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-container); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 20px;">timer</span>
              <span>3. Session & Inactivity Timeouts</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="settingInactivitySeconds">Kiosk Auto-Reset Timeout (Seconds)</label>
                <input type="number" id="settingInactivitySeconds" class="form-input setting-input" value="${settings.inactivityTimeoutSeconds || 180}" min="30" max="600" required />
              </div>

              <div class="form-group">
                <label class="form-label">Offline Data Protection</label>
                <div style="margin-top: 14px; display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" id="settingOfflineSync" ${settings.enableOfflineSync ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--primary-container);" />
                  <span style="font-size: 0.88rem; color: var(--on-surface);">Save consultations locally when offline</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 5: Admin Password Security -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--error); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 20px;">lock</span>
              <span>4. Admin Account Security</span>
            </div>

            <div>
              <div class="form-group" style="max-width: 400px;">
                <label class="form-label" for="settingNewPassword">Update Password (leave blank to keep current)</label>
                <input type="password" id="settingNewPassword" class="form-input" placeholder="New password (min 6 chars)" />
              </div>
              <div style="font-size: 0.78rem; color: var(--outline); margin-top: 6px;">
                Directly updates your verified Supabase Admin credentials.
              </div>
            </div>
          </div>

          <!-- Sticky Actions Bar -->
          <div style="display: flex; justify-content: flex-end; gap: 1rem; padding: 1rem 0;">
            <button type="submit" class="btn-primary" style="min-height: 52px; padding: 0 2rem; font-size: 1rem;">
              <span class="material-symbols-outlined">save</span>
              <span>Save All Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
