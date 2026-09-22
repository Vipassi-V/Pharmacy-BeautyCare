import './style.css';
import { sessionStore } from './store/sessionStore.js';
import { adminStore } from './store/adminStore.js';
import QRCode from 'qrcode';
import { downloadExcelTemplate, parseAndValidateImport } from './lib/excelImportParser.js';

// Customer Kiosk Views
import {
  renderHeader,
  renderStepper,
  renderWelcomeScreen,
  renderNameScreen,
  renderSkinTypeScreen,
  renderConcernsScreen,
  renderReviewScreen,
  renderRecommendationsScreen,
  renderQRModal,
  renderEndSessionConfirmModal,
  renderMobilePage,
  renderEndSessionScreen
} from './components/views.js';

// Admin Views
import { renderAdminLayout } from './components/admin/adminLayout.js';
import { renderAdminLogin } from './components/admin/loginView.js';
import { renderDashboardView } from './components/admin/dashboardView.js';
import { renderCategoriesView, renderCategoryModal } from './components/admin/categoriesView.js';
import { renderSkinProblemsView, renderSkinProblemModal } from './components/admin/skinProblemsView.js';
import { renderProductsView, renderProductModal } from './components/admin/productsView.js';
import { renderImportWorkflowView } from './components/admin/importWorkflowView.js';
import { renderReportsView } from './components/admin/reportsView.js';
import { renderSettingsView } from './components/admin/settingsView.js';
import { renderConfirmModal, renderToast } from './components/admin/confirmModals.js';

let resetTimerInterval = null;
let currentImportState = null;
let activeEditingItem = null;
let logoUploadState = null;

function render() {
  const urlParams = new URLSearchParams(window.location.search);
  const isExplicitAdmin = urlParams.get('view') === 'admin' || window.location.pathname.includes('/admin');
  const isExplicitMobile = urlParams.get('view') === 'mobile';

  const app = document.getElementById('app');

  // 1. Mobile Handover View
  if (isExplicitMobile || sessionStore.getState().isMobileView) {
    app.innerHTML = renderMobilePage(sessionStore.getState());
    bindMobileEvents();
    return;
  }

  // 2. Admin Portal View
  if (isExplicitAdmin) {
    if (!adminStore.isAuthenticated) {
      app.innerHTML = renderAdminLogin();
      bindAdminLoginEvents();
      return;
    }

    let tabContent = '';
    switch (adminStore.currentTab) {
      case 'dashboard':
        tabContent = renderDashboardView();
        break;
      case 'categories':
        tabContent = renderCategoriesView();
        break;
      case 'skin-problems':
        tabContent = renderSkinProblemsView();
        break;
      case 'products':
        tabContent = renderProductsView();
        break;
      case 'import':
        tabContent = renderImportWorkflowView(currentImportState);
        break;
      case 'reports':
        tabContent = renderReportsView();
        break;
      case 'settings':
        tabContent = renderSettingsView(logoUploadState);
        break;
      default:
        tabContent = renderDashboardView();
    }

    app.innerHTML = `
      ${renderAdminLayout(tabContent)}
      ${adminStore.activeModal ? renderConfirmModal(adminStore.activeModal) : ''}
      ${activeEditingItem && activeEditingItem.type === 'category' ? renderCategoryModal(activeEditingItem.data) : ''}
      ${activeEditingItem && activeEditingItem.type === 'problem' ? renderSkinProblemModal(activeEditingItem.data) : ''}
      ${activeEditingItem && activeEditingItem.type === 'product' ? renderProductModal(activeEditingItem.data) : ''}
      ${renderToast(adminStore.toast)}
    `;

    bindAdminEvents();
    return;
  }

  // 3. Customer Tablet Kiosk View
  const state = sessionStore.getState();
  let screenContent = '';

  switch (state.currentStep) {
    case 1:
      screenContent = renderWelcomeScreen();
      break;
    case 2:
      screenContent = renderNameScreen(state);
      break;
    case 3:
      screenContent = renderSkinTypeScreen(state);
      break;
    case 4:
      screenContent = renderConcernsScreen(state);
      break;
    case 5:
      screenContent = renderReviewScreen(state);
      break;
    case 6:
      screenContent = renderRecommendationsScreen(state);
      break;
    case 9:
      screenContent = renderEndSessionScreen();
      break;
    default:
      screenContent = renderWelcomeScreen();
  }

  app.innerHTML = `
    ${renderHeader(state)}
    <main style="flex: 1; display: flex; flex-direction: column;">
      ${renderStepper(state.currentStep)}
      ${screenContent}
    </main>
    ${renderQRModal(state)}
    ${renderEndSessionConfirmModal(state)}
    <!-- Subtle footer access to Admin -->
    <footer style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--outline);">
      <a href="/?view=admin" style="color: var(--outline); text-decoration: none;">Pharmacist Portal Access</a>
    </footer>
  `;

  // Draw QR code if modal open
  if (state.showQRModal) {
    const canvas = document.getElementById('qrCanvas');
    if (canvas) {
      const url = `${window.location.origin}/?session=${state.sessionId}&view=mobile`;
      QRCode.toCanvas(canvas, url, {
        width: 220,
        margin: 1,
        color: {
          dark: '#004c22',
          light: '#ffffff'
        }
      });
    }
  }

  // Handle auto-reset timer if on step 9
  if (state.currentStep === 9) {
    startAutoResetTimer();
  } else {
    clearInterval(resetTimerInterval);
  }

  bindKioskEvents();
}

function startAutoResetTimer() {
  clearInterval(resetTimerInterval);
  let secondsLeft = 30;
  const timerElem = document.getElementById('autoResetTimer');
  resetTimerInterval = setInterval(() => {
    secondsLeft--;
    if (timerElem) {
      timerElem.textContent = `Auto-resetting in ${secondsLeft} seconds...`;
    }
    if (secondsLeft <= 0) {
      clearInterval(resetTimerInterval);
      sessionStore.clearSession();
    }
  }, 1000);
}

// --- Customer Kiosk Event Bindings ---
function bindKioskEvents() {
  document.getElementById('headerHomeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (sessionStore.getState().currentStep > 1 && sessionStore.getState().currentStep < 9) {
      sessionStore.setEndSessionConfirmModal(true);
    } else {
      sessionStore.setStep(1);
    }
  });

  document.getElementById('endSessionTopBtn')?.addEventListener('click', () => {
    sessionStore.setEndSessionConfirmModal(true);
  });

  document.getElementById('cancelEndSessionBtn')?.addEventListener('click', () => {
    sessionStore.setEndSessionConfirmModal(false);
  });

  document.getElementById('cancelEndSessionCloseBtn')?.addEventListener('click', () => {
    sessionStore.setEndSessionConfirmModal(false);
  });

  document.getElementById('endSessionConfirmBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'endSessionConfirmBackdrop') {
      sessionStore.setEndSessionConfirmModal(false);
    }
  });

  document.getElementById('confirmEndSessionBtn')?.addEventListener('click', () => {
    sessionStore.setEndSessionConfirmModal(false);
    sessionStore.setStep(9);
  });

  document.getElementById('startConsultationBtn')?.addEventListener('click', () => sessionStore.setStep(2));

  const nameForm = document.getElementById('nameEntryForm');
  nameForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = document.getElementById('firstNameInput').value;
    const last = document.getElementById('lastNameInput').value;
    if (first.trim() && last.trim()) {
      sessionStore.setCustomerName(first, last);
      sessionStore.setStep(3);
    }
  });

  document.getElementById('backToWelcomeBtn')?.addEventListener('click', () => sessionStore.setStep(1));

  document.querySelectorAll('.selection-card[data-type-id]').forEach(card => {
    card.addEventListener('click', () => {
      const typeId = card.getAttribute('data-type-id');
      sessionStore.selectSkinType(typeId);
    });
  });

  document.getElementById('backToNameBtn')?.addEventListener('click', () => sessionStore.setStep(2));
  document.getElementById('continueToConcernsBtn')?.addEventListener('click', () => {
    if (sessionStore.getState().selectedSkinTypeId) sessionStore.setStep(4);
  });

  document.querySelectorAll('.concern-card[data-concern-id]').forEach(card => {
    const concernId = card.getAttribute('data-concern-id');
    card.querySelector('.concern-body')?.addEventListener('click', () => sessionStore.toggleExpandConcern(concernId));
    card.querySelector('.btn-add-concern')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sessionStore.toggleSelectConcern(concernId);
    });
  });

  document.getElementById('backToSkinTypeBtn')?.addEventListener('click', () => sessionStore.setStep(3));
  document.getElementById('continueToReviewBtn')?.addEventListener('click', () => {
    if (sessionStore.getState().selectedConcernIds.length > 0) sessionStore.setStep(5);
  });

  document.getElementById('backToConcernsBtn')?.addEventListener('click', () => sessionStore.setStep(4));
  document.getElementById('confirmRegimenBtn')?.addEventListener('click', () => sessionStore.setStep(6));

  document.getElementById('showQRBtn')?.addEventListener('click', () => sessionStore.setQRModal(true));
  document.getElementById('closeQRModalBtn')?.addEventListener('click', () => sessionStore.setQRModal(false));
  document.getElementById('qrModalBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'qrModalBackdrop') sessionStore.setQRModal(false);
  });

  document.getElementById('finishSessionBtn')?.addEventListener('click', () => sessionStore.setStep(9));
  document.getElementById('resetKioskImmediateBtn')?.addEventListener('click', () => sessionStore.clearSession());
}

// --- Mobile Event Bindings ---
function bindMobileEvents() {
  document.getElementById('mobileHeaderHomeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = window.location.origin;
  });
}

// --- Admin Login Events ---
function bindAdminLoginEvents() {
  const loginForm = document.getElementById('adminLoginForm');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmailInput')?.value;
    const pwd = document.getElementById('adminPasswordInput')?.value;
    const submitBtn = document.getElementById('adminLoginSubmitBtn');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 18px;">sync</span><span>Authenticating...</span>';
    }

    const res = await adminStore.login(pwd, email);
    if (!res.success) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 20px;">lock_open</span><span>Access Admin Console</span>';
      }
      const errBox = document.getElementById('loginErrorBox');
      if (errBox) {
        errBox.textContent = res.error;
        errBox.style.display = 'block';
      }
    } else {
      render();
    }
  });
}

// --- Admin Portal Event Bindings ---
function bindAdminEvents() {
  // Sidebar Tabs
  document.querySelectorAll('.admin-nav-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      adminStore.setTab(tab);
    });
  });

  // Mobile sidebar toggles
  document.getElementById('adminMobileNavToggle')?.addEventListener('click', () => {
    document.getElementById('adminSidebar')?.classList.add('mobile-open');
    document.getElementById('adminSidebarBackdrop')?.classList.add('active');
  });

  document.getElementById('adminSidebarBackdrop')?.addEventListener('click', () => {
    document.getElementById('adminSidebar')?.classList.remove('mobile-open');
    document.getElementById('adminSidebarBackdrop')?.classList.remove('active');
  });

  // Switch to Kiosk
  document.getElementById('adminKioskSwitchBtn')?.addEventListener('click', () => {
    window.location.href = window.location.origin;
  });

  // Logout
  document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    adminStore.openModal('logout', {
      title: 'Confirm Logout',
      message: 'Are you sure you want to end your active administrative session?',
      onConfirm: () => {
        adminStore.logout();
        adminStore.closeModal();
      }
    });
  });

  // Modal Backdrop dismiss
  document.getElementById('confirmModalBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'confirmModalBackdrop') adminStore.closeModal();
  });
  document.getElementById('cancelModalBtn')?.addEventListener('click', () => adminStore.closeModal());
  document.getElementById('confirmActionBtn')?.addEventListener('click', () => {
    if (adminStore.activeModal && typeof adminStore.activeModal.onConfirm === 'function') {
      adminStore.activeModal.onConfirm();
    }
  });

  // --- Categories Events ---
  document.getElementById('openAddCategoryModalBtn')?.addEventListener('click', () => {
    activeEditingItem = { type: 'category', data: null };
    render();
  });

  document.querySelectorAll('.edit-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cat-id');
      const cat = adminStore.categories.find(c => c.id === id);
      if (cat) {
        activeEditingItem = { type: 'category', data: cat };
        render();
      }
    });
  });

  document.querySelectorAll('.toggle-cat-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cat-id');
      const curr = btn.getAttribute('data-current-status');
      const next = curr === 'active' ? 'inactive' : 'active';
      const cat = adminStore.categories.find(c => c.id === id);

      adminStore.openModal(next === 'active' ? 'activate' : 'deactivate', {
        title: next === 'active' ? 'Activate Category' : 'Deactivate Category',
        message: next === 'active' 
          ? 'This category and its products will become selectable in the customer consultation flow.' 
          : 'Hides this category from customer recommendation displays.',
        itemName: cat ? cat.name : id,
        onConfirm: () => {
          adminStore.toggleCategoryStatus(id, next);
          adminStore.closeModal();
        }
      });
    });
  });

  document.querySelectorAll('.delete-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cat-id');
      const cat = adminStore.categories.find(c => c.id === id);
      const val = adminStore.canDeleteCategory(id);

      if (!val.canDelete) {
        adminStore.openModal('notice', {
          title: 'Cannot Delete Category',
          message: `Category "${cat ? cat.name : id}" is still referenced by ${val.count} active product(s) (${val.productNames.slice(0, 3).join(', ')}). Please reassign or delete those products first.`,
          itemName: cat ? cat.name : id,
          onConfirm: () => adminStore.closeModal()
        });
        return;
      }

      adminStore.openModal('delete', {
        title: 'Delete Category Permanently?',
        message: 'This will permanently remove this category. This action cannot be undone.',
        itemName: cat ? cat.name : id,
        onConfirm: () => {
          adminStore.deleteCategory(id);
          adminStore.closeModal();
        }
      });
    });
  });

  document.getElementById('categoryModalForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('catFormId').value;
    const name = document.getElementById('catFormName').value;
    const icon = document.getElementById('catFormIcon').value;
    const order = Number(document.getElementById('catFormOrder').value) || 0;

    if (id) {
      adminStore.updateCategory(id, { name, icon, order });
    } else {
      adminStore.addCategory({ name, icon, order });
    }
    activeEditingItem = null;
    render();
  });

  document.getElementById('closeCategoryModalBtn')?.addEventListener('click', () => {
    activeEditingItem = null;
    render();
  });
  document.getElementById('cancelCatFormBtn')?.addEventListener('click', () => {
    activeEditingItem = null;
    render();
  });

  // --- Skin Problems Events ---
  document.getElementById('openAddProblemModalBtn')?.addEventListener('click', () => {
    activeEditingItem = { type: 'problem', data: null };
    render();
  });

  document.querySelectorAll('.edit-prob-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prob-id');
      const prob = adminStore.skinProblems.find(p => p.id === id);
      if (prob) {
        activeEditingItem = { type: 'problem', data: prob };
        render();
      }
    });
  });

  document.querySelectorAll('.toggle-severe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prob-id');
      adminStore.toggleSkinProblemSevere(id);
    });
  });

  document.querySelectorAll('.toggle-prob-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prob-id');
      const curr = btn.getAttribute('data-current-status');
      const next = curr === 'active' ? 'inactive' : 'active';
      const prob = adminStore.skinProblems.find(p => p.id === id);

      adminStore.openModal(next === 'active' ? 'activate' : 'deactivate', {
        title: next === 'active' ? 'Activate Skin Problem' : 'Deactivate Skin Problem',
        message: next === 'active' 
          ? 'This condition tile will immediately appear on the kiosk selection grid.' 
          : 'Hides this condition tile from customer surveys.',
        itemName: prob ? prob.title : id,
        onConfirm: () => {
          adminStore.updateSkinProblem(id, { status: next });
          adminStore.closeModal();
        }
      });
    });
  });

  document.querySelectorAll('.delete-prob-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prob-id');
      const prob = adminStore.skinProblems.find(p => p.id === id);
      adminStore.openModal('delete', {
        title: 'Delete Skin Problem Permanently?',
        message: 'This will expunge this skin condition from the consultation directory.',
        itemName: prob ? prob.title : id,
        onConfirm: () => {
          adminStore.deleteSkinProblem(id);
          adminStore.closeModal();
        }
      });
    });
  });

  document.getElementById('problemModalForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('probFormId').value;
    const title = document.getElementById('probFormTitle').value;
    const nepaliTitle = document.getElementById('probFormNepaliTitle').value;
    const image = document.getElementById('probFormImageUrl').value;
    const summary = document.getElementById('probFormSummary').value;
    const description = document.getElementById('probFormDescription').value;
    const isSevere = document.getElementById('probFormIsSevere').checked;

    if (id) {
      adminStore.updateSkinProblem(id, { title, nepaliTitle, image, summary, description, isSevere });
    } else {
      adminStore.addSkinProblem({ title, nepaliTitle, image, summary, description, isSevere });
    }
    activeEditingItem = null;
    render();
  });

  document.getElementById('closeProblemModalBtn')?.addEventListener('click', () => {
    activeEditingItem = null;
    render();
  });
  document.getElementById('cancelProbFormBtn')?.addEventListener('click', () => {
    activeEditingItem = null;
    render();
  });

  // Skin Problem WebP Image Upload with Client Processing
  document.getElementById('probUploadFileBtn')?.addEventListener('click', () => {
    document.getElementById('probFileInput')?.click();
  });

  document.getElementById('probFileInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadBtn = document.getElementById('probUploadFileBtn');
    const feedback = document.getElementById('probImageFeedback');
    const currentId = document.getElementById('probFormId')?.value || null;

    if (uploadBtn) {
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 18px;">sync</span><span>Processing...</span>';
    }

    try {
      const res = await adminStore.uploadSkinProblemImage(file, currentId, (p) => {
        if (feedback) feedback.innerHTML = `<span style="color: var(--primary-container);">⏳ ${p.phase} (${p.progress}%)</span>`;
      });

      if (res.publicUrl) {
        const urlInput = document.getElementById('probFormImageUrl');
        if (urlInput) urlInput.value = res.publicUrl;
        if (feedback) feedback.innerHTML = `<span style="color: var(--primary); font-weight: 600;">✓ Converted to WebP (${Math.round(res.sizeBytes / 1024)} KB, ${res.width}x${res.height}px) &amp; Uploaded</span>`;
        adminStore.showToast('Condition image processed &amp; uploaded to Supabase!');
      }
    } catch (err) {
      if (feedback) feedback.innerHTML = `<span style="color: var(--error); font-weight: 600;">⚠ ${err.message}</span>`;
      adminStore.showToast(err.message, 'error');
    } finally {
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">cloud_upload</span><span>Upload</span>';
      }
    }
  });

  document.getElementById('probClearImageBtn')?.addEventListener('click', () => {
    const urlInput = document.getElementById('probFormImageUrl');
    if (urlInput) urlInput.value = '';
    const feedback = document.getElementById('probImageFeedback');
    if (feedback) feedback.innerHTML = '<span>Image cleared.</span>';
  });

  document.getElementById('probImageSampleBtn')?.addEventListener('click', () => {
    const samples = [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512290900672-1f55b9355755?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    ];
    const selected = samples[Math.floor(Math.random() * samples.length)];
    const urlInput = document.getElementById('probFormImageUrl');
    if (urlInput) urlInput.value = selected;
  });

  // --- Products Events & Live Preview ---
  document.getElementById('openAddProductModalBtn')?.addEventListener('click', () => {
    activeEditingItem = { type: 'product', data: null };
    render();
  });
  document.getElementById('openImportWorkflowBtn')?.addEventListener('click', () => {
    adminStore.setTab('import');
  });

  document.querySelectorAll('.edit-prod-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prod-id');
      const prod = adminStore.products.find(p => p.id === id);
      if (prod) {
        activeEditingItem = { type: 'product', data: prod };
        render();
      }
    });
  });

  document.querySelectorAll('.toggle-prod-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prod-id');
      const curr = btn.getAttribute('data-current-status');
      const next = curr === 'active' ? 'inactive' : 'active';
      const prod = adminStore.products.find(p => p.id === id);

      adminStore.openModal(next === 'active' ? 'activate' : 'deactivate', {
        title: next === 'active' ? 'Activate Product' : 'Deactivate Product',
        message: next === 'active' 
          ? 'Enables this product for automatic recommendation matches on kiosks.' 
          : 'Hides this product from patient recommendation lists.',
        itemName: prod ? prod.name : id,
        onConfirm: () => {
          adminStore.updateProduct(id, { status: next });
          adminStore.closeModal();
        }
      });
    });
  });

  document.querySelectorAll('.delete-prod-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-prod-id');
      const prod = adminStore.products.find(p => p.id === id);
      adminStore.openModal('delete', {
        title: 'Delete Product Permanently?',
        message: 'This will expunge this product item from the catalog.',
        itemName: prod ? prod.name : id,
        onConfirm: () => {
          adminStore.deleteProduct(id);
          adminStore.closeModal();
        }
      });
    });
  });

  // Live Preview & Storage Upload Listeners inside Product Modal
  if (activeEditingItem && activeEditingItem.type === 'product') {
    const bindLivePreview = () => {
      const brandVal = document.getElementById('prodFormBrand')?.value || 'BRAND NAME';
      const nameVal = document.getElementById('prodFormName')?.value || 'Product Title Preview';
      const priceVal = document.getElementById('prodFormPrice')?.value || '0';
      const instVal = document.getElementById('prodFormInstruction')?.value || 'Usage directions';
      const imgVal = document.getElementById('prodFormImage')?.value;

      const simBrand = document.getElementById('simCardBrand');
      const simName = document.getElementById('simCardName');
      const simPrice = document.getElementById('simCardPrice');
      const simInst = document.getElementById('simCardInstruction');
      const simImg = document.getElementById('simCardImg');

      if (simBrand) simBrand.textContent = brandVal;
      if (simName) simName.textContent = nameVal;
      if (simPrice) simPrice.textContent = `Rs. ${Number(priceVal).toLocaleString()}`;
      if (simInst) simInst.textContent = instVal;
      if (simImg && imgVal) simImg.src = imgVal;
    };

    ['prodFormBrand', 'prodFormName', 'prodFormPrice', 'prodFormInstruction', 'prodFormImage'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', bindLivePreview);
    });

    document.getElementById('prodUploadFileBtn')?.addEventListener('click', () => {
      document.getElementById('prodFileInput')?.click();
    });

    document.getElementById('prodFileInput')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const uploadBtn = document.getElementById('prodUploadFileBtn');
      const feedback = document.getElementById('prodImageFeedback');
      const currentId = document.getElementById('prodFormId')?.value || null;

      if (uploadBtn) {
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 18px;">sync</span><span>Processing...</span>';
      }

      try {
        const res = await adminStore.uploadProductImage(file, currentId, (p) => {
          if (feedback) feedback.innerHTML = `<span style="color: var(--primary-container);">⏳ ${p.phase} (${p.progress}%)</span>`;
        });

        if (res.publicUrl) {
          const urlInput = document.getElementById('prodFormImage');
          if (urlInput) {
            urlInput.value = res.publicUrl;
            bindLivePreview();
          }
          if (feedback) feedback.innerHTML = `<span style="color: var(--primary); font-weight: 600;">✓ Converted to WebP (${Math.round(res.sizeBytes / 1024)} KB, ${res.width}x${res.height}px) &amp; Uploaded</span>`;
          adminStore.showToast('Product photo processed &amp; uploaded to Supabase!');
        }
      } catch (err) {
        if (feedback) feedback.innerHTML = `<span style="color: var(--error); font-weight: 600;">⚠ ${err.message}</span>`;
        adminStore.showToast(err.message, 'error');
      } finally {
        if (uploadBtn) {
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">cloud_upload</span><span>Upload</span>';
        }
      }
    });

    document.getElementById('prodClearImageBtn')?.addEventListener('click', () => {
      const urlInput = document.getElementById('prodFormImage');
      if (urlInput) {
        urlInput.value = '';
        bindLivePreview();
      }
      const feedback = document.getElementById('prodImageFeedback');
      if (feedback) feedback.innerHTML = '<span>Photo removed.</span>';
    });

    document.getElementById('prodImageSampleBtn')?.addEventListener('click', () => {
      const samples = [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1567928805192-d35d641494b1?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1608248597359-5f2571216d7a?auto=format&fit=crop&w=500&q=80"
      ];
      const selected = samples[Math.floor(Math.random() * samples.length)];
      const imgInput = document.getElementById('prodFormImage');
      if (imgInput) {
        imgInput.value = selected;
        bindLivePreview();
      }
    });

    document.getElementById('productModalForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('prodFormId').value;
      const brand = document.getElementById('prodFormBrand').value;
      const categoryId = document.getElementById('prodFormCategory').value;
      const name = document.getElementById('prodFormName').value;
      const price = Number(document.getElementById('prodFormPrice').value) || 0;
      const badgesStr = document.getElementById('prodFormBadges').value;
      const image = document.getElementById('prodFormImage').value;
      const instruction = document.getElementById('prodFormInstruction').value;

      const badges = badgesStr.split(',').map(b => b.trim()).filter(Boolean);
      const linkedConcerns = Array.from(document.querySelectorAll('input[name="prodLinkedConcerns"]:checked')).map(el => el.value);

      if (id) {
        adminStore.updateProduct(id, { brand, categoryId, name, price, badges, image, instruction, suitableConcerns: linkedConcerns });
      } else {
        adminStore.addProduct({ brand, categoryId, name, price, badges, image, instruction, suitableConcerns: linkedConcerns });
      }
      activeEditingItem = null;
      render();
    });

    document.getElementById('closeProductModalBtn')?.addEventListener('click', () => {
      activeEditingItem = null;
      render();
    });
    document.getElementById('cancelProdFormBtn')?.addEventListener('click', () => {
      activeEditingItem = null;
      render();
    });
  }

  // --- Excel / CSV Import Workflow Events ---
  document.getElementById('downloadCsvTemplateBtn')?.addEventListener('click', () => {
    downloadExcelTemplate(adminStore.categories, adminStore.skinProblems);
    adminStore.showToast('Downloaded standard 7-column product import template (images upload separately)');
  });

  const dropzone = document.getElementById('csvDropzone');
  const fileInput = document.getElementById('csvFileInput');

  dropzone?.addEventListener('click', () => fileInput?.click());
  document.getElementById('selectFileBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImportFile(file);
  });

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--primary)';
    dropzone.style.background = '#f0fdf4';
  });
  dropzone?.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '#cbd5e1';
    dropzone.style.background = '#f8fafc';
  });
  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#cbd5e1';
    dropzone.style.background = '#f8fafc';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImportFile(e.dataTransfer.files[0]);
    }
  });

  document.getElementById('clearImportBtn')?.addEventListener('click', () => {
    currentImportState = null;
    render();
  });

  // Stage 2: Confirm Bulk Import
  document.getElementById('confirmBulkImportBtn')?.addEventListener('click', async () => {
    if (currentImportState && currentImportState.rows) {
      const validRows = currentImportState.rows.filter(r => r.isValid);
      const confirmBtn = document.getElementById('confirmBulkImportBtn');
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 18px;">sync</span><span>Importing to Supabase...</span>';
      }

      const results = await adminStore.executeBulkImport(validRows);
      currentImportState = {
        ...currentImportState,
        importCompleted: true,
        successfulRowsCount: results.successfulRows.length,
        failedRowsCount: results.failedRows.length
      };
      render();
    }
  });

  document.getElementById('viewCatalogAfterImportBtn')?.addEventListener('click', () => {
    currentImportState = null;
    adminStore.setTab('products');
  });

  document.getElementById('importAnotherFileBtn')?.addEventListener('click', () => {
    currentImportState = null;
    render();
  });

  // --- Reports Events ---
  document.getElementById('exportReportsCsvBtn')?.addEventListener('click', () => {
    const rows = [
      ["Session ID", "Customer Name", "Skin Type", "Concerns", "Severe Alert", "Date"],
      ...adminStore.sessions.map(s => [s.id, s.customerName, s.skinType, s.concerns.join('; '), s.hasSevere ? 'Yes' : 'No', s.timestamp])
    ];
    const csvContent = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ronit_consultation_reports_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    adminStore.showToast('Reports CSV exported successfully');
  });

  // --- Settings Events & Pharmacy Logo Management ---
  document.querySelectorAll('.setting-input').forEach(input => {
    input.addEventListener('input', () => {
      adminStore.isDirty = true;
    });
  });

  // Logo File Upload Button
  document.getElementById('selectLogoFileBtn')?.addEventListener('click', () => {
    document.getElementById('pharmacyLogoFileInput')?.click();
  });

  document.getElementById('pharmacyLogoFileInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    logoUploadState = { phase: 'Starting image processing...', progress: 10 };
    render();

    try {
      const res = await adminStore.uploadPharmacyLogo(file, (p) => {
        logoUploadState = { phase: p.phase, progress: p.progress };
        const feedbackEl = document.getElementById('logoProcessingFeedback');
        if (feedbackEl) {
          feedbackEl.innerHTML = `
            <div style="padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.82rem; background: #f8fafc; color: var(--primary-container); border: 1px solid #cbd5e1;">
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
                <span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 18px;">sync</span>
                <span>${p.phase} (${p.progress}%)</span>
              </div>
            </div>
          `;
        }
      });

      logoUploadState = {
        isDone: true,
        message: `Logo converted to WebP (${Math.round(res.sizeBytes / 1024)} KB, ${res.width}x${res.height}px) and published!`
      };
      render();
    } catch (err) {
      console.error('Logo upload error:', err);
      logoUploadState = { error: err.message || 'Failed to upload pharmacy logo.' };
      render();
    }
  });

  document.getElementById('removeLogoBtn')?.addEventListener('click', () => {
    adminStore.openModal('delete', {
      title: 'Remove Pharmacy Logo?',
      message: 'This will remove the uploaded logo asset. The kiosk header will revert to the default emblem.',
      itemName: 'Pharmacy Logo',
      onConfirm: async () => {
        await adminStore.removePharmacyLogo();
        logoUploadState = null;
        adminStore.closeModal();
        render();
      }
    });
  });

  document.getElementById('adminSettingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pharmacyName = document.getElementById('settingPharmacyName').value;
    const leadPharmacist = document.getElementById('settingLeadPharmacist').value;
    const location = document.getElementById('settingLocation').value;
    const subLocation = document.getElementById('settingSubLocation')?.value || '';
    const phone = document.getElementById('settingPhone').value;
    const welcomeTitle = document.getElementById('settingWelcomeTitle').value;
    const welcomeSubtitle = document.getElementById('settingWelcomeSubtitle').value;
    const severeWarningText = document.getElementById('settingSevereWarningText').value;
    const inactivityTimeoutSeconds = Number(document.getElementById('settingInactivitySeconds').value) || 180;
    const enableOfflineSync = document.getElementById('settingOfflineSync').checked;

    // Check password change if provided
    const newPwd = document.getElementById('settingNewPassword')?.value;

    if (newPwd) {
      const pwdRes = await adminStore.changePassword(newPwd);
      if (!pwdRes.success) {
        adminStore.showToast(pwdRes.message, 'error');
        return;
      }
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 18px;">sync</span><span>Saving...</span>';
    }

    try {
      await adminStore.updateSettings({
        pharmacyName,
        leadPharmacist,
        location,
        subLocation,
        phone,
        welcomeTitle,
        welcomeSubtitle,
        severeWarningText,
        inactivityTimeoutSeconds,
        enableOfflineSync
      });
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

function handleImportFile(file) {
  if (!file) return;

  const ext = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
  if (ext === 'xlsx' || ext === 'xls') {
    adminStore.showToast(`Direct binary .${ext} files must be saved/exported as CSV (.csv) before importing. Please export your Excel sheet as CSV.`, 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    try {
      const validationResult = parseAndValidateImport(
        text,
        adminStore.categories,
        adminStore.skinProblems,
        adminStore.products
      );

      currentImportState = {
        filename: file.name,
        ...validationResult
      };
      render();
    } catch (err) {
      console.error('Import parser exception:', err);
      adminStore.showToast(err.message || 'Could not parse import file.', 'error');
    }
  };
  reader.readAsText(file);
}

// Subscriptions
sessionStore.subscribe(() => render());
adminStore.subscribe(() => {
  // If the user is currently editing inside a modal, do not wipe out their active form inputs
  if (activeEditingItem && document.querySelector('#categoryModalForm, #problemModalForm, #productModalForm')) {
    return;
  }
  render();
});

window.addEventListener('DOMContentLoaded', () => {
  render();
});
