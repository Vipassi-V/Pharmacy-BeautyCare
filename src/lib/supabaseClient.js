// src/lib/supabaseClient.js
// Reusable Supabase client and storage utilities for Ronit Pharmacy & Beauty Care.
// Uses Vite environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
export const getUser = () => supabase.auth.getUser();

/**
 * Check if the currently active session is authenticated as an admin.
 * @returns {Promise<boolean>}
 */
export async function verifyAdminAuth() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Upload a processed WebP image to Supabase Storage with deterministic versioned path.
 * Paths follow:
 * - products/<product-id>/image-v<version>.webp
 * - skin-problems/<problem-id>/image-v<version>.webp
 * - pharmacy/logo-v<version>.webp
 * 
 * @param {Blob|File} file - Processed WebP file object
 * @param {string} destinationPath - Target path inside the bucket (e.g. `products/uuid/image-v1.webp`)
 * @param {string} bucketName - Bucket name (default: 'product-images')
 * @returns {Promise<{ publicUrl: string|null, path: string|null, error: Error|null }>}
 */
export async function uploadVersionedImage(file, destinationPath, bucketName = 'product-images') {
  try {
    if (!file) throw new Error('No image file provided for upload.');
    if (!destinationPath) throw new Error('Destination storage path is required.');

    // Security guard: Ensure active authenticated session
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) {
      throw new Error('Unauthorized: You must be logged in as an active administrator to upload images.');
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(destinationPath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/webp'
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { publicUrl: urlData.publicUrl, path: data.path, error: null };
  } catch (err) {
    console.warn(`Storage upload error for "${destinationPath}":`, err);
    return { publicUrl: null, path: null, error: err };
  }
}

/**
 * Legacy uploadImage helper for backward compatibility, routing to versioned upload.
 */
export async function uploadImage(file, bucketName = 'product-images', folder = 'products') {
  const version = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const path = `${folder}/${randomId}/image-v1.webp`;
  return uploadVersionedImage(file, path, bucketName);
}

/**
 * Extract storage relative path from a full URL or return the path if already relative.
 * @param {string} urlOrPath 
 * @param {string} bucketName 
 * @returns {string|null}
 */
export function extractStoragePath(urlOrPath, bucketName = 'product-images') {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;
  if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) {
    return urlOrPath;
  }
  const marker = `/${bucketName}/`;
  const idx = urlOrPath.indexOf(marker);
  if (idx !== -1) {
    return urlOrPath.substring(idx + marker.length);
  }
  return null;
}

/**
 * Delete an image from Supabase Storage by its path or public URL.
 * Only deletes when authenticated.
 * @param {string} urlOrPath - The file path or public URL in the bucket
 * @param {string} bucketName - Bucket name (default: 'product-images')
 * @returns {Promise<{ success: boolean, error: Error|null }>}
 */
export async function deleteImage(urlOrPath, bucketName = 'product-images') {
  try {
    const cleanPath = extractStoragePath(urlOrPath, bucketName);
    if (!cleanPath) return { success: true, error: null };

    // Don't attempt to delete external unsplash/placeholder URLs from Supabase
    if (urlOrPath.startsWith('http') && !urlOrPath.includes(supabaseUrl) && !urlOrPath.includes(bucketName)) {
      return { success: true, error: null };
    }

    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) {
      console.warn('Storage deletion skipped: Active admin authentication required.');
      return { success: false, error: new Error('Unauthorized delete request') };
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([cleanPath]);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.warn('Storage delete error:', err);
    return { success: false, error: err };
  }
}

export default supabase;
