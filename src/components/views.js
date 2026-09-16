import { pharmacyInfo, skinTypes, skinConcerns, productCategories } from '../data/mockData.js';
import { sessionStore } from '../store/sessionStore.js';
import QRCode from 'qrcode';

// Header Component
export function renderHeader(state) {
  return `
    <header class="kiosk-header">
      <div class="kiosk-header-inner">
        <a href="#" class="brand-emblem" id="headerHomeBtn">
          <div class="brand-icon-box">
            <span class="material-symbols-outlined" style="font-size: 26px;">local_pharmacy</span>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="font-label-lg" style="color: var(--primary);">${pharmacyInfo.name}</span>
              <span class="location-chip">
                <span class="material-symbols-outlined" style="font-size: 14px;">location_on</span>
                Tansen, Palpa
              </span>
            </div>
            <div class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.8rem;">
              ${pharmacyInfo.subtitle} • Interactive Skin Clinic Kiosk
            </div>
          </div>
        </a>

        ${state.currentStep > 1 && state.currentStep < 9 ? `
          <button class="btn-danger-ghost" id="endSessionTopBtn" style="font-size: 0.85rem; padding: 0 0.9rem; min-height: 40px;">
            <span class="material-symbols-outlined" style="font-size: 18px;">power_settings_new</span>
            End Session
          </button>
        ` : ''}
      </div>
    </header>
  `;
}

// Stepper Component
export function renderStepper(currentStep) {
  if (currentStep < 2 || currentStep > 6) return '';
  const totalSteps = 5;
  const activeIndex = currentStep - 2; // Step 2 (Name) is index 0

  let dotsHtml = '';
  for (let i = 0; i < totalSteps; i++) {
    const cls = i === activeIndex ? 'active' : (i < activeIndex ? 'completed' : '');
    dotsHtml += `<div class="step-dot ${cls}"></div>`;
  }

  const stepLabels = ["Your Info", "Skin Type", "Concerns", "Review", "Regimen"];

  return `
    <div style="text-align: center; margin-top: 1rem;">
      <div class="progress-stepper">
        ${dotsHtml}
      </div>
      <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: 0.05em;">
        Step ${activeIndex + 1} of ${totalSteps}: <span style="color: var(--primary); font-weight: 700;">${stepLabels[activeIndex]}</span>
      </div>
    </div>
  `;
}

// 1. Welcome Screen
export function renderWelcomeScreen() {
  return `
    <div class="kiosk-container" style="max-width: 720px; text-align: center; padding: 2.5rem 1rem;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 88px; height: 88px; border-radius: 24px; background: #f0fdf4; border: 2px solid var(--primary-fixed-dim); color: var(--primary-container); margin-bottom: 1.5rem; box-shadow: var(--shadow-level-1);">
        <span class="material-symbols-outlined" style="font-size: 48px;">spa</span>
      </div>

      <h1 class="font-headline-xl" style="color: var(--primary); margin-bottom: 0.75rem;">
        Welcome to Ronit Skincare Consultation
      </h1>
      
      <p class="font-body-lg" style="color: var(--on-surface-variant); max-width: 580px; margin: 0 auto 2rem;">
        Get an altitude-calibrated, clinical skincare routine tailored to your skin type and concerns in Tansen, Palpa.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; text-align: left;">
        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="color: var(--secondary); margin-bottom: 0.5rem;">
            <span class="material-symbols-outlined" style="font-size: 28px;">verified_user</span>
          </div>
          <div class="font-label-md" style="color: var(--on-surface); margin-bottom: 0.25rem;">Pharmacist-Curated</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">Safe, clinically verified OTC formulations.</div>
        </div>

        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="color: var(--primary-container); margin-bottom: 0.5rem;">
            <span class="material-symbols-outlined" style="font-size: 28px;">wb_sunny</span>
          </div>
          <div class="font-label-md" style="color: var(--on-surface); margin-bottom: 0.25rem;">Altitude-Aware Defense</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">Formulated for high UV & mountain dry weather.</div>
        </div>

        <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
          <div style="color: var(--tertiary-container); margin-bottom: 0.5rem;">
            <span class="material-symbols-outlined" style="font-size: 28px;">qr_code_2</span>
          </div>
          <div class="font-label-md" style="color: var(--on-surface); margin-bottom: 0.25rem;">Phone Sync</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">Instant QR code handover to take home.</div>
        </div>
      </div>

      <button class="btn-primary" id="startConsultationBtn" style="font-size: 1.15rem; min-height: 64px; padding: 0 2.5rem; border-radius: 16px; width: 100%; max-width: 380px;">
        <span>Start Consultation</span>
        <span class="material-symbols-outlined" style="font-size: 24px;">arrow_forward</span>
      </button>

      <div class="font-body-sm" style="color: var(--outline); margin-top: 1.25rem;">
        Takes ~2 minutes • No account registration required
      </div>
    </div>
  `;
}

// 2. Customer Name Entry
export function renderNameScreen(state) {
  return `
    <div class="kiosk-container" style="max-width: 600px; padding-top: 1.5rem;">
      <div style="margin-bottom: 2rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Let's personalize your visit
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Please enter your name so we can customize your skincare routine.
        </p>
      </div>

      <form id="nameEntryForm" style="background: #ffffff; padding: 2rem; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; box-shadow: var(--shadow-level-1);">
        <div class="form-group">
          <label class="form-label" for="firstNameInput">
            First Name <span style="color: var(--error);">*</span>
          </label>
          <input 
            type="text" 
            id="firstNameInput" 
            class="form-input" 
            placeholder="e.g. Ronit, Sunita, Aarav" 
            value="${state.customer.firstName}" 
            required 
            autocomplete="off"
            autofocus
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="lastNameInput">
            Surname / Last Name <span style="color: var(--error);">*</span>
          </label>
          <input 
            type="text" 
            id="lastNameInput" 
            class="form-input" 
            placeholder="e.g. Shrestha, Thapa, Pandey" 
            value="${state.customer.lastName}" 
            required 
            autocomplete="off"
          />
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="btn-ghost" id="backToWelcomeBtn" style="flex: 1;">
            <span class="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <button type="submit" class="btn-primary" style="flex: 2;">
            <span>Continue to Skin Type</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  `;
}

// 3. Skin Type Selection
export function renderSkinTypeScreen(state) {
  const cardsHtml = skinTypes.map(st => {
    const isSelected = state.selectedSkinTypeId === st.id;
    return `
      <div class="selection-card ${isSelected ? 'selected' : ''}" data-type-id="${st.id}">
        <div class="selection-radio">
          ${isSelected ? '<span class="material-symbols-outlined" style="font-size: 18px;">check</span>' : ''}
        </div>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="font-headline-sm" style="color: var(--on-surface); font-size: 1.15rem;">${st.name}</span>
            <span class="font-label-sm" style="color: var(--secondary); background: #f0fdfa; padding: 2px 8px; border-radius: 9999px;">${st.nepaliName}</span>
          </div>
          <div class="font-label-md" style="color: var(--primary-container); margin-bottom: 6px;">${st.tagline}</div>
          <div class="font-body-sm" style="color: var(--on-surface-variant);">${st.description}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="kiosk-container" style="padding-top: 1rem; padding-bottom: 3rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          What is your primary skin type?
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Select the option that best describes how your skin feels throughout a normal day.
        </p>
      </div>

      <div class="selection-grid" style="margin-bottom: 2rem;">
        ${cardsHtml}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-ghost" id="backToNameBtn">
          <span class="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button class="btn-primary" id="continueToConcernsBtn" ${!state.selectedSkinTypeId ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>
          <span>Next: Select Concerns</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

// 4. Skin Concern Selection Screen (Cart-style Tray + Expandable Cards)
export function renderConcernsScreen(state) {
  const count = state.selectedConcernIds.length;

  const cardsHtml = skinConcerns.map(concern => {
    const isSelected = state.selectedConcernIds.includes(concern.id);
    const isExpanded = state.expandedConcernIds.includes(concern.id);

    return `
      <div class="concern-card ${isSelected ? 'selected' : ''}" data-concern-id="${concern.id}">
        <!-- Image without decorative tags -->
        <img src="${concern.image}" alt="${concern.title}" class="concern-header-img" />

        <!-- Card Body (Clicking expands or collapses full description) -->
        <div class="concern-body" data-action="toggle-expand">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <h3 class="font-headline-sm" style="color: var(--on-surface); font-size: 1.15rem; line-height: 1.3;">
              ${concern.title}
            </h3>
            ${concern.isSevere ? `
              <span style="display: inline-flex; align-items: center; gap: 2px; color: var(--tertiary); background: var(--warning-wash); padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="font-size: 14px;">priority_high</span>
                Severe
              </span>
            ` : ''}
          </div>

          <div class="font-label-sm" style="color: var(--secondary); margin-bottom: 8px;">
            ${concern.nepaliTitle}
          </div>

          <div class="font-body-sm" style="color: var(--on-surface-variant); margin-bottom: 8px;">
            ${isExpanded ? concern.description : concern.summary}
          </div>

          <button type="button" class="expand-toggle">
            <span>${isExpanded ? 'Show Less' : 'Read Clinical Details'}</span>
            <span class="material-symbols-outlined" style="font-size: 18px;">
              ${isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        <!-- Card Footer Actions: Add / Added Toggle -->
        <div class="concern-actions">
          <div class="font-body-sm" style="color: var(--outline);">
            ${isSelected ? '<span style="color: var(--primary); font-weight: 600;">Selected for analysis</span>' : 'Tap Add to include'}
          </div>

          <button 
            type="button" 
            class="btn-add-concern ${isSelected ? 'selected' : 'unselected'}" 
            data-action="toggle-add"
          >
            <span class="material-symbols-outlined" style="font-size: 18px;">
              ${isSelected ? 'check' : 'add'}
            </span>
            <span>${isSelected ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="kiosk-container" style="padding-top: 1rem; padding-bottom: 6rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Select your active skin concerns
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Select all that apply. Tap any card body to read full details, or click Add to include in your routine.
        </p>
      </div>

      <div class="selection-grid selection-grid-2">
        ${cardsHtml}
      </div>
    </div>

    <!-- Floating Bottom Selection Tray (Shopping-cart style counter & action) -->
    <div class="floating-bottom-tray">
      <div class="tray-content">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="btn-ghost" id="backToSkinTypeBtn">
            <span class="material-symbols-outlined">arrow_back</span>
            Back
          </button>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="tray-counter-badge">${count}</span>
            <div>
              <div class="font-label-md" style="color: var(--on-surface);">
                ${count === 0 ? 'No concerns selected' : `${count} Concern${count > 1 ? 's' : ''} Selected`}
              </div>
              <div class="font-body-sm" style="color: var(--on-surface-variant); font-size: 0.8rem;">
                ${count === 0 ? 'Pick at least 1 concern' : 'Ready to generate customized regimen'}
              </div>
            </div>
          </div>
        </div>

        <button 
          class="btn-primary" 
          id="proceedToReviewBtn"
          ${count === 0 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}
        >
          <span>Review Selection</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

// 5. Review Information Screen
export function renderReviewScreen(state) {
  const skinType = sessionStore.getSelectedSkinType();
  const concerns = sessionStore.getSelectedConcerns();
  const hasSevere = sessionStore.hasSevereCondition();

  const concernsListHtml = concerns.map(c => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${c.image}" alt="${c.title}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" />
        <div>
          <div class="font-label-md" style="color: var(--on-surface);">${c.title}</div>
          <div class="font-body-sm" style="color: var(--secondary);">${c.nepaliTitle}</div>
        </div>
      </div>
      ${c.isSevere ? `
        <span style="color: var(--tertiary); background: var(--warning-wash); padding: 3px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">
          Severe Condition
        </span>
      ` : `
        <span style="color: var(--primary); font-size: 0.85rem; font-weight: 600;">Active Target</span>
      `}
    </div>
  `).join('');

  return `
    <div class="kiosk-container" style="max-width: 680px; padding-top: 1.5rem; padding-bottom: 3rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Review Your Skin Profile
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant);">
          Please confirm your details before we build your personalized product recommendations.
        </p>
      </div>

      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-level-1); margin-bottom: 1.5rem;">
        <!-- Customer Info -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1.5px solid #e2e8f0; margin-bottom: 1.25rem;">
          <div>
            <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Customer Name</div>
            <div class="font-headline-sm" style="color: var(--primary);">${state.customer.firstName} ${state.customer.lastName}</div>
          </div>
          <button class="btn-ghost" id="editNameBtn" style="font-size: 0.85rem; padding: 0 0.75rem;">Edit</button>
        </div>

        <!-- Skin Type -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1.5px solid #e2e8f0; margin-bottom: 1.25rem;">
          <div>
            <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">Primary Skin Type</div>
            <div class="font-headline-sm" style="color: var(--on-surface);">${skinType ? skinType.name : 'Not selected'}</div>
            <div class="font-body-sm" style="color: var(--secondary);">${skinType ? skinType.tagline : ''}</div>
          </div>
          <button class="btn-ghost" id="editSkinTypeBtn" style="font-size: 0.85rem; padding: 0 0.75rem;">Change</button>
        </div>

        <!-- Concerns -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div class="font-label-sm" style="color: var(--on-surface-variant); text-transform: uppercase;">
              Selected Concerns (${concerns.length})
            </div>
            <button class="btn-ghost" id="editConcernsBtn" style="font-size: 0.85rem; padding: 0 0.75rem;">Modify</button>
          </div>
          <div>
            ${concernsListHtml}
          </div>
        </div>

        ${hasSevere ? `
          <div style="margin-top: 1.25rem; padding: 0.9rem; background: var(--warning-wash); border-radius: var(--radius-md); display: flex; align-items: center; gap: 8px; color: var(--tertiary);">
            <span class="material-symbols-outlined" style="font-size: 20px;">info</span>
            <span class="font-body-sm" style="font-weight: 600;">A severe condition was noted. Specialized precautions will be included in your recommendations.</span>
          </div>
        ` : ''}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-ghost" id="backToConcernsBtn">
          <span class="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button class="btn-primary" id="generateRecommendationsBtn" style="font-size: 1.05rem; padding: 0 2rem;">
          <span>Generate Recommendations</span>
          <span class="material-symbols-outlined">auto_awesome</span>
        </button>
      </div>
    </div>
  `;
}

// 6. Product Recommendations Screen
export function renderRecommendationsScreen(state) {
  const grouped = sessionStore.getRecommendedProducts();
  const hasSevere = sessionStore.hasSevereCondition();
  const selectedConcerns = sessionStore.getSelectedConcerns();

  let categoriesHtml = '';

  productCategories.forEach(cat => {
    const group = grouped[cat.id];
    if (!group || group.items.length === 0) return;

    const productsHtml = group.items.map(prod => `
      <div class="product-card">
        <img src="${prod.image}" alt="${prod.name}" class="product-card-img" />
        <div class="product-card-body">
          <div class="font-label-sm" style="color: var(--secondary); text-transform: uppercase; margin-bottom: 4px;">
            ${prod.brand}
          </div>
          <h4 class="font-headline-sm" style="color: var(--on-surface); font-size: 1.1rem; line-height: 1.35; margin-bottom: 8px;">
            ${prod.name}
          </h4>

          <div class="product-badges">
            ${prod.badges.map(b => `<span class="product-badge">${b}</span>`).join('')}
          </div>

          <div class="product-instruction-box">
            <div style="display: flex; align-items: center; gap: 4px; font-weight: 600; color: var(--secondary); margin-bottom: 2px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">schedule</span>
              Application Usage:
            </div>
            ${prod.instruction}
          </div>

          <div style="margin-top: auto; padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div class="font-label-sm" style="color: var(--outline);">Pharmacy Price</div>
              <div class="product-price-tag">Rs. ${prod.price.toLocaleString()}</div>
            </div>
            <span style="display: inline-flex; align-items: center; gap: 4px; color: var(--primary); font-size: 0.85rem; font-weight: 600; background: #f0fdf4; padding: 4px 10px; border-radius: 9999px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">check_circle</span>
              In Stock
            </span>
          </div>
        </div>
      </div>
    `).join('');

    categoriesHtml += `
      <div class="category-section">
        <div class="category-header">
          <div class="category-icon">
            <span class="material-symbols-outlined" style="font-size: 22px;">${cat.icon}</span>
          </div>
          <h3 class="font-headline-md" style="color: var(--on-surface);">${cat.name}</h3>
        </div>
        <div class="selection-grid selection-grid-2">
          ${productsHtml}
        </div>
      </div>
    `;
  });

  return `
    <div class="kiosk-container" style="padding-top: 1.5rem; padding-bottom: 5rem;">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; color: var(--primary-container); padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">
          <span class="material-symbols-outlined" style="font-size: 16px;">verified</span>
          Customized for ${state.customer.firstName} ${state.customer.lastName}
        </div>
        <h2 class="font-headline-lg" style="color: var(--on-surface); margin-bottom: 0.5rem;">
          Your Pharmacist-Recommended Regimen
        </h2>
        <p class="font-body-md" style="color: var(--on-surface-variant); max-width: 600px; margin: 0 auto;">
          Formulated to target your specific concerns while protecting against high-altitude mountain sun in Palpa.
        </p>
      </div>

      <!-- Severe Condition Warning Banner (Shown if any concern is marked severe) -->
      ${hasSevere ? `
        <div class="severe-warning-banner">
          <span class="material-symbols-outlined severe-warning-icon">health_and_safety</span>
          <div>
            <div class="font-headline-sm" style="color: var(--tertiary); font-size: 1.15rem; margin-bottom: 4px;">
              Clinical Pharmacist Consultation Advisory
            </div>
            <div class="font-body-md" style="color: #78350f; line-height: 1.5;">
              One or more of your selected concerns (${selectedConcerns.filter(c => c.isSevere).map(c => `<strong>${c.title}</strong>`).join(', ')}) indicates acute skin irritation or infection risk. 
              <strong>Please speak directly with our attending pharmacist at the counter before beginning any high-strength exfoliants or peeling agents.</strong>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Categorized Products -->
      <div>
        ${categoriesHtml}
      </div>

      <!-- Action Footer -->
      <div style="margin-top: 3rem; padding: 2rem; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem; box-shadow: var(--shadow-level-1);">
        <div>
          <h4 class="font-headline-sm" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            Take this routine with you on your phone
          </h4>
          <p class="font-body-sm" style="color: var(--on-surface-variant);">
            Scan our live QR code to open and save your product list directly onto your smartphone.
          </p>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <button class="btn-secondary" id="openQRModalBtn" style="min-height: 56px;">
            <span class="material-symbols-outlined">qr_code_scanner</span>
            <span>Scan QR Code</span>
          </button>
          <button class="btn-ghost" id="previewMobilePageBtn" style="min-height: 56px;">
            <span class="material-symbols-outlined">phone_iphone</span>
            <span>View Mobile Page</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 7. QR Sharing Modal
export function renderQRModal(state) {
  if (!state.showQRModal) return '';

  return `
    <div class="modal-backdrop" id="qrModalBackdrop">
      <div class="modal-dialog">
        <div style="padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined" style="color: var(--primary-container);">qr_code_2</span>
            <h3 class="font-headline-sm" style="color: var(--on-surface);">Scan Regimen to Phone</h3>
          </div>
          <button class="btn-ghost" id="closeQRModalBtn" style="min-height: 36px; padding: 0 8px;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style="padding: 2rem; text-align: center;">
          <div style="background: #f8fafc; padding: 1.25rem; border-radius: var(--radius-lg); display: inline-block; margin-bottom: 1.25rem; border: 1px solid #e2e8f0;">
            <canvas id="qrCanvas" style="display: block; margin: 0 auto; width: 220px; height: 220px;"></canvas>
          </div>

          <div class="font-label-lg" style="color: var(--on-surface); margin-bottom: 0.25rem;">
            Consultation Pass: ${state.sessionId}
          </div>
          <p class="font-body-sm" style="color: var(--on-surface-variant); max-width: 360px; margin: 0 auto 1.5rem;">
            Point your mobile camera at this QR code to view your personalized routine, dosage instructions, and product prices on your phone.
          </p>

          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button class="btn-secondary" id="directMobileOpenBtn" style="min-height: 48px; font-size: 0.95rem;">
              <span class="material-symbols-outlined">open_in_new</span>
              <span>Open Handover View</span>
            </button>
            <button class="btn-primary" id="doneWithQRBtn" style="min-height: 48px; font-size: 0.95rem;">
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 8. Mobile Recommendation Page (Phone View)
export function renderMobilePage(state) {
  const skinType = sessionStore.getSelectedSkinType();
  const concerns = sessionStore.getSelectedConcerns();
  const grouped = sessionStore.getRecommendedProducts();
  const hasSevere = sessionStore.hasSevereCondition();

  let productsList = '';
  productCategories.forEach(cat => {
    const group = grouped[cat.id];
    if (!group || group.items.length === 0) return;

    productsList += `
      <div style="margin-top: 1.25rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px;">
          <span class="material-symbols-outlined" style="font-size: 16px;">${cat.icon}</span>
          ${cat.name}
        </div>
        ${group.items.map(p => `
          <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; padding: 1rem; margin-bottom: 0.75rem; box-shadow: var(--shadow-level-1);">
            <div style="display: flex; gap: 12px; margin-bottom: 0.5rem;">
              <img src="${p.image}" alt="${p.name}" style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; flex-shrink: 0;" />
              <div>
                <div style="font-size: 0.75rem; font-weight: 600; color: var(--secondary);">${p.brand}</div>
                <div style="font-size: 0.95rem; font-weight: 700; color: var(--on-surface); line-height: 1.25;">${p.name}</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-top: 4px;">Rs. ${p.price.toLocaleString()}</div>
              </div>
            </div>
            <div style="background: #f8fafc; border-left: 2px solid var(--secondary); padding: 6px 8px; font-size: 0.8rem; color: var(--on-surface-variant); border-radius: 4px;">
              <strong>Usage:</strong> ${p.instruction}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  });

  return `
    <div class="mobile-view-wrapper">
      <!-- Mobile App Header -->
      <div style="padding: 1rem; background: var(--primary-container); color: #ffffff; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-outlined">local_pharmacy</span>
          <div>
            <div style="font-size: 0.95rem; font-weight: 700;">${pharmacyInfo.name}</div>
            <div style="font-size: 0.75rem; opacity: 0.9;">Tansen, Palpa • Routine Pass</div>
          </div>
        </div>
        <button class="btn-ghost" id="exitMobileViewBtn" style="color: #ffffff; min-height: 36px; padding: 0 8px;">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div style="padding: 1rem; background: #f8f9ff; flex: 1;">
        <!-- User Summary -->
        <div style="background: #ffffff; border-radius: var(--radius-lg); padding: 1rem; border: 1px solid #e2e8f0; margin-bottom: 1rem;">
          <div style="font-size: 0.75rem; color: var(--outline); text-transform: uppercase;">Prescription For</div>
          <div style="font-size: 1.15rem; font-weight: 700; color: var(--primary);">${state.customer.firstName} ${state.customer.lastName}</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;">
            <span style="font-size: 0.75rem; background: #eff4ff; color: var(--secondary); padding: 2px 8px; border-radius: 9999px; font-weight: 600;">
              ${skinType ? skinType.name : ''}
            </span>
            ${concerns.map(c => `<span style="font-size: 0.75rem; background: #f0fdf4; color: var(--primary-container); padding: 2px 8px; border-radius: 9999px; font-weight: 600;">${c.title}</span>`).join('')}
          </div>
        </div>

        ${hasSevere ? `
          <div style="background: var(--warning-wash); border: 1px solid #fcd34d; border-left: 4px solid var(--warning-stripe); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.85rem; color: #78350f; margin-bottom: 1rem;">
            <strong>Pharmacist Note:</strong> Severe skin condition flagged. Please consult our attending pharmacist before applying active exfoliants.
          </div>
        ` : ''}

        <!-- Products -->
        <h3 style="font-size: 1rem; font-weight: 700; color: var(--on-surface);">Recommended Skincare Items</h3>
        ${productsList}

        <!-- Pharmacy Contact -->
        <div style="margin-top: 1.5rem; padding: 1rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid #e2e8f0; text-align: center;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--on-surface);">${pharmacyInfo.name}</div>
          <div style="font-size: 0.8rem; color: var(--on-surface-variant);">${pharmacyInfo.subLocation}</div>
          <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 4px;">Phone: ${pharmacyInfo.phone}</div>
        </div>
      </div>
    </div>
  `;
}

// 9. End Session Screen
export function renderEndSessionScreen() {
  return `
    <div class="kiosk-container" style="max-width: 600px; text-align: center; padding: 3rem 1rem;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 20px; background: #f0fdf4; border: 2px solid var(--primary-fixed-dim); color: var(--primary-container); margin-bottom: 1.5rem;">
        <span class="material-symbols-outlined" style="font-size: 40px;">check_circle</span>
      </div>

      <h2 class="font-headline-lg" style="color: var(--primary); margin-bottom: 0.5rem;">
        Thank You for Visiting!
      </h2>
      <p class="font-body-md" style="color: var(--on-surface-variant); max-width: 480px; margin: 0 auto 2rem;">
        Your consultation session is complete. For your privacy, session details will automatically reset for the next customer.
      </p>

      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-level-1); text-align: left;">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 24px;">storefront</span>
          <div>
            <div class="font-label-md" style="color: var(--on-surface);">Need product assistance right now?</div>
            <div class="font-body-sm" style="color: var(--on-surface-variant);">
              Take your prescription slip or phone pass to our counter. Our pharmacist is ready to assist you.
            </div>
          </div>
        </div>
      </div>

      <button class="btn-primary" id="returnHomeBtn" style="font-size: 1.1rem; min-height: 56px; padding: 0 2rem; border-radius: 14px;">
        <span class="material-symbols-outlined">restart_alt</span>
        <span>Start New Consultation</span>
      </button>

      <div class="font-body-sm" id="autoResetTimer" style="color: var(--outline); margin-top: 1.5rem;">
        Auto-resetting in 30 seconds...
      </div>
    </div>
  `;
}
