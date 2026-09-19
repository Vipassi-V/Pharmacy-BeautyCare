export function renderAdminLogin(errorMessage = '') {
  return `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #f0fdf4 0%, #eff4ff 100%); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
      <div style="max-width: 440px; width: 100%; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-2); overflow: hidden; animation: modalFadeIn 0.25s ease;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #004c22 0%, #166534 100%); padding: 2rem 1.5rem; text-align: center;">
          <div style="width: 68px; height: 68px; border-radius: 20px; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); color: #ffffff; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <span class="material-symbols-outlined" style="font-size: 38px;">admin_panel_settings</span>
          </div>
          <h1 class="font-headline-sm" style="color: #ffffff; margin-bottom: 0.25rem;">
            Pharmacist Portal
          </h1>
          <p class="font-body-sm" style="color: rgba(255,255,255,0.75);">
            Ronit Pharmacy &amp; Beauty Care · Tansen, Palpa
          </p>
        </div>

        <!-- Form -->
        <form id="adminLoginForm" style="padding: 2rem 1.75rem;">
          ${errorMessage ? `
            <div style="background: #ffdad6; color: var(--error); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; margin-bottom: 1.25rem; display: flex; align-items: flex-start; gap: 8px; line-height: 1.4;">
              <span class="material-symbols-outlined" style="font-size: 18px; flex-shrink: 0; margin-top: 1px;">error</span>
              <span>${errorMessage}</span>
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label" for="adminEmailInput">
              Admin Email Address
            </label>
            <div style="position: relative;">
              <input
                type="email"
                id="adminEmailInput"
                class="form-input"
                value="${localStorage.getItem('rp_admin_email') || ''}"
                placeholder="your-admin@email.com"
                required
                autofocus
                style="padding-right: 48px;"
              />
              <span class="material-symbols-outlined" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--outline); font-size: 20px; pointer-events: none;">mail</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="adminPasswordInput">
              Password
            </label>
            <div style="position: relative;">
              <input
                type="password"
                id="adminPasswordInput"
                class="form-input"
                placeholder="Enter your password"
                required
                style="padding-right: 48px;"
              />
              <span class="material-symbols-outlined" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--outline); font-size: 20px; pointer-events: none;">lock</span>
            </div>
          </div>

          <button type="submit" id="adminLoginSubmitBtn" class="btn-primary" style="width: 100%; min-height: 52px; font-size: 1rem; margin-top: 0.5rem;">
            <span class="material-symbols-outlined">login</span>
            <span>Sign In to Admin Portal</span>
          </button>

          <div style="margin-top: 1.5rem; text-align: center;">
            <a href="/?view=kiosk" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
              <span>Return to Customer Kiosk</span>
            </a>
          </div>
        </form>

        <div style="padding: 1rem 1.75rem; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="font-size: 0.78rem; color: var(--on-surface-variant); line-height: 1.5;">
            <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">info</span>
            Access is restricted to verified admin accounts only.<br>Contact the system administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  `;
}
