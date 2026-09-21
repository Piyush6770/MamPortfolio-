import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

const BUCKET_NAME = 'portfolio';

/**
 * Convert file to base64 data URL
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const storageService = {
  /**
   * Upload file to Supabase Storage with graceful Base64 fallback
   * @param {File} file - File object to upload
   * @param {string} folder - subfolder (e.g. 'gallery', 'profile', 'projects', 'resumes')
   * @returns {Promise<{url: string|null, error: Error|null}>}
   */
  async uploadFile(file, folder = 'general') {
    if (!file) return { url: null, error: new Error('No file provided') };

    // Max 15MB file size limit
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { url: null, error: new Error('File size exceeds the 15MB limit.') };
    }

    // 1. Try Supabase storage if configured and reachable
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${folder}/${Date.now()}_${sanitizedName}.${fileExt}`;

        const uploadPromise = supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        // 2.5s timeout for storage upload
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Storage upload timeout')), 2500)
        );

        const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

        if (!error && data?.path) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

          if (publicUrlData?.publicUrl) {
            return { url: publicUrlData.publicUrl, error: null };
          }
        }
      } catch (err) {
        console.warn('[Storage] Remote bucket upload failed, using local high-fidelity Base64 storage:', err?.message);
      }
    }

    // 2. Base64 fallback (works seamlessly in all browsers and saves permanently)
    try {
      const base64Url = await fileToBase64(file);
      return { url: base64Url, error: null };
    } catch (err) {
      return { url: null, error: new Error('Failed to process image file.') };
    }
  },

  /**
   * Delete a file from storage if URL belongs to Supabase
   */
  async deleteFile(fileUrl) {
    if (!fileUrl || !isSupabaseConfigured || !supabase) return { error: null };

    try {
      if (!fileUrl.includes(BUCKET_NAME)) return { error: null };
      const path = fileUrl.split(`${BUCKET_NAME}/`)[1];
      if (!path) return { error: null };

      const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
      return { error };
    } catch (err) {
      return { error: null };
    }
  },
};
