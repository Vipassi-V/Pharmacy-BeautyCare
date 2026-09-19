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
    <!-- Mobile/tablet sidebar backdrop -->
    <div class="admin-sidebar-backdrop" id="adminSidebarBackdrop"></div>

    <div class="admin-wrapper" style="display: flex; min-height: 100vh; background: #f8fafc;">

      <!-- Sidebar -->
      <aside class="admin-sidebar" id="adminSidebar">

        <!-- Brand Header -->
        <div style="padding: 1rem 1rem 0.75rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; overflow: hidden;">
          <div style="flex-shrink: 0; width: 42px; height: 42px; border-radius: 12px; background: #f0fdf4; border: 1.5px solid var(--primary-container); color: var(--primary-container); display: flex; align-items: center; justify-content: center;">
            <span class="material-symbols-outlined" style="font-size: 24px;">local_pharmacy</span>
          </div>
          <div class="sidebar-brand-text" style="overflow: hidden;">
            <div class="font-label-md" style="color: var(--primary); font-weight: 700; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${settings.pharmacyName || pharmacyInfo.name}
            </div>
            <div class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.78rem; white-space: nowrap;">
              Admin Portal
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav style="flex: 1; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; overflow-x: hidden;">
          ${navItems.map(item => {
            const isActive = currentTab === item.id;
            return `
              <button
                class="admin-nav-item ${isActive ? 'active' : ''}"
                data-tab="${item.id}"
                title="${item.label}"
                style="display: flex; align-items: center; gap: 12px; width: 100%; min-height: 48px; padding: 0 1rem; border-radius: 12px; border: none; background: ${isActive ? '#f0fdf4' : 'transparent'}; color: ${isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)'}; font-family: var(--font-heading); font-size: 0.95rem; font-weight: ${isActive ? '700' : '500'}; text-align: left; cursor: pointer; transition: all 0.15s ease; ${isActive ? 'border-left: 3px solid var(--primary-container);' : 'border-left: 3px solid transparent;'} white-space: nowrap; overflow: hidden;"
              >
                <span class="material-symbols-outlined" style="font-size: 22px; flex-shrink: 0; color: ${isActive ? 'var(--primary-container)' : 'inherit'};">
                  ${item.icon}
                </span>
                <span class="sidebar-label">${item.label}</span>
              </button>
            `;
          }).join('')}
        </nav>

        <!-- Kiosk Switcher & Logout Footer -->
        <div style="padding: 0.75rem 0.5rem; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 6px; overflow: hidden;">
          <a href="/?view=kiosk" target="_blank" title="Launch Customer Kiosk"
            style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--secondary); text-decoration: none; padding: 8px 14px; background: #eff4ff; border-radius: 8px; font-weight: 600; white-space: nowrap; overflow: hidden;">
            <span class="material-symbols-outlined" style="font-size: 18px; flex-shrink: 0;">tablet_mac</span>
            <span class="sidebar-footer-text">Launch Customer Kiosk</span>
            <span class="material-symbols-outlined sidebar-footer-text" style="font-size: 14px; margin-left: auto;">open_in_new</span>
          </a>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px 2px;">
            <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
              <div style="flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--primary-container); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">
                RX
              </div>
              <div class="sidebar-footer-text" style="font-size: 0.8rem; overflow: hidden;">
                <div style="font-weight: 700; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${settings.leadPharmacist || 'Pharmacist Admin'}</div>
                <div style="color: var(--secondary);">Logged in</div>
              </div>
            </div>

            <button id="adminLogoutBtn" title="Logout"
              style="flex-shrink: 0; background: none; border: none; color: var(--error); cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center;">
              <span class="material-symbols-outlined" style="font-size: 20px;">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="admin-main" id="adminMain">

        <!-- Top Sticky Header -->
        <header style="height: 64px; background: #ffffff; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; position: sticky; top: 0; z-index: 30;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <!-- Hamburger (mobile/tablet only) -->
            <button
              id="adminHamburgerBtn"
              class="admin-mobile-only"
              aria-label="Open sidebar"
              style="align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: #f8fafc; border-radius: 10px; cursor: pointer; color: var(--on-surface); display: none;">
              <span class="material-symbols-outlined" style="font-size: 22px;">menu</span>
            </button>

            <h2 class="font-headline-sm" style="color: var(--on-surface); text-transform: capitalize; margin: 0;">
              ${currentTab.replace(/-/g, ' ')}
            </h2>
            <span style="font-size: 0.75rem; background: #f0fdf4; color: var(--primary); padding: 2px 8px; border-radius: 9999px; font-weight: 600;">
              Active
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="admin-header-location" style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--on-surface-variant); background: #f8fafc; padding: 6px 12px; border-radius: 9999px; border: 1px solid #e2e8f0;">
              <span class="material-symbols-outlined" style="font-size: 16px; color: var(--secondary);">location_on</span>
              <span>Tansen, Palpa (1,350m)</span>
            </div>
          </div>
        </header>

        <!-- Body View -->
        <main style="flex: 1; padding: 1.5rem;">
          ${contentHtml}
        </main>
      </div>
    </div>
  `;
}
