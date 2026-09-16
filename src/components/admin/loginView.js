export function renderAdminLogin(errorMessage = '') {
  return `
    <div style="min-height: 100vh; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
      <div style="max-width: 440px; width: 100%; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-2); overflow: hidden; animation: modalFadeIn 0.25s ease;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #eff4ff 100%); padding: 2rem 1.5rem; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <div style="width: 64px; height: 64px; border-radius: 18px; background: #ffffff; border: 2px solid var(--primary-container); color: var(--primary-container); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: var(--shadow-level-1);">
            <span class="material-symbols-outlined" style="font-size: 36px;">admin_panel_settings</span>
          </div>

          <h1 class="font-headline-sm" style="color: var(--primary); margin-bottom: 0.25rem;">
            Ronit Pharmacy Admin
          </h1>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Pharmacist Portal • Tansen, Palpa
          </p>
        </div>

        <!-- Form -->
        <form id="adminLoginForm" style="padding: 2rem 1.75rem;">
          ${errorMessage ? `
            <div style="background: #ffdad6; color: var(--error); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">error</span>
              <span>${errorMessage}</span>
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label" for="adminPasswordInput">
              Pharmacist Access PIN / Password
            </label>
            <div style="position: relative;">
              <input 
                type="password" 
                id="adminPasswordInput" 
                class="form-input" 
                placeholder="Enter password (default: admin123)" 
                required 
                autofocus
                style="padding-right: 48px;"
              />
              <span class="material-symbols-outlined" style="position: absolute; right: 14px; top: 16px; color: var(--outline); font-size: 22px;">lock</span>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--on-surface-variant); cursor: pointer;">
              <input type="checkbox" id="rememberMeCheckbox" checked style="accent-color: var(--primary-container);" />
              <span>Remember session</span>
            </label>
            <span style="font-size: 0.8rem; color: var(--secondary); font-weight: 600;">Default: admin123</span>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; min-height: 52px; font-size: 1rem;">
            <span class="material-symbols-outlined">login</span>
            <span>Authenticate & Enter</span>
          </button>

          <div style="margin-top: 1.5rem; text-align: center;">
            <a href="/?view=kiosk" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
              <span>Return to Customer Kiosk</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  `;
}
