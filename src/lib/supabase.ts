import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://lib-placeholder.supabase.co';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!meta.env?.VITE_SUPABASE_URL || !meta.env?.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing. App will run in preview mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
