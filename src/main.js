import './style.css';
import { sessionStore } from './store/sessionStore.js';
import QRCode from 'qrcode';
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
  renderMobilePage,
  renderEndSessionScreen
} from './components/views.js';

let resetTimerInterval = null;

function render() {
  const state = sessionStore.getState();
  const app = document.getElementById('app');

  // Handle Mobile Handover view directly
  if (state.isMobileView) {
    app.innerHTML = renderMobilePage(state);
    bindMobileEvents();
    return;
  }

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

  bindEvents();
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

function bindEvents() {
  // Global Header Nav
  document.getElementById('headerHomeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStore.setStep(1);
  });

  document.getElementById('endSessionTopBtn')?.addEventListener('click', () => {
    sessionStore.setStep(9);
  });

  // Step 1: Welcome
  document.getElementById('startConsultationBtn')?.addEventListener('click', () => {
    sessionStore.setStep(2);
  });

  // Step 2: Name Entry Form
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

  document.getElementById('backToWelcomeBtn')?.addEventListener('click', () => {
    sessionStore.setStep(1);
  });

  // Step 3: Skin Type Selection
  document.querySelectorAll('.selection-card[data-type-id]').forEach(card => {
    card.addEventListener('click', () => {
      const typeId = card.getAttribute('data-type-id');
      sessionStore.selectSkinType(typeId);
    });
  });

  document.getElementById('backToNameBtn')?.addEventListener('click', () => {
    sessionStore.setStep(2);
  });

  document.getElementById('continueToConcernsBtn')?.addEventListener('click', () => {
    if (sessionStore.getState().selectedSkinTypeId) {
      sessionStore.setStep(4);
    }
  });

  // Step 4: Skin Concerns (Expand & Add/Remove Toggles)
  document.querySelectorAll('.concern-card[data-concern-id]').forEach(card => {
    const concernId = card.getAttribute('data-concern-id');

    // Body click toggles description expansion
    card.querySelector('.concern-body')?.addEventListener('click', () => {
      sessionStore.toggleExpandConcern(concernId);
    });

    // Add button click toggles selection
    card.querySelector('.btn-add-concern')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sessionStore.toggleConcern(concernId);
    });
  });

  document.getElementById('backToSkinTypeBtn')?.addEventListener('click', () => {
    sessionStore.setStep(3);
  });

  document.getElementById('proceedToReviewBtn')?.addEventListener('click', () => {
    if (sessionStore.getState().selectedConcernIds.length > 0) {
      sessionStore.setStep(5);
    }
  });

  // Step 5: Review Actions
  document.getElementById('editNameBtn')?.addEventListener('click', () => sessionStore.setStep(2));
  document.getElementById('editSkinTypeBtn')?.addEventListener('click', () => sessionStore.setStep(3));
  document.getElementById('editConcernsBtn')?.addEventListener('click', () => sessionStore.setStep(4));
  document.getElementById('backToConcernsBtn')?.addEventListener('click', () => sessionStore.setStep(4));
  document.getElementById('generateRecommendationsBtn')?.addEventListener('click', () => sessionStore.setStep(6));

  // Step 6: Recommendations
  document.getElementById('openQRModalBtn')?.addEventListener('click', () => {
    sessionStore.setQRModal(true);
  });

  document.getElementById('previewMobilePageBtn')?.addEventListener('click', () => {
    sessionStore.setMobileView(true);
  });

  // Step 7: QR Modal Actions
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
    if (e.target.id === 'qrModalBackdrop') {
      sessionStore.setQRModal(false);
    }
  });

  // Step 9: End Session
  document.getElementById('returnHomeBtn')?.addEventListener('click', () => {
    sessionStore.clearSession();
  });
}

function bindMobileEvents() {
  document.getElementById('exitMobileViewBtn')?.addEventListener('click', () => {
    sessionStore.setMobileView(false);
  });
}

// Subscribe to store updates
sessionStore.subscribe(() => {
  render();
});

// Check if URL query has mobile handover request
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'mobile') {
    sessionStore.setMobileView(true);
  }
  render();
});
