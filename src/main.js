import './style.css';
import { sessionStore } from './store/sessionStore.js';
import { adminStore } from './store/adminStore.js';
import QRCode from 'qrcode';

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
        tabContent = renderSettingsView();
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
      sessionStore.toggleConcern(concernId);
    });
  });

  document.getElementById('backToSkinTypeBtn')?.addEventListener('click', () => sessionStore.setStep(3));
  document.getElementById('proceedToReviewBtn')?.addEventListener('click', () => {
    if (sessionStore.getState().selectedConcernIds.length > 0) sessionStore.setStep(5);
  });

  document.getElementById('editNameBtn')?.addEventListener('click', () => sessionStore.setStep(2));
  document.getElementById('editSkinTypeBtn')?.addEventListener('click', () => sessionStore.setStep(3));
  document.getElementById('editConcernsBtn')?.addEventListener('click', () => sessionStore.setStep(4));
  document.getElementById('backToConcernsBtn')?.addEventListener('click', () => sessionStore.setStep(4));
  document.getElementById('generateRecommendationsBtn')?.addEventListener('click', () => sessionStore.setStep(6));

  document.getElementById('openQRModalBtn')?.addEventListener('click', () => sessionStore.setQRModal(true));
  document.getElementById('previewMobilePageBtn')?.addEventListener('click', () => sessionStore.setMobileView(true));

  document.getElementById('closeQRModalBtn')?.addEventListener('click', () => sessionStore.setQRModal(false));
  document.getElementById('doneWithQRBtn')?.addEventListener('click', () => {
    sessionStore.setQRModal(false);
    sessionStore.setStep(9);
  });
  document.getElementById('directMobileOpenBtn')?.addEventListener('click', () => {
    sessionStore.setQRModal(false);
    sessionStore.setMobileView(true);
  });
  document.getElementById('qrModalBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'qrModalBackdrop') sessionStore.setQRModal(false);
  });

  document.getElementById('returnHomeBtn')?.addEventListener('click', () => sessionStore.clearSession());
}

function bindMobileEvents() {
  document.getElementById('exitMobileViewBtn')?.addEventListener('click', () => {
    sessionStore.setMobileView(false);
    const url = new URL(window.location);
    url.searchParams.delete('view');
    window.history.pushState({}, '', url);
    render();
  });
}

// --- Admin Login Event Bindings ---
function bindAdminLoginEvents() {
  document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwd = document.getElementById('adminPasswordInput').value;
    const success = adminStore.login(pwd);
    if (!success) {
      document.getElementById('app').innerHTML = renderAdminLogin('Invalid pharmacist PIN / password. Try "admin123"');
      bindAdminLoginEvents();
    }
  });
}

// --- Admin Portal Event Bindings ---
function bindAdminEvents() {
  // Navigation
  document.querySelectorAll('.admin-nav-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      adminStore.setTab(tab);
    });
  });

  document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    adminStore.openModal('unsaved', {
      title: 'Confirm Logout',
      message: 'Are you sure you want to end your pharmacist admin session?',
      actionLabel: 'Log Out',
      onConfirm: () => {
        adminStore.logout();
        adminStore.closeModal();
      }
    });
  });

  // Reusable Confirmation Modal Triggers
  document.getElementById('genericModalCancelBtn')?.addEventListener('click', () => adminStore.closeModal());
  document.getElementById('genericModalBackdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'genericModalBackdrop') adminStore.closeModal();
  });
  document.getElementById('genericModalConfirmBtn')?.addEventListener('click', () => {
    if (adminStore.activeModal && adminStore.activeModal.onConfirm) {
      adminStore.activeModal.onConfirm();
    }
  });

  // Dashboard Shortcuts
  document.getElementById('dashAddProductBtn')?.addEventListener('click', () => {
    activeEditingItem = { type: 'product', data: null };
    render();
  });
  document.getElementById('dashViewReportsBtn')?.addEventListener('click', () => adminStore.setTab('reports'));
  document.getElementById('dashSeeAllSessionsBtn')?.addEventListener('click', () => adminStore.setTab('reports'));

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
          ? 'This category will immediately become visible to customers on kiosk terminals.' 
          : 'Hides this category and its products from customer kiosk screens.',
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
      adminStore.openModal('delete', {
        title: 'Delete Category Permanently?',
        message: 'This will permanently remove the category. Products assigned to it must be reassigned.',
        itemName: cat ? cat.name : id,
        onConfirm: () => {
          adminStore.deleteCategory(id);
          adminStore.closeModal();
        }
      });
    });
  });

  // Category Modal Form Submit
  document.getElementById('categoryModalForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('catFormId').value;
    const name = document.getElementById('catFormName').value;
    const icon = document.getElementById('catFormIcon').value;
    const order = Number(document.getElementById('catFormOrder').value) || 1;

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
  document.getElementById('probImageSampleBtn')?.addEventListener('click', () => {
    const samples = [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512290900672-1f55b9355755?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    ];
    document.getElementById('probFormImageUrl').value = samples[Math.floor(Math.random() * samples.length)];
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

  // Live Preview Listeners inside Product Modal
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
    const csvContent = `"brand","name","categoryId","price","instruction","badges","linkedConcerns"
"CeraVe","Hydrating Facial Cleanser","face_wash",1850,"Massage 1 min on damp skin.","Ceramide, Non-comedogenic","mountain_uv_pigmentation, acute_barrier_breakdown"
"The Ordinary","Niacinamide 10% + Zinc 1%","serum",1650,"Apply 3 drops before creams.","Oil Control, Blemish Care","hormonal_inflammatory_acne"
"Biore","UV Aqua Rich Watery Essence SPF50+","sunscreen",1900,"Apply 2 fingers 15m prior to sun.","High Altitude SPF50, PA++++","mountain_uv_pigmentation"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ronit_products_template.csv';
    link.click();
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

  document.getElementById('confirmBulkImportBtn')?.addEventListener('click', () => {
    if (currentImportState && currentImportState.rows) {
      const validRows = currentImportState.rows.filter(r => r.isValid);
      adminStore.bulkImportProducts(validRows);
      currentImportState = null;
      adminStore.setTab('products');
    }
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

  // --- Settings Events ---
  document.querySelectorAll('.setting-input').forEach(input => {
    input.addEventListener('input', () => {
      adminStore.isDirty = true;
    });
  });

  document.getElementById('adminSettingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pharmacyName = document.getElementById('settingPharmacyName').value;
    const leadPharmacist = document.getElementById('settingLeadPharmacist').value;
    const location = document.getElementById('settingLocation').value;
    const phone = document.getElementById('settingPhone').value;
    const logoUrl = document.getElementById('settingLogoUrl').value;
    const welcomeTitle = document.getElementById('settingWelcomeTitle').value;
    const welcomeSubtitle = document.getElementById('settingWelcomeSubtitle').value;
    const severeWarningText = document.getElementById('settingSevereWarningText').value;
    const inactivityTimeoutSeconds = Number(document.getElementById('settingInactivitySeconds').value) || 180;
    const enableOfflineSync = document.getElementById('settingOfflineSync').checked;

    // Check password change if provided
    const oldPwd = document.getElementById('settingCurrentPassword').value;
    const newPwd = document.getElementById('settingNewPassword').value;

    if (oldPwd || newPwd) {
      const pwdRes = adminStore.changePassword(oldPwd, newPwd);
      if (!pwdRes.success) {
        adminStore.showToast(pwdRes.message, 'error');
        return;
      }
    }

    adminStore.updateSettings({
      pharmacyName,
      leadPharmacist,
      location,
      phone,
      logoUrl,
      welcomeTitle,
      welcomeSubtitle,
      severeWarningText,
      inactivityTimeoutSeconds,
      enableOfflineSync
    });
  });
}

function handleImportFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      adminStore.showToast('CSV file must have at least a header and 1 row.', 'error');
      return;
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const validCatIds = adminStore.categories.map(c => c.id);

    const rows = lines.slice(1).map((line, idx) => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const rowObj = {
        brand: values[0] || '',
        name: values[1] || '',
        categoryId: values[2] || '',
        price: Number(values[3]) || 0,
        instruction: values[4] || 'Apply smoothly twice daily.',
        badges: values[5] ? values[5].split(';').map(b => b.trim()) : ['Verified OTC'],
        suitableConcerns: values[6] ? values[6].split(';').map(c => c.trim()) : [],
        errors: [],
        isValid: true
      };

      if (!rowObj.brand) rowObj.errors.push('Missing brand');
      if (!rowObj.name) rowObj.errors.push('Missing product name');
      if (!rowObj.categoryId || !validCatIds.includes(rowObj.categoryId)) {
        rowObj.errors.push(`Invalid category: "${rowObj.categoryId}"`);
      }
      if (!rowObj.price || isNaN(rowObj.price) || rowObj.price <= 0) {
        rowObj.errors.push('Price must be greater than 0');
      }

      if (rowObj.errors.length > 0) {
        rowObj.isValid = false;
      }

      return rowObj;
    });

    currentImportState = {
      filename: file.name,
      rows
    };
    render();
  };
  reader.readAsText(file);
}

// Subscriptions
sessionStore.subscribe(() => render());
adminStore.subscribe(() => render());

window.addEventListener('DOMContentLoaded', () => {
  render();
});
