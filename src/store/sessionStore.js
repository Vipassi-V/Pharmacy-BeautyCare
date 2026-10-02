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
    this.saveToLocalStorage();
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
    // If moving to recommendations and products have no concern links,
    // trigger a fresh product fetch to get the latest junction table data
    if (step === 6) {
      const activeProducts = adminStore.products.filter(p => p.status === 'active' || p.is_active === true);
      const linkedCount = activeProducts.filter(p => (p.suitableConcerns || []).length > 0).length;
      if (activeProducts.length > 0 && linkedCount === 0) {
        console.log('[setStep→6] Products have no concern links — triggering fresh catalog fetch...');
        adminStore.fetchProducts().then(() => this.notify());
      }
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

  toggleSelectConcern(concernId) {
    this.toggleConcern(concernId);
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

  // Sourced strictly from active Supabase catalog
  getActiveSkinConcerns() {
    if (adminStore.skinProblems && adminStore.skinProblems.length > 0) {
      return adminStore.skinProblems.filter(p => p.status === 'active' || p.is_active === true);
    }
    return [];
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
      return adminStore.categories.filter(c => c.status === 'active' || c.is_active === true);
    }
    return [];
  }

  getActiveProducts() {
    if (adminStore.products && adminStore.products.length > 0) {
      return adminStore.products.filter(p => p.status === 'active' || p.is_active === true);
    }
    return [];
  }

  // Save session state to localStorage for offline persistence across tabs
  saveToLocalStorage() {
    try {
      const payload = {
        sessionId: this.sessionId,
        customer: this.customer,
        selectedSkinTypeId: this.selectedSkinTypeId,
        selectedConcernIds: this.selectedConcernIds,
        createdAt: this.createdAt
      };
      localStorage.setItem('rp_current_session', JSON.stringify(payload));
      if (this.sessionId) {
        localStorage.setItem(`rp_session_${this.sessionId}`, JSON.stringify(payload));
      }
    } catch {}
  }

  // Generates complete share URL with encoded state parameters for 100% cross-device sync
  getMobileShareUrl() {
    const base = window.location.origin;
    const params = new URLSearchParams();
    params.set('session', this.sessionId);
    params.set('view', 'mobile');
    if (this.selectedSkinTypeId) params.set('st', this.selectedSkinTypeId);
    if (this.selectedConcernIds.length > 0) params.set('c', this.selectedConcernIds.join(','));
    if (this.customer.firstName) params.set('fn', this.customer.firstName);
    if (this.customer.lastName) params.set('ln', this.customer.lastName);
    return `${base}/?${params.toString()}`;
  }

  // Synchronously parse session parameters from URL upon QR scan
  loadSessionFromUrl(urlParams) {
    if (!urlParams) return;
    const session = urlParams.get('session');
    if (session) this.sessionId = session;

    const fn = urlParams.get('fn');
    const ln = urlParams.get('ln');
    if (fn || ln) {
      this.customer.firstName = fn || this.customer.firstName;
      this.customer.lastName = ln || this.customer.lastName;
    }

    const st = urlParams.get('st');
    if (st) {
      this.selectedSkinTypeId = st;
    }

    const c = urlParams.get('c');
    if (c) {
      this.selectedConcernIds = c.split(',').filter(Boolean);
    }

    this.saveToLocalStorage();
    this.notify();
  }

  async loadSessionFromQuery(sessionId) {
    if (!sessionId) return;
    this.sessionId = sessionId;

    // 1. Check localStorage first
    try {
      const stored = localStorage.getItem(`rp_session_${sessionId}`) || localStorage.getItem('rp_current_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.selectedConcernIds) {
          this.customer = parsed.customer || this.customer;
          this.selectedSkinTypeId = parsed.selectedSkinTypeId || null;
          this.selectedConcernIds = parsed.selectedConcernIds || [];
          this.notify();
          return;
        }
      }
    } catch {}

    // 2. Fetch from Supabase database sessions table if online
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .or(`id.eq.${sessionId},id.ilike.${sessionId}%`)
        .maybeSingle();

      if (data && data.recommendation_snapshot) {
        const snap = data.recommendation_snapshot;
        this.customer = {
          firstName: data.first_name || this.customer.firstName || 'Patient',
          lastName: data.surname || this.customer.lastName || ''
        };
        if (snap.concerns && Array.isArray(snap.concerns) && this.selectedConcernIds.length === 0) {
          this.selectedConcernIds = snap.concerns.map(c => c.id).filter(Boolean);
        }
        if (snap.skinType && snap.skinType.id && !this.selectedSkinTypeId) {
          this.selectedSkinTypeId = snap.skinType.id;
        }
        this.notify();
      }
    } catch (err) {
      console.warn('Error loading session from Supabase:', err);
    }
  }

  // Get recommended products matching selected skin concerns & skin type
  // Guarantees exact matches without dumping unselected catalog items
  getRecommendedProducts() {
    const skinType = this.selectedSkinTypeId;
    const concernIds = this.selectedConcernIds || [];
    const activeProducts = this.getActiveProducts();
    const activeCategories = this.getActiveCategories();

    // Debug: log matching context
    const linkedProducts = activeProducts.filter(p => (p.suitableConcerns || []).length > 0);
    if (activeProducts.length > 0 && linkedProducts.length === 0) {
      console.warn(`[getRecommendedProducts] WARNING: ${activeProducts.length} products loaded but NONE have suitableConcerns. ` +
        'Check that product_skin_problems rows exist in Supabase and are loading correctly.');
    } else {
      console.log(`[getRecommendedProducts] ${activeProducts.length} active products, ${linkedProducts.length} with concern links, matching against concernIds:`, concernIds);
    }

    // 1. Filter active products strictly matching the selected skin concerns and skin type
    const matched = activeProducts.filter(p => {
      const suitableConcerns = p.suitableConcerns || [];
      const suitableTypes = p.suitableSkinTypes || [];
      
      const matchesSkin = !skinType || suitableTypes.length === 0 || suitableTypes.includes(skinType);

      if (concernIds.length > 0) {
        // Must match at least one selected concern
        const matchesConcern = suitableConcerns.some(c => concernIds.includes(c));
        return matchesConcern && matchesSkin;
      }

      // If customer selected NO concerns, show products matching skin type explicitly
      if (skinType && suitableTypes.length > 0) {
        return suitableTypes.includes(skinType);
      }

      // Do NOT fall back to dumping all products if no concerns or skin type selected
      return false;
    });

    console.log(`[getRecommendedProducts] Matched ${matched.length} products for concerns [${concernIds.join(', ')}]`);

    // 2. Group by active category, guaranteeing each product is rendered exactly once
    const grouped = {};
    activeCategories.forEach(cat => {
      grouped[cat.id] = {
        category: cat,
        items: []
      };
    });

    const seenProductIds = new Set();

    matched.forEach(prod => {
      if (seenProductIds.has(prod.id)) return;
      seenProductIds.add(prod.id);

      const catId = prod.categoryId || prod.category_id;
      if (grouped[catId]) {
        grouped[catId].items.push(prod);
      } else {
        const matchingCat = activeCategories.find(c => c.id === catId);
        if (matchingCat) {
          if (!grouped[matchingCat.id]) {
            grouped[matchingCat.id] = { category: matchingCat, items: [] };
          }
          grouped[matchingCat.id].items.push(prod);
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

    const localSession = {
      id: this.sessionId.length > 8 ? this.sessionId.substring(0, 8).toUpperCase() : this.sessionId,
      rawId: this.sessionId,
      customerName: `${this.customer.firstName || ''} ${this.customer.lastName || ''}`.trim() || 'Walk-In Patient',
      skinType: skinType ? skinType.name : 'Mountain Normal/Dry',
      concerns: concerns.length > 0 ? concerns.map(c => c.title || c.name || c.id) : ['General Skincare'],
      hasSevere: hasSevere,
      timestamp: new Date().toISOString(),
      products: flattenedProducts.map(p => ({
        name: p.product_name,
        brand: p.brand,
        category: p.category_name,
        price: p.price,
        instruction: p.instruction
      })),
      matchedProductsCount: flattenedProducts.length,
      totalEstimatedPrice: flattenedProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
    };

    // Always register in local adminStore immediately so Reports & Consult views update without waiting or failing
    adminStore.addLocalSession(localSession);

    try {
      // 1. Insert into sessions
      let createdSessionId = null;
      const { data: sessionData, error: sessionErr } = await supabase
        .from('sessions')
        .insert([sessionPayload])
        .select();

      if (!sessionErr && sessionData && sessionData.length > 0) {
        createdSessionId = sessionData[0].id;
      } else {
        // Fallback: If .select() fails due to RLS read permissions, try plain insert
        console.warn('Supabase session insert with .select() note:', sessionErr?.message, '— attempting plain insert');
        const { error: plainErr } = await supabase
          .from('sessions')
          .insert([sessionPayload]);

        if (plainErr) {
          console.error('[saveSessionToSupabase] Supabase plain insert error:', plainErr.message || plainErr);
        } else {
          console.info('Session recorded in Supabase (plain insert mode).');
        }
      }

      if (createdSessionId) {
        // Update local session with DB ID if needed
        localSession.rawId = createdSessionId;
        localSession.id = createdSessionId.length > 8 ? createdSessionId.substring(0, 8).toUpperCase() : createdSessionId;
        adminStore.addLocalSession(localSession);

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
      }

      // Refresh admin sessions view from Supabase
      adminStore.fetchSessions();
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

