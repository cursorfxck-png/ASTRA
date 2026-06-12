import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Bucket name constant
export const BUCKET_NAME = 'astra-bucket';

/**
 * Get public URL for a file in the bucket
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(file: File, filePath: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  return getPublicUrl(filePath);
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFile(filePath: string) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw error;
  }
}

/**
 * List all files in a folder
 */
export async function listFiles(folder: string = '') {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get site content from Supabase
 */
export async function getSiteContentFromSupabase() {
  try {
    const url = getPublicUrl('site-content.json');
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }
      throw new Error(`Failed to fetch site content: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      throw error;
    }
    console.error('Error fetching site content from Supabase:', error);
    throw error;
  }
}

/**
 * Update site content in Supabase
 */
export async function updateSiteContentInSupabase(content: any) {
  try {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const file = new File([blob], 'site-content.json', { type: 'application/json' });
    
    return await uploadFile(file, 'site-content.json');
  } catch (error) {
    console.error('Error updating site content in Supabase:', error);
    throw new Error('Failed to update content in Supabase. Please check your bucket configuration.');
  }
}
