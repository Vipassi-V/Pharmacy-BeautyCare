// Session Store for Customer Tablet Flow with Supabase Live Catalog and Persistence
import { skinTypes as mockSkinTypes, skinConcerns as mockConcerns, products as mockProducts, productCategories as mockCategories } from '../data/mockData.js';
import { supabase } from '../lib/supabaseClient.js';
import { adminStore } from './adminStore.js';

class SessionStore {
  constructor() {
    this.reset();
    this.listeners = [];
  }

  reset() {
    this.currentStep = 1; // 1: Welcome, 2: Name, 3: SkinType, 4: Concerns, 5: Review, 6: Recommendations, 7: QR Modal, 8: Phone Handover, 9: End Session
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
    this.showEndSessionConfirmModal = false;
    this.isMobileView = false;
    this.sessionId = 'RP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    this.createdAt = new Date().toISOString();
    this.isSavedToSupabase = false;
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
      showEndSessionConfirmModal: this.showEndSessionConfirmModal,
      isMobileView: this.isMobileView,
      sessionId: this.sessionId,
      createdAt: this.createdAt
    };
  }

  setStep(step) {
    this.currentStep = step;
    if (step === 6 && !this.isSavedToSupabase) {
      this.saveSessionToSupabase();
    }
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

  setEndSessionConfirmModal(isOpen) {
    this.showEndSessionConfirmModal = isOpen;
    this.notify();
  }

  setMobileView(isMobile) {
    this.isMobileView = isMobile;
    this.notify();
  }

  getSkinTypes() {
    return mockSkinTypes;
  }

  getSelectedSkinType() {
    return mockSkinTypes.find(t => t.id === this.selectedSkinTypeId) || null;
  }

  // Sourced from active Supabase catalog via adminStore or mock fallback
  getActiveSkinConcerns() {
    if (adminStore.skinProblems && adminStore.skinProblems.length > 0) {
      return adminStore.skinProblems.filter(p => p.status === 'active');
    }
    return mockConcerns;
  }

  getSelectedConcerns() {
    const active = this.getActiveSkinConcerns();
    return active.filter(c => this.selectedConcernIds.includes(c.id));
  }

  hasSevereCondition() {
    const selected = this.getSelectedConcerns();
    return selected.some(c => !!(c.isSevere || c.is_severe));
  }

  getActiveCategories() {
    if (adminStore.categories && adminStore.categories.length > 0) {
      return adminStore.categories.filter(c => c.status === 'active');
    }
    return mockCategories;
  }

  getActiveProducts() {
    if (adminStore.products && adminStore.products.length > 0) {
      return adminStore.products.filter(p => p.status === 'active');
    }
    return mockProducts;
  }

  // Get recommended products without duplicate entries across categories
  getRecommendedProducts() {
    const skinType = this.selectedSkinTypeId;
    const concernIds = this.selectedConcernIds;
    const activeProducts = this.getActiveProducts();
    const activeCategories = this.getActiveCategories();

    // Filter products matching selected skin type or any concern
    const matched = activeProducts.filter(p => {
      const suitableConcerns = p.suitableConcerns || [];
      const suitableTypes = p.suitableSkinTypes || ['dry', 'oily', 'combination', 'sensitive', 'normal'];
      
      const matchesSkin = !skinType || suitableTypes.includes(skinType);
      const matchesConcern = concernIds.length === 0 || suitableConcerns.some(c => concernIds.includes(c));
      return matchesSkin || matchesConcern;
    });

    // Group by category, ensuring every product is listed once in its assigned category
    const grouped = {};
    activeCategories.forEach(cat => {
      grouped[cat.id] = {
        category: cat,
        items: []
      };
    });

    matched.forEach(prod => {
      const catId = prod.categoryId || prod.category_id;
      if (grouped[catId]) {
        if (!grouped[catId].items.find(item => item.id === prod.id)) {
          grouped[catId].items.push(prod);
        }
      } else {
        // Fallback to first category if unassigned
        const firstCatId = activeCategories[0]?.id;
        if (firstCatId && grouped[firstCatId] && !grouped[firstCatId].items.find(item => item.id === prod.id)) {
          grouped[firstCatId].items.push(prod);
        }
      }
    });

    return grouped;
  }

  // Persist completed consultation session to Supabase
  async saveSessionToSupabase() {
    if (this.isSavedToSupabase) return;
    this.isSavedToSupabase = true;

    const skinType = this.getSelectedSkinType();
    const concerns = this.getSelectedConcerns();
    const hasSevere = this.hasSevereCondition();
    const grouped = this.getRecommendedProducts();

    const flattenedProducts = [];
    let displayOrder = 1;
    Object.values(grouped).forEach(g => {
      g.items.forEach(prod => {
        flattenedProducts.push({
          product_id: prod.id && prod.id.length > 30 ? prod.id : null, // UUID check
          product_name: prod.name,
          brand: prod.brand,
          category_name: g.category.name,
          price: Number(prod.price) || 0,
          instruction: prod.instruction || '',
          display_order: displayOrder++
        });
      });
    });

    const recommendationSnapshot = {
      skinType: skinType ? { id: skinType.id, name: skinType.name } : null,
      concerns: concerns.map(c => ({ id: c.id, name: c.title || c.name, isSevere: !!(c.isSevere || c.is_severe) })),
      products: flattenedProducts.map(p => ({
        name: p.product_name,
        brand: p.brand,
        category: p.category_name,
        price: p.price,
        instruction: p.instruction
      }))
    };

    const sessionPayload = {
      first_name: this.customer.firstName || 'Anonymous',
      surname: this.customer.lastName || 'Guest',
      selected_skin_type: skinType ? skinType.name : 'Not Specified',
      is_severe_flagged: hasSevere,
      recommendation_snapshot: recommendationSnapshot
    };

    try {
      // 1. Insert into sessions
      const { data: sessionData, error: sessionErr } = await supabase
        .from('sessions')
        .insert([sessionPayload])
        .select();

      if (sessionErr) {
        console.warn('Supabase sessions insert note:', sessionErr.message || sessionErr);
      } else if (sessionData && sessionData.length > 0) {
        const createdSessionId = sessionData[0].id;

        // 2. Insert session concerns
        if (concerns.length > 0) {
          const concernRows = concerns.map(c => ({
            session_id: createdSessionId,
            skin_problem_id: c.id && c.id.length > 30 ? c.id : null,
            skin_problem_name: c.title || c.name,
            is_severe: !!(c.isSevere || c.is_severe)
          }));
          await supabase.from('session_concerns').insert(concernRows).catch(e => console.warn('session_concerns insert note:', e));
        }

        // 3. Insert session products
        if (flattenedProducts.length > 0) {
          const productRows = flattenedProducts.map(p => ({
            session_id: createdSessionId,
            product_id: p.product_id,
            product_name: p.product_name,
            brand: p.brand,
            category_name: p.category_name,
            price: p.price,
            instruction: p.instruction,
            display_order: p.display_order
          }));
          await supabase.from('session_products').insert(productRows).catch(e => console.warn('session_products insert note:', e));
        }

        // Refresh admin sessions view
        adminStore.fetchSessions();
      }
    } catch (err) {
      console.warn('Session save exception:', err);
    }
  }

  clearSession() {
    this.reset();
    this.notify();
  }
}

export const sessionStore = new SessionStore();

