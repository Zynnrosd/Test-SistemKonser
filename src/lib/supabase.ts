import { createClient } from '@supabase/supabase-js';

// Kode ini akan otomatis menarik tulisan dari file .env Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);