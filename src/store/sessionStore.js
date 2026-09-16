// Session Store for Customer Tablet Flow
import { skinTypes, skinConcerns, products, productCategories } from '../data/mockData.js';

class SessionStore {
  constructor() {
    this.reset();
    this.listeners = [];
  }

  reset() {
    this.currentStep = 1; // 1: Welcome, 2: Name, 3: SkinType, 4: Concerns, 5: Review, 6: Recommendations, 7: QR Modal (overlay), 8: Phone Handover, 9: End Session
    this.customer = {
      firstName: '',
      lastName: '',
      gender: '',
      ageGroup: ''
    };
    this.selectedSkinTypeId = null;
    this.selectedConcernIds = [];
    this.expandedConcernIds = [];
    this.showQRModal = false;
    this.isMobileView = false;
    this.sessionId = 'RP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    this.createdAt = new Date().toISOString();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  getState() {
    return {
      currentStep: this.currentStep,
      customer: { ...this.customer },
      selectedSkinTypeId: this.selectedSkinTypeId,
      selectedConcernIds: [...this.selectedConcernIds],
      expandedConcernIds: [...this.expandedConcernIds],
      showQRModal: this.showQRModal,
      isMobileView: this.isMobileView,
      sessionId: this.sessionId,
      createdAt: this.createdAt
    };
  }

  setStep(step) {
    this.currentStep = step;
    this.notify();
  }

  setCustomerName(firstName, lastName) {
    this.customer.firstName = firstName.trim();
    this.customer.lastName = lastName.trim();
    this.notify();
  }

  selectSkinType(typeId) {
    this.selectedSkinTypeId = typeId;
    this.notify();
  }

  toggleConcern(concernId) {
    const idx = this.selectedConcernIds.indexOf(concernId);
    if (idx > -1) {
      this.selectedConcernIds.splice(idx, 1);
    } else {
      this.selectedConcernIds.push(concernId);
    }
    this.notify();
  }

  toggleExpandConcern(concernId) {
    const idx = this.expandedConcernIds.indexOf(concernId);
    if (idx > -1) {
      this.expandedConcernIds.splice(idx, 1);
    } else {
      this.expandedConcernIds.push(concernId);
    }
    this.notify();
  }

  setQRModal(isOpen) {
    this.showQRModal = isOpen;
    this.notify();
  }

  setMobileView(isMobile) {
    this.isMobileView = isMobile;
    this.notify();
  }

  getSelectedSkinType() {
    return skinTypes.find(t => t.id === this.selectedSkinTypeId) || null;
  }

  getSelectedConcerns() {
    return skinConcerns.filter(c => this.selectedConcernIds.includes(c.id));
  }

  hasSevereCondition() {
    const selected = this.getSelectedConcerns();
    return selected.some(c => c.isSevere);
  }

  // Get recommended products without duplicate entries across categories
  getRecommendedProducts() {
    const skinType = this.selectedSkinTypeId;
    const concernIds = this.selectedConcernIds;

    // Filter products matching selected skin type or any concern
    const matched = products.filter(p => {
      const matchesSkin = !skinType || p.suitableSkinTypes.includes(skinType);
      const matchesConcern = concernIds.length === 0 || p.suitableConcerns.some(c => concernIds.includes(c));
      return matchesSkin || matchesConcern;
    });

    // Group by category, ensuring every product is listed once in its assigned category
    const grouped = {};
    productCategories.forEach(cat => {
      grouped[cat.id] = {
        category: cat,
        items: []
      };
    });

    matched.forEach(prod => {
      if (grouped[prod.categoryId]) {
        // Double check uniqueness
        if (!grouped[prod.categoryId].items.find(item => item.id === prod.id)) {
          grouped[prod.categoryId].items.push(prod);
        }
      }
    });

    return grouped;
  }

  clearSession() {
    this.reset();
    this.notify();
  }
}

export const sessionStore = new SessionStore();
