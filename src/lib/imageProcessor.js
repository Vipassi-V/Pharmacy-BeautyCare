// src/lib/imageProcessor.js
// Client-side WebP image processing utility for Ronit Pharmacy & Beauty Care.
// Supports aspect-ratio preserving resizing, format conversion, and byte-size limits.

export const IMAGE_LIMITS = {
  PRODUCT: {
    maxWidth: 800,
    maxHeight: 800,
    maxSizeBytes: 250 * 1024, // 250 KB
    label: 'Product image (max 800x800px, 250 KB WebP)'
  },
  SKIN_PROBLEM: {
    maxWidth: 800,
    maxHeight: 800,
    maxSizeBytes: 250 * 1024, // 250 KB
    label: 'Skin condition cover (max 800x800px, 250 KB WebP)'
  },
  LOGO: {
    maxWidth: 600,
    maxHeight: 300,
    maxSizeBytes: 150 * 1024, // 150 KB
    label: 'Pharmacy logo (max 600x300px, 150 KB WebP)'
  }
};

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_INPUT_FILE_SIZE = 10 * 1024 * 1024; // 10 MB raw input limit

/**
 * Check if the browser's HTMLCanvasElement supports WebP export.
 * @returns {boolean}
 */
export function isWebPSupported() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
}

/**
 * Calculate scaled dimensions while preserving aspect ratio.
 * @param {number} srcWidth 
 * @param {number} srcHeight 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @returns {{ width: number, height: number }}
 */
export function calculateFitDimensions(srcWidth, srcHeight, maxWidth, maxHeight) {
  let width = srcWidth;
  let height = srcHeight;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return {
    width: Math.max(1, width),
    height: Math.max(1, height)
  };
}

/**
 * Convert an HTML Image element to a WebP Blob with the specified target dimensions & quality.
 * @param {HTMLImageElement} img 
 * @param {number} targetWidth 
 * @param {number} targetHeight 
 * @param {number} quality 
 * @returns {Promise<Blob>}
 */
function canvasToWebPBlob(img, targetWidth, targetHeight, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not obtain 2D canvas context.'));
      return;
    }

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('WebP canvas conversion failed.'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Process an input image File: validate MIME type, downsample, convert to WebP, and enforce size limits.
 * @param {File} file - Raw input file from file input or drop event
 * @param {'PRODUCT'|'SKIN_PROBLEM'|'LOGO'} type - Type of image being processed
 * @param {function} [onProgress] - Optional progress callback ({ phase: string, progress: number })
 * @returns {Promise<{
 *   blob: Blob,
 *   file: File,
 *   width: number,
 *   height: number,
 *   mimeType: string,
 *   sizeBytes: number,
 *   previewUrl: string
 * }>}
 */
export async function processClientImage(file, type = 'PRODUCT', onProgress = null) {
  const notify = (phase, progress) => {
    if (typeof onProgress === 'function') {
      onProgress({ phase, progress });
    }
  };

  notify('Validating file format...', 10);

  if (!file) {
    throw new Error('No image file selected.');
  }

  // 1. Validate MIME type
  const normalizedMime = file.type ? file.type.toLowerCase() : '';
  const fileExtension = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
  const isAllowedMime = ALLOWED_MIME_TYPES.includes(normalizedMime) || 
    ['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension);

  if (!isAllowedMime) {
    throw new Error(`Unsupported image format (${file.type || fileExtension || 'unknown'}). Please select a JPEG, PNG, or WebP file.`);
  }

  // 2. Validate input file size
  if (file.size > MAX_INPUT_FILE_SIZE) {
    throw new Error(`Original image exceeds the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a smaller photo.`);
  }

  // 3. Verify WebP conversion support
  if (!isWebPSupported()) {
    throw new Error('Your browser does not support client-side WebP conversion. Please update your browser or use a modern Chromium/Safari/Firefox browser.');
  }

  notify('Reading image data...', 30);

  // 4. Load into Image object
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  try {
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('The selected image file is corrupted or could not be decoded.'));
      img.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  notify('Resizing and converting to WebP...', 60);

  const limits = IMAGE_LIMITS[type] || IMAGE_LIMITS.PRODUCT;
  const { width: targetWidth, height: targetHeight } = calculateFitDimensions(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    limits.maxWidth,
    limits.maxHeight
  );

  // 5. Convert to WebP with adaptive quality step-down if needed
  let quality = 0.82;
  let webpBlob = await canvasToWebPBlob(img, targetWidth, targetHeight, quality);

  // If slightly above limit, attempt step-down quality compression
  if (webpBlob.size > limits.maxSizeBytes && quality > 0.65) {
    quality = 0.72;
    webpBlob = await canvasToWebPBlob(img, targetWidth, targetHeight, quality);
  }

  if (webpBlob.size > limits.maxSizeBytes && quality > 0.55) {
    quality = 0.60;
    webpBlob = await canvasToWebPBlob(img, targetWidth, targetHeight, quality);
  }

  // 6. Enforce final byte limit
  if (webpBlob.size > limits.maxSizeBytes) {
    const maxKb = Math.round(limits.maxSizeBytes / 1024);
    const actualKb = Math.round(webpBlob.size / 1024);
    throw new Error(`Processed image size (${actualKb} KB) exceeds the maximum allowed limit of ${maxKb} KB for this entity.`);
  }

  notify('Finalizing preview...', 90);

  // Create processed File object
  const cleanName = (file.name || 'image').replace(/\.[^/.]+$/, '') + '.webp';
  const processedFile = new File([webpBlob], cleanName, { type: 'image/webp' });
  const previewUrl = URL.createObjectURL(webpBlob);

  notify('Ready', 100);

  return {
    blob: webpBlob,
    file: processedFile,
    width: targetWidth,
    height: targetHeight,
    mimeType: 'image/webp',
    sizeBytes: webpBlob.size,
    previewUrl
  };
}

/**
 * Preflight check to verify that an image URL can be loaded successfully by the browser.
 * @param {string} url 
 * @param {number} timeoutMs 
 * @returns {Promise<boolean>}
 */
export function verifyImageLoads(url, timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    const img = new Image();
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        resolve(false);
      }
    }, timeoutMs);

    img.onload = () => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve(true);
      }
    };

    img.onerror = () => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve(false);
      }
    };

    img.src = url;
  });
}
