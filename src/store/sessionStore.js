// Session Store for Customer Tablet Flow with Supabase Live Catalog and Persistence
import { skinTypes as mockSkinTypes, skinConcerns as mockConcerns, products as mockProducts, productCategories as mockCategories } from '../data/mockData.js';
import { supabase } from '../lib/supabaseClient.js';
import { adminStore } from './adminStore.js';

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
    this.rawSessionId = generateUUID();
    this.sessionId = 'RP-' + this.rawSessionId.substring(0, 6).toUpperCase();
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

  // Sourced strictly from active Supabase catalog or validated mock catalog
  getActiveSkinConcerns() {
    let source = [];
    if (adminStore.skinProblems && adminStore.skinProblems.length > 0) {
      source = adminStore.skinProblems;
    } else {
      source = mockConcerns;
    }
    return source.filter(p => {
      const isActive = p.status === 'active' || p.is_active === true;
      const hasTitle = Boolean(p.title || p.name);
      return isActive && hasTitle;
    });
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
    let source = [];
    if (adminStore.categories && adminStore.categories.length > 0) {
      source = adminStore.categories;
    } else {
      source = mockCategories;
    }
    return source.filter(c => (c.status === 'active' || c.is_active === true) && Boolean(c.name));
  }

  getActiveProducts() {
    let source = [];
    if (adminStore.products && adminStore.products.length > 0) {
      source = adminStore.products;
    } else {
      source = mockProducts;
    }
    return source.filter(p => {
      const isActive = p.status === 'active' || p.is_active === true;
      const hasName = Boolean(p.name);
      return isActive && hasName;
    });
  }

  // Save session state to localStorage for offline persistence across tabs
  saveToLocalStorage() {
    try {
      if (this.currentStep > 1 && this.currentStep < 9) {
        const payload = {
          sessionId: this.sessionId,
          customer: this.customer,
          selectedSkinTypeId: this.selectedSkinTypeId,
          selectedConcernIds: this.selectedConcernIds,
          createdAt: this.createdAt
        };
        localStorage.setItem('rp_current_session', JSON.stringify(payload));
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

    // 2. Fetch from Supabase database sessions table if online and valid UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId);
    if (isUUID) {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
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
          product_id: (prod.id && prod.id.length > 30 && prod.id.includes('-')) ? prod.id : null,
          product_name: (prod.name || 'Skincare Product').trim(),
          brand: (prod.brand || 'Ronit Pharmacy').trim(),
          category_name: (g.category?.name || 'Skincare').trim(),
          price: Number(prod.price) >= 0 ? Number(prod.price) : 0,
          instruction: (prod.instruction || 'Apply as directed by pharmacist.').trim(),
          display_order: displayOrder++
        });
      });
    });

    const recommendationSnapshot = {
      customer: {
        firstName: this.customer.firstName || '',
        lastName: this.customer.lastName || ''
      },
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

    const targetSessionId = this.rawSessionId || generateUUID();
    this.rawSessionId = targetSessionId;

    // Database check constraint: CHECK (selected_skin_type = ANY (ARRAY['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive', 'Not sure']))
    const skinTypeMapping = {
      oily: 'Oily',
      dry: 'Dry',
      combination: 'Combination',
      sensitive: 'Sensitive',
      normal: 'Normal'
    };
    const dbSkinType = skinTypeMapping[this.selectedSkinTypeId] || 'Not sure';

    const sessionPayload = {
      id: targetSessionId,
      first_name: (this.customer.firstName || '').trim() || 'Walk-In',
      surname: (this.customer.lastName || '').trim() || 'Patient',
      selected_skin_type: dbSkinType,
      is_severe_flagged: hasSevere,
      recommendation_snapshot: recommendationSnapshot,
      completed_at: new Date().toISOString()
    };

    const localSession = {
      id: this.sessionId || ('RP-' + targetSessionId.substring(0, 6).toUpperCase()),
      rawId: targetSessionId,
      customerName: `${(this.customer.firstName || '').trim()} ${(this.customer.lastName || '').trim()}`.trim() || 'Walk-In Patient',
      skinType: skinType ? skinType.name : dbSkinType,
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

    // Optimistically update local session
    adminStore.addLocalSession(localSession);

    try {
      // 1. Insert into sessions table
      let { error: insertErr } = await supabase
        .from('sessions')
        .insert([sessionPayload]);

      if (insertErr) {
        console.warn('[saveSessionToSupabase] Direct insert note:', insertErr.message || insertErr, '— trying fallback without pre-assigned ID');
        const { id: _omitted, ...payloadWithoutId } = sessionPayload;
        const fallbackRes = await supabase
          .from('sessions')
          .insert([payloadWithoutId])
          .select();
        
        if (fallbackRes.error) {
          console.error('[saveSessionToSupabase] Fallback insert error:', fallbackRes.error.message || fallbackRes.error);
        } else if (fallbackRes.data && fallbackRes.data[0]) {
          localSession.rawId = fallbackRes.data[0].id;
          localSession.id = fallbackRes.data[0].id.substring(0, 8).toUpperCase();
          adminStore.addLocalSession(localSession);
        }
      }

      // 2. Insert session concerns junction rows (non-blocking)
      if (concerns.length > 0) {
        const concernRows = concerns.map(c => ({
          session_id: localSession.rawId,
          skin_problem_id: (c.id && c.id.length > 30 && c.id.includes('-')) ? c.id : null,
          skin_problem_name: (c.title || c.name || 'General Skincare').trim(),
          is_severe: !!(c.isSevere || c.is_severe)
        }));
        await supabase.from('session_concerns').insert(concernRows).catch(e => console.warn('session_concerns insert note:', e));
      }

      // 3. Insert session products junction rows (non-blocking)
      if (flattenedProducts.length > 0) {
        const productRows = flattenedProducts.map(p => ({
          session_id: localSession.rawId,
          product_id: (p.product_id && p.product_id.length > 30 && p.product_id.includes('-')) ? p.product_id : null,
          product_name: (p.product_name || 'Skincare Product').trim(),
          brand: (p.brand || 'Ronit Pharmacy').trim(),
          category_name: (p.category_name || 'Skincare').trim(),
          price: Number(p.price) >= 0 ? Number(p.price) : 0,
          instruction: (p.instruction || 'Apply as directed by pharmacist.').trim(),
          display_order: p.display_order || 0
        }));
        await supabase.from('session_products').insert(productRows).catch(e => console.warn('session_products insert note:', e));
      }

      // 4. Force refresh admin sessions from Supabase to sync authoritative state
      await adminStore.fetchSessions();
    } catch (err) {
      console.warn('Session save exception:', err);
    }
  }


  clearSession() {
    try {
      localStorage.removeItem('rp_current_session');
    } catch {}
    // Strip any session-related URL params so a page reload doesn't restore old state
    try {
      const url = new URL(window.location.href);
      const kioskParams = ['session', 'view', 'st', 'c', 'fn', 'ln'];
      let changed = false;
      kioskParams.forEach(k => { if (url.searchParams.has(k)) { url.searchParams.delete(k); changed = true; } });
      if (changed) {
        window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
      }
    } catch {}
    this.reset();
    this.notify();
  }
}

export const sessionStore = new SessionStore();

