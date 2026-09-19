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
 * Upload an image file to Supabase Storage.
 * @param {File|Blob} file - The file object to upload
 * @param {string} bucketName - Bucket name (default: 'product-images')
 * @param {string} folder - Subfolder name (e.g. 'products' or 'problems')
 * @returns {Promise<{ publicUrl: string, path: string, error: Error|null }>}
 */
export async function uploadImage(file, bucketName = 'product-images', folder = 'products') {
  try {
    if (!file) throw new Error('No file provided');
    const fileExt = file.name ? file.name.split('.').pop() : 'webp';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { publicUrl: urlData.publicUrl, path: data.path, error: null };
  } catch (err) {
    console.warn('Storage upload error (bucket may need creation or public policy):', err);
    return { publicUrl: null, path: null, error: err };
  }
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
 * @param {string} urlOrPath - The file path or public URL in the bucket
 * @param {string} bucketName - Bucket name (default: 'product-images')
 * @returns {Promise<{ success: boolean, error: Error|null }>}
 */
export async function deleteImage(urlOrPath, bucketName = 'product-images') {
  try {
    const cleanPath = extractStoragePath(urlOrPath, bucketName);
    if (!cleanPath) return { success: true, error: null };
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
