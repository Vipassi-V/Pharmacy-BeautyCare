// src/lib/cloudinaryClient.js
// Reusable Cloudinary image upload & media utilities for Ronit Pharmacy & Beauty Care.
// Uses Vite environment variables VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});

const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME || 'rrkmdfkb';
const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Pharmacy';

if (!cloudName || !uploadPreset) {
  console.warn('Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET) are missing.');
}

/**
 * Upload a processed File or Blob directly to Cloudinary using Unsigned Upload Preset.
 * Inserts `f_auto,q_auto` into the URL for dynamic browser format selection and optimal compression.
 * 
 * @param {Blob|File} file - Processed image Blob/File object
 * @param {string} [folder] - Target Cloudinary folder (e.g. 'products', 'skin-problems', 'pharmacy')
 * @param {string} [customPublicId] - Optional custom public ID for the uploaded file
 * @returns {Promise<{ publicUrl: string|null, path: string|null, error: Error|null }>}
 */
export async function uploadToCloudinary(file, folder = 'products', customPublicId = null) {
  try {
    if (!file) throw new Error('No image file provided for Cloudinary upload.');

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    if (folder) {
      formData.append('folder', folder);
    }

    if (customPublicId) {
      // Strip file extensions if present in customPublicId as Cloudinary handles extensions automatically
      const cleanPublicId = customPublicId.replace(/\.[^/.]+$/, '');
      formData.append('public_id', cleanPublicId);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || `Cloudinary upload failed with HTTP status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const rawUrl = data.secure_url || data.url;

    // Inject dynamic auto-format (f_auto) and auto-quality (q_auto) transformation parameters
    // Transform: https://res.cloudinary.com/<cloud>/image/upload/v12345/folder/sample.webp
    // Into:      https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/v12345/folder/sample.webp
    let optimizedUrl = rawUrl;
    if (rawUrl && rawUrl.includes('/upload/')) {
      optimizedUrl = rawUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    return {
      publicUrl: optimizedUrl,
      path: data.public_id,
      error: null
    };
  } catch (err) {
    console.warn(`Cloudinary upload error for folder "${folder}":`, err);
    return { publicUrl: null, path: null, error: err };
  }
}

/**
 * Extract public_id from a Cloudinary URL or return as-is if already a public_id path.
 * @param {string} urlOrPath 
 * @returns {string|null}
 */
export function extractCloudinaryPublicId(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;
  if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) {
    return urlOrPath;
  }
  
  // Example Cloudinary URL: https://res.cloudinary.com/rrkmdfkb/image/upload/f_auto,q_auto/v17890/products/item1.webp
  const marker = '/upload/';
  const idx = urlOrPath.indexOf(marker);
  if (idx !== -1) {
    let afterUpload = urlOrPath.substring(idx + marker.length);
    // Strip optional transformation flags (e.g. f_auto,q_auto/)
    if (afterUpload.startsWith('f_auto') || afterUpload.includes('/v')) {
      const parts = afterUpload.split('/');
      // Find where version string (v123456) or actual path starts
      const vIdx = parts.findIndex(p => /^v\d+$/.test(p));
      if (vIdx !== -1) {
        afterUpload = parts.slice(vIdx + 1).join('/');
      }
    }
    // Strip file extension
    return afterUpload.replace(/\.[^/.]+$/, '');
  }
  return null;
}

/**
 * Delete image placeholder helper for Cloudinary client operations.
 * Note: Direct browser deletion requires a signed API request or backend secret.
 * @param {string} urlOrPath 
 * @returns {Promise<{ success: boolean, error: Error|null }>}
 */
export async function deleteCloudinaryImage(urlOrPath) {
  const publicId = extractCloudinaryPublicId(urlOrPath);
  if (!publicId) return { success: true, error: null };
  // Log notice; Cloudinary media management is best done automatically or via server webhooks
  console.info(`[Cloudinary] Old media reference superseded: "${publicId}"`);
  return { success: true, error: null };
}

export default {
  uploadToCloudinary,
  extractCloudinaryPublicId,
  deleteCloudinaryImage
};
