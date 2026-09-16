import { adminStore } from '../../store/adminStore.js';
import { pharmacyInfo } from '../../data/mockData.js';

export function renderAdminLayout(contentHtml) {
  const { currentTab, settings } = adminStore;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'categories', label: 'Categories', icon: 'category' },
    { id: 'skin-problems', label: 'Skin Problems', icon: 'healing' },
    { id: 'products', label: 'Products', icon: 'inventory_2' },
    { id: 'import', label: 'Import Excel', icon: 'upload_file' },
    { id: 'reports', label: 'Reports', icon: 'insights' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return `
    <div class="admin-wrapper" style="display: flex; min-height: 100vh; background: #f8fafc;">
      <!-- Sidebar (288px) -->
      <aside class="admin-sidebar" style="width: 288px; background: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; z-index: 40;">
        <!-- Brand Header -->
        <div style="padding: 1.5rem 1.25rem 1rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: #f0fdf4; border: 1.5px solid var(--primary-container); color: var(--primary-container); display: flex; align-items: center; justify-content: center; shrink-0;">
            <span class="material-symbols-outlined" style="font-size: 24px;">local_pharmacy</span>
          </div>
          <div>
            <div class="font-label-md" style="color: var(--primary); font-weight: 700; line-height: 1.2;">
              ${settings.pharmacyName || pharmacyInfo.name}
            </div>
            <div class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.78rem;">
              Pharmacist Control Center
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav style="flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 4px; overflow-y: auto;">
          ${navItems.map(item => {
            const isActive = currentTab === item.id;
            return `
              <button 
                class="admin-nav-item ${isActive ? 'active' : ''}" 
                data-tab="${item.id}"
                style="display: flex; align-items: center; gap: 12px; width: 100%; min-height: 48px; padding: 0 1rem; border-radius: 12px; border: none; background: ${isActive ? '#f0fdf4' : 'transparent'}; color: ${isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)'}; font-family: var(--font-heading); font-size: 0.95rem; font-weight: ${isActive ? '700' : '500'}; text-align: left; cursor: pointer; transition: all 0.15s ease; ${isActive ? 'border-left: 4px solid var(--primary-container);' : ''}"
              >
                <span class="material-symbols-outlined" style="font-size: 22px; color: ${isActive ? 'var(--primary-container)' : 'inherit'};">
                  ${item.icon}
                </span>
                <span>${item.label}</span>
              </button>
            `;
          }).join('')}
        </nav>

        <!-- Kiosk Switcher & Logout Footer -->
        <div style="padding: 1rem; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 8px;">
          <a href="/?view=kiosk" target="_blank" style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--secondary); text-decoration: none; padding: 8px 12px; background: #eff4ff; border-radius: 8px; font-weight: 600;">
            <span class="material-symbols-outlined" style="font-size: 18px;">tablet_mac</span>
            <span>Launch Customer Kiosk</span>
            <span class="material-symbols-outlined" style="font-size: 14px; margin-left: auto;">open_in_new</span>
          </a>

          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-container); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">
                RX
              </div>
              <div style="font-size: 0.8rem;">
                <div style="font-weight: 700; color: var(--on-surface);">${settings.leadPharmacist || 'Pharmacist Admin'}</div>
                <div style="color: var(--secondary);">Logged in</div>
              </div>
            </div>

            <button id="adminLogoutBtn" title="Logout" style="background: none; border: none; color: var(--error); cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div style="flex: 1; margin-left: 288px; display: flex; flex-direction: column; min-height: 100vh;">
        <!-- Top Sticky Header -->
        <header style="height: 64px; background: #ffffff; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; position: sticky; top: 0; z-index: 30;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h2 class="font-headline-sm" style="color: var(--on-surface); text-transform: capitalize;">
              ${currentTab.replace('-', ' ')}
            </h2>
            <span style="font-size: 0.75rem; background: #f0fdf4; color: var(--primary); padding: 2px 8px; border-radius: 9999px; font-weight: 600;">
              Active Mode
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--on-surface-variant); background: #f8fafc; padding: 6px 12px; border-radius: 9999px; border: 1px solid #e2e8f0;">
              <span class="material-symbols-outlined" style="font-size: 16px; color: var(--secondary);">location_on</span>
              <span>Tansen, Palpa (1,350m Elevation)</span>
            </div>
          </div>
        </header>

        <!-- Body View -->
        <main style="flex: 1; padding: 2rem;">
          ${contentHtml}
        </main>
      </div>
    </div>
  `;
}
