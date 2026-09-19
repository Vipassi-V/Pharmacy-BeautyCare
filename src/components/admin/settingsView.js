import { adminStore } from '../../store/adminStore.js';

export function renderSettingsView() {
  const { settings } = adminStore;

  return `
    <div style="max-width: 800px;">
      <!-- Header -->
      <div style="margin-bottom: 2rem;">
        <h1 class="font-headline-md" style="color: var(--on-surface);">Pharmacy & System Settings</h1>
        <p class="font-body-sm" style="color: var(--on-surface-variant);">
          Configure clinic branding, altitude warning text, kiosk session timeouts, and security credentials.
        </p>
      </div>

      <form id="adminSettingsForm" style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Card 1: Pharmacy Details & Branding -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">storefront</span>
            1. Pharmacy Information & Logo
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
            <label class="form-label" for="settingLogoUrl">Logo Image URL</label>
            <input type="url" id="settingLogoUrl" class="form-input setting-input" value="${settings.logoUrl || ''}" placeholder="https://..." />
          </div>
        </div>

        <!-- Card 2: Kiosk Welcome & Advisory Copy -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">message</span>
            2. Welcome Greeting & Altitude Safeguard Texts
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

        <!-- Card 3: Session & Inactivity Settings -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-container); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">timer</span>
            3. Session & Inactivity Timeouts
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

        <!-- Card 4: Admin Password Security -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1);">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--error); text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">lock</span>
            4. Admin Account Security
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
  `;
}
