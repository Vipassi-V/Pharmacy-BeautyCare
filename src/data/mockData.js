// Mock Data for Ronit Pharmacy & Beauty Care (Tansen, Palpa, Nepal)

export const pharmacyInfo = {
  name: "Ronit Pharmacy & Beauty Care",
  location: "Tansen, Palpa, Nepal",
  subLocation: "Hospital Road, Tansen",
  phone: "+977-75-520123",
  leadPharmacist: "S. Shrestha, B.Pharm",
  logoText: "Ronit Pharmacy",
  subtitle: "Consultation & Skincare Clinic"
};

export const skinTypes = [
  {
    id: "oily",
    name: "Oily Skin",
    nepaliName: "तैलीय छाला",
    icon: "water_drop",
    tagline: "Excess sebum, enlarged pores, midday shine",
    description: "Characterized by visible shine, enlarged pores across T-zone, and prone to blackheads or congestion. Common in warmer lower altitudes or active lifestyles."
  },
  {
    id: "dry",
    name: "Dry & Dehydrated",
    nepaliName: "सुख्खा छाला",
    icon: "grain",
    tagline: "Tightness, flaking, rough texture, compromised barrier",
    description: "Skin feels stretched or flaky due to high altitude wind and low mountain humidity in Palpa. Requires barrier lipid replenishment and intense hydration."
  },
  {
    id: "combination",
    name: "Combination Skin",
    nepaliName: "मिश्रित छाला",
    icon: "contrast",
    tagline: "Oily T-zone (forehead & nose) with normal to dry cheeks",
    description: "Dual-zone behavior requiring balanced oil control on forehead/nose while preserving moisture across cheeks and jawline."
  },
  {
    id: "sensitive",
    name: "Sensitive & Reactive",
    nepaliName: "संवेदनशील छाला",
    icon: "spa",
    tagline: "Easily flushed, burning sensation, reactive to climate & fragrances",
    description: "Prone to stinging, redness, and rapid irritation under UV or cold weather. Demands fragrance-free, calming formulations."
  },
  {
    id: "normal",
    name: "Balanced (Normal)",
    nepaliName: "सन्तुलित छाला",
    icon: "check_circle",
    tagline: "Well-balanced moisture and oil, smooth texture",
    description: "Healthy skin barrier with minimal sensitivities. Needs daily antioxidant protection and altitude-grade broad spectrum defense."
  }
];

export const skinConcerns = [
  {
    id: "mountain_uv_pigmentation",
    title: "High Altitude UV Damage & Melasma",
    nepaliTitle: "घामको डढेलो र कालो पोतो",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    summary: "Persistent dark patches and stubborn UV pigmentation accelerated by high mountain sun in Palpa.",
    description: "At Palpa's elevation (~1,350m+), UV radiation index is substantially higher than lowland regions. Chronic sun exposure without adequate UVA/UVB/HEV shielding triggers hyperactive melanocytes, resulting in melasma, freckling, and photo-aging. Requires Tyrosinase inhibitors (Niacinamide, Alpha Arbutin, Vitamin C) paired with broad-spectrum PA++++ sunscreen.",
    isSevere: false,
    categoryKey: "sun_damage"
  },
  {
    id: "acute_barrier_breakdown",
    title: "Severe Barrier Damage & Cracking",
    nepaliTitle: "गम्भीर छाला फुट्ने र पोल्ने समस्या",
    image: "https://images.unsplash.com/photo-1512290900672-1f55b9355755?auto=format&fit=crop&w=600&q=80",
    summary: "Intense redness, burning sensation upon water contact, and visible peeling due to damaged skin barrier.",
    description: "Acute degradation of the stratum corneum lipids caused by dry mountain winds, aggressive soap washing, or over-exfoliation. Immediate cessation of harsh actives is required alongside ceramide NP/AP/EOP replenishment and colloidal soothing balms.",
    isSevere: true, // Marked as severe
    categoryKey: "barrier"
  },
  {
    id: "hormonal_inflammatory_acne",
    title: "Active Acne & Inflammatory Breakouts",
    nepaliTitle: "डन्डिफोर र रातो पिप आउने",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    summary: "Papules, pustules, congested comedones, and inflamed bacterial flare-ups across cheeks and chin.",
    description: "Occurs when excess sebum combines with dead epidermal cells and Cutibacterium acnes colonization. Best addressed through gentle Salicylic Acid (BHA 1-2%), Zinc PCA oil modulation, and non-comedogenic gel hydrators without drying alcohol.",
    isSevere: false,
    categoryKey: "acne"
  },
  {
    id: "acute_cystic_flare",
    title: "Severe Nodulocystic Flare & Infection Risk",
    nepaliTitle: "गहिरो पाक्ने दुखाइयुक्त डन्डिफोर",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80",
    summary: "Deep painful sub-dermal cysts, potential bacterial cellulitis risk, and high scarring likelihood.",
    description: "Deep follicular disruption triggering profound localized swelling and distress. High risk of permanent tissue scarring. Must not be picked or squeezed; pharmacist evaluation is strictly required for potential topical/systemic antibiotic referral.",
    isSevere: true, // Marked as severe
    categoryKey: "acne"
  },
  {
    id: "dryness_winter_tightness",
    title: "Severe Dehydration & Winter Flakiness",
    nepaliTitle: "छाला कसिने र सुख्खा भएर पत्र निस्कने",
    image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80",
    summary: "Loss of natural water binding capacity resulting in chalky texture and uncomfortable tight sensation.",
    description: "High transepidermal water loss (TEWL) exacerbated by cold seasonal hill weather. Requires multi-molecular weight Hyaluronic Acid, Glycerin, and occlusive Shea/Squalane to lock hydration into cellular layers.",
    isSevere: false,
    categoryKey: "hydration"
  },
  {
    id: "persistent_erythema_redness",
    title: "Facial Redness, Rosacea & Broken Capillaries",
    nepaliTitle: "अनुहार रातो हुने र नसा देखिने समस्या",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
    summary: "Vasodilation, reactive stinging, and visible micro-vessels triggered by temperature swings.",
    description: "Persistent facial flushing triggered by wind chill, spicy food, or intense sunlight in the hills. Calming bio-actives like Centella Asiatica (Cica), Madecassoside, and Azelaic Acid reinforce vessel resilience and tone down redness.",
    isSevere: false,
    categoryKey: "redness"
  }
];

export const productCategories = [
  { id: "face_wash", name: "Face Wash & Cleansers", icon: "soap", order: 1 },
  { id: "serum", name: "Targeted Treatment Serums", icon: "science", order: 2 },
  { id: "moisturizer", name: "Moisturizers & Barrier Creams", icon: "spa", order: 3 },
  { id: "sunscreen", name: "Altitude Sunscreens (SPF 50+)", icon: "wb_sunny", order: 4 },
  { id: "special_care", name: "Specialized Clinical Balms", icon: "healing", order: 5 }
];

// Products with strictly assigned primary category (no duplicates across categories)
export const products = [
  // 1. Face Wash & Cleansers
  {
    id: "prod_fw_cera_gentle",
    categoryId: "face_wash",
    name: "Hydrating Gentle Foaming Cleanser",
    brand: "CeraVe Dermatological",
    price: 1850,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
    badges: ["Ceramides 1,3,6-II", "Non-Stripping", "Fragrance Free"],
    isOTC: true,
    suitableSkinTypes: ["dry", "sensitive", "normal", "combination"],
    suitableConcerns: ["mountain_uv_pigmentation", "acute_barrier_breakdown", "dryness_winter_tightness", "persistent_erythema_redness"],
    instruction: "Pump 1–2 drops onto wet palms. Gently massage in circular motions over face for 45–60 seconds, then rinse with lukewarm water (Morning & Evening)."
  },
  {
    id: "prod_fw_salicylic",
    categoryId: "face_wash",
    name: "Purifying 2% BHA Salicylic Clarifying Wash",
    brand: "La Roche-Posay Effaclar",
    price: 2150,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1567928805192-d35d641494b1?auto=format&fit=crop&w=500&q=80",
    badges: ["2% Salicylic Acid", "Zinc Gluconate", "Pore Refining"],
    isOTC: true,
    suitableSkinTypes: ["oily", "combination"],
    suitableConcerns: ["hormonal_inflammatory_acne", "acute_cystic_flare"],
    instruction: "Lather small amount with water. Focus on T-zone and congested areas. Avoid aggressive scrubbing around active lesions. Use once daily initially, building to twice daily."
  },

  // 2. Targeted Treatment Serums
  {
    id: "prod_serum_niacinamide",
    categoryId: "serum",
    name: "Niacinamide 10% + Zinc 1% Blemish & Tone Serum",
    brand: "The Ordinary Clinical",
    price: 1650,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
    badges: ["10% Pure Niacinamide", "Oil Balancing", "Reduces Spots"],
    isOTC: true,
    suitableSkinTypes: ["oily", "combination", "normal"],
    suitableConcerns: ["mountain_uv_pigmentation", "hormonal_inflammatory_acne"],
    instruction: "Apply 3–4 drops over cleansed face before heavy creams. Pat gently until absorbed (Morning & Evening)."
  },
  {
    id: "prod_serum_cica_b5",
    categoryId: "serum",
    name: "Centella Asiatica + Provitamin B5 Soothing Elixir",
    brand: "Skin1004 Madagascar",
    price: 2450,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1608248597359-5f2571216d7a?auto=format&fit=crop&w=500&q=80",
    badges: ["100% Cica Extract", "Instant Calming", "Hypoallergenic"],
    isOTC: true,
    suitableSkinTypes: ["sensitive", "dry", "combination", "normal"],
    suitableConcerns: ["acute_barrier_breakdown", "persistent_erythema_redness", "acute_cystic_flare"],
    instruction: "Dispense 1 full dropper into palm. Press into inflamed or reddened zones. Safe for immediate post-sun application."
  },
  {
    id: "prod_serum_hyaluronic",
    categoryId: "serum",
    name: "Multi-Molecular Hyaluronic Acid 2% + B5",
    brand: "Cosrx Hydrium",
    price: 1950,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=500&q=80",
    badges: ["High & Low Dalton HA", "Deep Quenching", "Plumping"],
    isOTC: true,
    suitableSkinTypes: ["dry", "normal", "combination", "sensitive"],
    suitableConcerns: ["dryness_winter_tightness", "mountain_uv_pigmentation"],
    instruction: "Apply onto slightly damp skin right after cleansing. Follow immediately with moisturizer to lock in moisture."
  },

  // 3. Moisturizers & Barrier Creams
  {
    id: "prod_moist_ceramide_barrier",
    categoryId: "moisturizer",
    name: "Advanced Barrier Restorative Ceramide Cream",
    brand: "Illiyoon Ceramide ATO",
    price: 2200,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=80",
    badges: ["Ceramide Skin Complex™", "48h Moisture", "Fragrance Free"],
    isOTC: true,
    suitableSkinTypes: ["dry", "sensitive", "combination", "normal"],
    suitableConcerns: ["acute_barrier_breakdown", "dryness_winter_tightness", "persistent_erythema_redness"],
    instruction: "Smooth a nickel-sized amount over face and neck. Reapply throughout dry windy mountain afternoons if tightness recurs."
  },
  {
    id: "prod_moist_oilfree_gel",
    categoryId: "moisturizer",
    name: "Oil-Free Ultra-Light Hydrating Water Cream",
    brand: "Neutrogena Hydro Boost",
    price: 1750,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80",
    badges: ["Non-Comedogenic", "Zero Grease", "Prebiotic Yeast"],
    isOTC: true,
    suitableSkinTypes: ["oily", "combination"],
    suitableConcerns: ["hormonal_inflammatory_acne", "acute_cystic_flare"],
    instruction: "Apply smoothly every morning and night after serum. Will not clog pores or trigger breakouts."
  },

  // 4. Altitude Sunscreens (SPF 50+)
  {
    id: "prod_sun_altitude_shield",
    categoryId: "sunscreen",
    name: "Himalayan UV Defense Fluid SPF 50+ PA++++",
    brand: "Biore UV Aqua Rich",
    price: 1900,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1567928805192-d35d641494b1?auto=format&fit=crop&w=500&q=80",
    badges: ["High Altitude Broad UV", "Water Resistant", "Zero White Cast"],
    isOTC: true,
    suitableSkinTypes: ["oily", "combination", "normal"],
    suitableConcerns: ["mountain_uv_pigmentation", "hormonal_inflammatory_acne", "dryness_winter_tightness"],
    instruction: "Apply two fingertip lengths evenly to face and neck 15 minutes before outdoor exposure in Tansen. Reapply every 3 hours."
  },
  {
    id: "prod_sun_mineral_sensitive",
    categoryId: "sunscreen",
    name: "Pure Mineral Zinc Oxide Sunscreen SPF 50+",
    brand: "Avene Ultra-Light",
    price: 2850,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
    badges: ["100% Mineral", "Safe on Damaged Skin", "Anti-Redness"],
    isOTC: true,
    suitableSkinTypes: ["sensitive", "dry"],
    suitableConcerns: ["acute_barrier_breakdown", "persistent_erythema_redness", "acute_cystic_flare"],
    instruction: "Gently pat onto sensitive or irritated skin as final morning step. Physical zinc shields without stinging open or cracked areas."
  },

  // 5. Specialized Clinical Balms
  {
    id: "prod_balm_cicaplast_b5",
    categoryId: "special_care",
    name: "Cicaplast Baume B5+ Ultra-Repairing Balm",
    brand: "La Roche-Posay Clinical",
    price: 2600,
    currency: "NPR",
    image: "https://images.unsplash.com/photo-1608248597359-5f2571216d7a?auto=format&fit=crop&w=500&q=80",
    badges: ["5% Panthenol", "Madecassoside", "Tribioma Prebiotic"],
    isOTC: true,
    suitableSkinTypes: ["sensitive", "dry", "combination", "normal", "oily"],
    suitableConcerns: ["acute_barrier_breakdown", "acute_cystic_flare", "persistent_erythema_redness"],
    instruction: "Apply localized thin layer directly onto compromised, cracked, or dry patches twice daily. Avoid eye contour."
  }
];
