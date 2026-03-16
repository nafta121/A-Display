import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing. Please check your .env file.'
  );
}

/**
 * Supabase client instance for database interactions.
 * Uses environment variables for secure configuration.
 */
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
