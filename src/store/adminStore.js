// Admin Store managing Categories, Skin Problems, Products, Analytics, Sessions, Settings & Auth

import { pharmacyInfo, skinTypes, skinConcerns as initialConcerns, productCategories as initialCategories, products as initialProducts } from '../data/mockData.js';

class AdminStore {
  constructor() {
    this.isAuthenticated = localStorage.getItem('rp_admin_auth') === 'true';
    this.currentTab = 'dashboard'; // 'dashboard', 'categories', 'skin-problems', 'products', 'reports', 'settings'
    this.adminPassword = localStorage.getItem('rp_admin_pwd') || 'admin123';
    
    // Persistent or Initial Collections
    this.categories = this.load('rp_categories', initialCategories.map(c => ({ ...c, status: 'active', productCount: 0 })));
    this.skinProblems = this.load('rp_skin_problems', initialConcerns.map(c => ({ ...c, status: 'active', linkedCount: 0 })));
    this.products = this.load('rp_products', initialProducts.map(p => ({ ...p, status: 'active' })));
    this.settings = this.load('rp_settings', {
      pharmacyName: pharmacyInfo.name,
      location: pharmacyInfo.location,
      subLocation: pharmacyInfo.subLocation,
      phone: pharmacyInfo.phone,
      leadPharmacist: pharmacyInfo.leadPharmacist,
      logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80",
      welcomeTitle: "Welcome to Ronit Skincare Consultation",
      welcomeSubtitle: "Get an altitude-calibrated, clinical skincare routine tailored to your skin type and concerns in Tansen, Palpa.",
      severeWarningText: "Severe barrier irritation or infection risk detected. Please consult with the attending pharmacist before using active exfoliants.",
      inactivityTimeoutSeconds: 180,
      enableOfflineSync: true,
      requirePharmacistOverride: true
    });

    // Mock 7-Day Sessions Analytics Data
    this.sessions = this.load('rp_sessions', this.generateMockSessions());
    
    // Modal & Toast States
    this.activeModal = null; // { type: 'delete' | 'deactivate' | 'activate' | 'unsaved' | 'edit-cat' | 'edit-prob' | 'edit-prod' | 'import-preview', data: any, onConfirm: Function }
    this.toast = null; // { message: string, type: 'success' | 'error' | 'info' }
    this.isDirty = false; // Tracks unsaved form edits
    
    this.listeners = [];
    this.updateCounts();
  }

  load(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  updateCounts() {
    this.categories.forEach(cat => {
      cat.productCount = this.products.filter(p => p.categoryId === cat.id && p.status === 'active').length;
    });
    this.skinProblems.forEach(prob => {
      prob.linkedCount = this.products.filter(p => p.suitableConcerns && p.suitableConcerns.includes(prob.id) && p.status === 'active').length;
    });
  }

  // --- Auth & Navigation ---
  login(password) {
    if (password === this.adminPassword) {
      this.isAuthenticated = true;
      localStorage.setItem('rp_admin_auth', 'true');
      this.notify();
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('rp_admin_auth');
    this.currentTab = 'dashboard';
    this.notify();
  }

  setTab(tab) {
    if (this.isDirty) {
      this.openModal('unsaved', {
        title: 'Unsaved Changes',
        message: 'You have unsaved form changes. Are you sure you want to discard them and leave this page?',
        onConfirm: () => {
          this.isDirty = false;
          this.currentTab = tab;
          this.closeModal();
          this.notify();
        }
      });
      return;
    }
    this.currentTab = tab;
    this.notify();
  }

  showToast(message, type = 'success') {
    this.toast = { message, type };
    this.notify();
    setTimeout(() => {
      if (this.toast && this.toast.message === message) {
        this.toast = null;
        this.notify();
      }
    }, 3500);
  }

  openModal(type, data) {
    this.activeModal = { type, ...data };
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.notify();
  }

  // --- Categories CRUD ---
  addCategory(category) {
    const id = category.id || 'cat_' + Date.now();
    const newCat = {
      ...category,
      id,
      status: 'active',
      productCount: 0
    };
    this.categories.unshift(newCat);
    this.updateCounts();
    this.save('rp_categories', this.categories);
    this.showToast(`Category "${newCat.name}" added successfully`);
    this.notify();
  }

  updateCategory(id, updates) {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx > -1) {
      this.categories[idx] = { ...this.categories[idx], ...updates };
      this.updateCounts();
      this.save('rp_categories', this.categories);
      this.showToast(`Category "${this.categories[idx].name}" updated`);
      this.notify();
    }
  }

  deleteCategory(id) {
    const cat = this.categories.find(c => c.id === id);
    const name = cat ? cat.name : id;
    this.categories = this.categories.filter(c => c.id !== id);
    this.save('rp_categories', this.categories);
    this.showToast(`Category "${name}" deleted permanently`);
    this.notify();
  }

  toggleCategoryStatus(id, newStatus) {
    this.updateCategory(id, { status: newStatus });
    this.showToast(`Category marked as ${newStatus}`);
  }

  // --- Skin Problems CRUD ---
  addSkinProblem(problem) {
    const id = problem.id || 'prob_' + Date.now();
    const newProb = {
      ...problem,
      id,
      status: 'active',
      linkedCount: 0
    };
    this.skinProblems.unshift(newProb);
    this.updateCounts();
    this.save('rp_skin_problems', this.skinProblems);
    this.showToast(`Skin Problem "${newProb.title}" added`);
    this.notify();
  }

  updateSkinProblem(id, updates) {
    const idx = this.skinProblems.findIndex(p => p.id === id);
    if (idx > -1) {
      this.skinProblems[idx] = { ...this.skinProblems[idx], ...updates };
      this.updateCounts();
      this.save('rp_skin_problems', this.skinProblems);
      this.showToast(`Skin Problem "${this.skinProblems[idx].title}" updated`);
      this.notify();
    }
  }

  deleteSkinProblem(id) {
    const prob = this.skinProblems.find(p => p.id === id);
    const title = prob ? prob.title : id;
    this.skinProblems = this.skinProblems.filter(p => p.id !== id);
    this.save('rp_skin_problems', this.skinProblems);
    this.showToast(`Skin Problem "${title}" deleted permanently`);
    this.notify();
  }

  toggleSkinProblemSevere(id) {
    const prob = this.skinProblems.find(p => p.id === id);
    if (prob) {
      prob.isSevere = !prob.isSevere;
      this.save('rp_skin_problems', this.skinProblems);
      this.showToast(`Severe flag ${prob.isSevere ? 'enabled' : 'disabled'} for "${prob.title}"`);
      this.notify();
    }
  }

  // --- Products CRUD ---
  addProduct(product) {
    const id = product.id || 'prod_' + Date.now();
    const newProd = {
      ...product,
      id,
      status: 'active',
      price: Number(product.price) || 0,
      currency: 'NPR',
      suitableConcerns: product.suitableConcerns || [],
      suitableSkinTypes: product.suitableSkinTypes || ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      badges: product.badges || []
    };
    this.products.unshift(newProd);
    this.updateCounts();
    this.save('rp_products', this.products);
    this.showToast(`Product "${newProd.name}" added to catalog`);
    this.notify();
  }

  updateProduct(id, updates) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx > -1) {
      this.products[idx] = { 
        ...this.products[idx], 
        ...updates,
        price: updates.price !== undefined ? Number(updates.price) : this.products[idx].price
      };
      this.updateCounts();
      this.save('rp_products', this.products);
      this.showToast(`Product "${this.products[idx].name}" updated`);
      this.notify();
    }
  }

  deleteProduct(id) {
    const prod = this.products.find(p => p.id === id);
    const name = prod ? prod.name : id;
    this.products = this.products.filter(p => p.id !== id);
    this.updateCounts();
    this.save('rp_products', this.products);
    this.showToast(`Product "${name}" deleted permanently`);
    this.notify();
  }

  bulkImportProducts(newProductsList) {
    newProductsList.forEach(p => {
      this.addProduct(p);
    });
    this.showToast(`Successfully imported ${newProductsList.length} products!`);
  }

  // --- Settings ---
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.save('rp_settings', this.settings);
    this.isDirty = false;
    this.showToast('System settings saved successfully');
    this.notify();
  }

  changePassword(oldPwd, newPwd) {
    if (oldPwd !== this.adminPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    if (!newPwd || newPwd.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters' };
    }
    this.adminPassword = newPwd;
    localStorage.setItem('rp_admin_pwd', newPwd);
    this.showToast('Admin password updated successfully');
    return { success: true };
  }

  // --- Analytics & Reports Helper ---
  generateMockSessions() {
    const names = [
      { first: "Ronit", last: "Shrestha" },
      { first: "Sunita", last: "Pandey" },
      { first: "Aarav", last: "Khadka" },
      { first: "Prerana", last: "Ghimire" },
      { first: "Bikash", last: "Thapa" },
      { first: "Anjali", last: "Shrestha" },
      { first: "Dipesh", last: "Basnet" },
      { first: "Suman", last: "Aryal" },
      { first: "Pooja", last: "Rana" },
      { first: "Kiran", last: "Bhattarai" }
    ];
    const types = ["dry", "oily", "combination", "sensitive", "normal"];
    const now = Date.now();

    return names.map((n, i) => {
      const type = types[i % types.length];
      const hasSevere = i % 3 === 0;
      const selectedConcerns = hasSevere 
        ? ["acute_barrier_breakdown", "mountain_uv_pigmentation"]
        : ["mountain_uv_pigmentation", "dryness_winter_tightness"];

      return {
        id: `RP-${(8000 + i).toString()}`,
        customerName: `${n.first} ${n.last}`,
        skinType: type,
        concerns: selectedConcerns,
        hasSevere,
        timestamp: new Date(now - i * 3600000 * 14).toISOString(),
        matchedProductsCount: 4
      };
    });
  }

  get7DayConcernStats() {
    const concernTally = {};
    initialConcerns.forEach(c => {
      concernTally[c.id] = {
        title: c.title,
        nepaliTitle: c.nepaliTitle,
        count: 0,
        isSevere: c.isSevere
      };
    });

    // Mock realistic counts for last 7 days in Palpa
    concernTally['mountain_uv_pigmentation'].count = 58;
    concernTally['acute_barrier_breakdown'].count = 42;
    concernTally['dryness_winter_tightness'].count = 37;
    concernTally['hormonal_inflammatory_acne'].count = 29;
    concernTally['persistent_erythema_redness'].count = 21;
    concernTally['acute_cystic_flare'].count = 14;

    const total = Object.values(concernTally).reduce((acc, curr) => acc + curr.count, 0);

    return Object.entries(concernTally)
      .map(([id, item]) => ({
        id,
        ...item,
        percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }
}

export const adminStore = new AdminStore();
