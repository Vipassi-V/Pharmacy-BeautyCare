// src/lib/excelImportParser.js
// Excel & CSV Product Catalog Parser & Two-Stage Validation Engine for Ronit Pharmacy.

export const TEMPLATE_COLUMNS = [
  'name',
  'brand',
  'category',
  'price',
  'instruction',
  'linked_skin_problems',
  'is_active'
];

// NOTE: image_path is intentionally excluded from the import template.
// Product images must be uploaded manually via the product editor after import.

/**
 * Normalizes text for lenient matching: trims, lowercases, and collapses multiple whitespace characters.
 * @param {string} str 
 * @returns {string}
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Parse a single CSV line honoring double quotes and commas within quotes.
 * @param {string} line 
 * @returns {string[]}
 */
export function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Generates and triggers the download of the official Ronit Pharmacy Excel/CSV Product Template.
 * @param {Array<{ name: string }>} [availableCategories] - Active database categories for sample rows
 * @param {Array<{ title?: string, name?: string }>} [availableProblems] - Active skin problems
 */
export function downloadExcelTemplate(availableCategories = [], availableProblems = []) {
  const cat1 = availableCategories[0]?.name || 'Face Cleanser';
  const cat2 = availableCategories[1]?.name || 'Treatment Serum';
  const cat3 = availableCategories[2]?.name || 'Sunscreen';

  const prob1 = availableProblems[0]?.title || availableProblems[0]?.name || 'High Altitude UV Damage & Melasma';
  const prob2 = availableProblems[1]?.title || availableProblems[1]?.name || 'Winter Dryness & Peeling';
  const prob3 = availableProblems[2]?.title || availableProblems[2]?.name || 'Acute Barrier Irritation';

  const headers = TEMPLATE_COLUMNS.map(c => `"${c}"`).join(',');
  const sampleRows = [
    `"Hydrating Facial Cleanser","CeraVe","${cat1}",1850,"Apply 2-3 pumps onto damp skin, massage gently for 60 seconds and rinse with lukewarm water.","${prob1}; ${prob3}","true"`,
    `"Niacinamide 10% + Zinc 1%","The Ordinary","${cat2}",1650,"Apply 3-4 drops to entire face morning and evening before heavier moisturizers.","${prob1}","true"`,
    `"UV Aqua Rich Watery Essence SPF 50+","Biore","${cat3}",1900,"Apply two finger lengths generously 15 minutes before mountain UV exposure. Reapply every 2 hours.","${prob1}; ${prob2}","true"`
  ];

  const csvContent = `${headers}\n${sampleRows.join('\n')}\n`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ronit_pharmacy_products_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses raw CSV or text content and performs Stage 1 validation against database entities.
 * 
 * @param {string} fileContent - Raw CSV text
 * @param {Array} dbCategories - Active categories from Supabase { id, name, is_active }
 * @param {Array} dbSkinProblems - Active skin problems from Supabase { id, title, name, is_active }
 * @param {Array} existingProducts - Existing products in catalog { id, name, brand }
 * @returns {{
 *   filename?: string,
 *   totalRows: number,
 *   validRowsCount: number,
 *   invalidRowsCount: number,
 *   unknownCategories: string[],
 *   unknownSkinProblems: string[],
 *   duplicateProducts: string[],
 *   priceErrorsCount: number,
 *   missingValuesCount: number,
 *   availableCategories: Array<{ id: string, name: string }>,
 *   availableSkinProblems: Array<{ id: string, name: string }>,
 *   rows: Array<{
 *     rowIndex: number,
 *     name: string,
 *     brand: string,
 *     category: string,
 *     categoryId: string|null,
 *     price: number,
 *     instruction: string,
 *     image_path: string|null,
 *     linked_skin_problems_raw: string,
 *     resolvedProblemIds: string[],
 *     resolvedProblemNames: string[],
 *     is_active: boolean,
 *     errors: string[],
 *     warnings: string[],
 *     isValid: boolean
 *   }>
 * }}
 */
export function parseAndValidateImport(fileContent, dbCategories = [], dbSkinProblems = [], existingProducts = []) {
  const lines = fileContent
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) {
    throw new Error('The uploaded file must contain a header row and at least one data row.');
  }

  // Parse header
  const rawHeaders = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/[\s_-]/g, '_'));
  
  // Index mappings
  const colMap = {};
  TEMPLATE_COLUMNS.forEach(col => {
    const idx = rawHeaders.findIndex(h => h === col || h === col.replace(/_/g, ''));
    colMap[col] = idx;
  });

  // Check essential column presence
  const essentialCols = ['name', 'brand', 'category', 'price', 'instruction'];
  const missingHeaders = essentialCols.filter(col => colMap[col] === -1);

  if (missingHeaders.length > 0) {
    throw new Error(`File is missing required template columns: ${missingHeaders.join(', ')}. Please use the "Download Excel Template" format.`);
  }

  // Precompute normalized database lookup maps
  const activeDbCategories = (dbCategories || []).filter(c => c.status === 'active' || c.is_active !== false);
  const activeDbProblems = (dbSkinProblems || []).filter(p => p.status === 'active' || p.is_active !== false);

  const categoryLookup = new Map();
  activeDbCategories.forEach(cat => {
    categoryLookup.set(normalizeString(cat.name), cat);
    if (cat.id) categoryLookup.set(normalizeString(cat.id), cat);
  });

  const problemLookup = new Map();
  activeDbProblems.forEach(prob => {
    const displayName = prob.title || prob.name || '';
    problemLookup.set(normalizeString(displayName), prob);
    if (prob.id) problemLookup.set(normalizeString(prob.id), prob);
  });

  // Track duplicates within the batch
  const batchProductKeys = new Set();
  const existingProductKeys = new Set(
    (existingProducts || []).map(p => `${normalizeString(p.name)}:::${normalizeString(p.brand)}`)
  );

  const unknownCategoriesSet = new Set();
  const unknownProblemsSet = new Set();
  const duplicateProductsSet = new Set();
  let priceErrorsCount = 0;
  let missingValuesCount = 0;

  const parsedRows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells = parseCsvLine(rawLine);

    const getVal = (colName) => {
      const idx = colMap[colName];
      return idx !== undefined && idx > -1 && cells[idx] !== undefined ? cells[idx].trim() : '';
    };

    const name = getVal('name');
    const brand = getVal('brand');
    const categoryRaw = getVal('category');
    const priceRaw = getVal('price');
    const instruction = getVal('instruction');
    // image_path is intentionally ignored during import — images must be uploaded manually.
    const linkedProblemsRaw = getVal('linked_skin_problems');
    const isActiveRaw = getVal('is_active');

    const rowErrors = [];
    const rowWarnings = [];

    // 1. Validate Name
    if (!name) {
      rowErrors.push('Missing required product "name"');
      missingValuesCount++;
    }

    // 2. Validate Brand
    if (!brand) {
      rowErrors.push('Missing required "brand"');
      missingValuesCount++;
    }

    // 3. Validate Category (Dynamic database matching)
    let matchedCategoryId = null;
    let matchedCategoryName = null;
    if (!categoryRaw) {
      rowErrors.push('Missing required "category"');
      missingValuesCount++;
    } else {
      const normCat = normalizeString(categoryRaw);
      const foundCat = categoryLookup.get(normCat);
      if (foundCat) {
        matchedCategoryId = foundCat.id;
        matchedCategoryName = foundCat.name;
      } else {
        unknownCategoriesSet.add(categoryRaw);
        const availList = activeDbCategories.map(c => `"${c.name}"`).join(', ');
        rowErrors.push(`Unknown category "${categoryRaw}". Available: [${availList || 'None configured'}]`);
      }
    }

    // 4. Validate Price
    let price = 0;
    if (priceRaw === '') {
      rowErrors.push('Missing required "price"');
      missingValuesCount++;
    } else {
      const parsedPrice = Number(priceRaw.replace(/[^0-9.-]+/g, ''));
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        rowErrors.push(`Price must be a non-negative number (got "${priceRaw}")`);
        priceErrorsCount++;
      } else {
        price = parsedPrice;
      }
    }

    // 5. Validate Instruction
    if (!instruction) {
      rowErrors.push('Missing required "instruction" (usage directions)');
      missingValuesCount++;
    }

    // 6. Validate is_active
    let isActive = true;
    if (isActiveRaw) {
      const normActive = isActiveRaw.toLowerCase().trim();
      if (['false', '0', 'no', 'inactive', 'off'].includes(normActive)) {
        isActive = false;
      } else if (['true', '1', 'yes', 'active', 'on'].includes(normActive)) {
        isActive = true;
      } else {
        rowWarnings.push(`Unrecognized is_active value "${isActiveRaw}", defaulted to active`);
      }
    }

    // 7. Validate & Resolve Linked Skin Problems
    const resolvedProblemIds = [];
    const resolvedProblemNames = [];
    if (linkedProblemsRaw) {
      const problemTokens = linkedProblemsRaw
        .split(';')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      problemTokens.forEach(token => {
        const normToken = normalizeString(token);
        const foundProb = problemLookup.get(normToken);
        if (foundProb) {
          if (!resolvedProblemIds.includes(foundProb.id)) {
            resolvedProblemIds.push(foundProb.id);
            resolvedProblemNames.push(foundProb.title || foundProb.name);
          }
        } else {
          unknownProblemsSet.add(token);
          const availProbList = activeDbProblems.map(p => `"${p.title || p.name}"`).slice(0, 4).join(', ');
          rowErrors.push(`Unknown skin problem "${token}". Available: [${availProbList}${activeDbProblems.length > 4 ? '...' : ''}]`);
        }
      });
    }

    // 8. Duplicate Detection (within file and against existing catalog)
    if (name && brand) {
      const productKey = `${normalizeString(name)}:::${normalizeString(brand)}`;
      if (batchProductKeys.has(productKey)) {
        rowErrors.push(`Duplicate product in import batch: "${name}" (${brand})`);
        duplicateProductsSet.add(`${name} (${brand})`);
      } else {
        batchProductKeys.add(productKey);
      }

      if (existingProductKeys.has(productKey)) {
        rowWarnings.push(`Product already exists in catalog: "${name}" (${brand}) - will update/add`);
      }
    }

    const isValid = rowErrors.length === 0;

    parsedRows.push({
      rowIndex: i,
      name,
      brand,
      category: categoryRaw,
      categoryId: matchedCategoryId,
      categoryName: matchedCategoryName || categoryRaw,
      price,
      instruction,
      image_path: null, // Never imported from Excel — upload manually after import
      linked_skin_problems_raw: linkedProblemsRaw,
      resolvedProblemIds,
      resolvedProblemNames,
      is_active: isActive,
      errors: rowErrors,
      warnings: rowWarnings,
      isValid
    });
  }

  const validRows = parsedRows.filter(r => r.isValid);
  const invalidRows = parsedRows.filter(r => !r.isValid);

  return {
    totalRows: parsedRows.length,
    validRowsCount: validRows.length,
    invalidRowsCount: invalidRows.length,
    unknownCategories: Array.from(unknownCategoriesSet),
    unknownSkinProblems: Array.from(unknownProblemsSet),
    duplicateProducts: Array.from(duplicateProductsSet),
    priceErrorsCount,
    missingValuesCount,
    availableCategories: activeDbCategories.map(c => ({ id: c.id, name: c.name })),
    availableSkinProblems: activeDbProblems.map(p => ({ id: p.id, name: p.title || p.name })),
    rows: parsedRows
  };
}
