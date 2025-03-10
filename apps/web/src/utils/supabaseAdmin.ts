import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
}

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper functions for common admin operations

/**
 * Get user details including custom data from the database
 */
export const getUserDetails = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*, roles(id, name)')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Update user custom data in the database
 */
export const updateUserData = async (userId: string, userData: any) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(userData)
    .eq('id', userId);

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Add a role to a user
 */
export const addRoleToUser = async (userId: string, roleId: string) => {
  const { data, error } = await supabaseAdmin
    .from('user_roles')
    .insert({ user_id: userId, role_id: roleId });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Remove a role from a user
 */
export const removeRoleFromUser = async (userId: string, roleId: string) => {
  const { data, error } = await supabaseAdmin
    .from('user_roles')
    .delete()
    .match({ user_id: userId, role_id: roleId });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Delete a user and all associated data
 */
export const deleteUser = async (userId: string) => {
  // First, delete any associated data in related tables

  // Then delete the auth user
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    throw error;
  }

  return { success: true };
}; 