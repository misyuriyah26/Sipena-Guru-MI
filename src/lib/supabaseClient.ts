import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve configured Supabase URL & Anon Key
const getEnvConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  // Local storage override from Settings page if configured directly in browser
  const storedUrl =
    typeof window !== 'undefined'
      ? localStorage.getItem('sipena_supabase_url_override') ||
        localStorage.getItem('sipena_supabase_url')
      : null;
  const storedKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('sipena_supabase_key_override') ||
        localStorage.getItem('sipena_supabase_anon_key')
      : null;

  const url = storedUrl || envUrl || '';
  const key = storedKey || envKey || '';

  return { url, key };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getEnvConfig();

  // Validate URL format before attempting initialization
  if (!url || !key || url.includes('your-project-id') || !url.startsWith('http')) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch {
      return null;
    }
  }

  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getEnvConfig();
  return Boolean(
    url &&
    key &&
    !url.includes('your-project-id') &&
    url.startsWith('http') &&
    key.length > 20
  );
};

export const testSupabaseConnection = async (
  customUrl?: string,
  customKey?: string
): Promise<{
  success: boolean;
  connected: boolean;
  message: string;
  error?: string;
}> => {
  let client = getSupabaseClient();

  if (customUrl && customKey) {
    try {
      client = createClient(customUrl, customKey);
    } catch (e: any) {
      return {
        success: false,
        connected: false,
        message: 'Format URL atau Key tidak valid',
        error: e.message,
      };
    }
  }

  if (!client) {
    return {
      success: false,
      connected: false,
      message: 'Supabase belum dikonfigurasi. Masukkan URL dan Anon Key di Pengaturan atau file .env.',
    };
  }

  try {
    const { error } = await client.from('profiles').select('id').limit(1);
    // Even if profiles table is empty or permission denied, reaching the server indicates connectivity
    if (error && error.code !== 'PGRST116' && !error.message.includes('permission denied')) {
      return {
        success: false,
        connected: false,
        message: `Koneksi tersambung tetapi ada respons: ${error.message}`,
        error: error.message,
      };
    }

    return {
      success: true,
      connected: true,
      message: 'Koneksi ke Supabase berhasil terverifikasi!',
    };
  } catch (err: any) {
    return {
      success: false,
      connected: false,
      message: 'Gagal terhubung ke host Supabase. Periksa URL dan koneksi internet.',
      error: err?.message || 'Network error',
    };
  }
};
