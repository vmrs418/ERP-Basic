import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handleApiErrors(response: any, defaultErrorMessage: string = 'An error occurred') {
  if (response.error) {
    throw new Error(response.error.message || defaultErrorMessage);
  }
  return response.data;
} 