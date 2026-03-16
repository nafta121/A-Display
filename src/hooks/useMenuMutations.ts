import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MenuItem, ThemeSetting } from '../types/database.types';

/**
 * Custom hook for handling Supabase data mutations and storage operations.
 * Provides functions for CRUD on menu items, theme settings, and image uploads.
 */
export const useMenuMutations = () => {
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads an image to Supabase Storage and returns its public URL.
   * @param file The image file to upload.
   * @returns The public URL of the uploaded image.
   */
  const uploadMenuImage = async (file: File): Promise<string> => {
    setIsMutating(true);
    setError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      const msg = err.message || 'Failed to upload image';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsMutating(false);
    }
  };

  /**
   * Adds a new menu item to the database.
   */
  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>) => {
    setIsMutating(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err: any) {
      const msg = err.message || 'Failed to add menu item';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsMutating(false);
    }
  };

  /**
   * Updates an existing menu item.
   */
  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    setIsMutating(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err: any) {
      const msg = err.message || 'Failed to update menu item';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsMutating(false);
    }
  };

  /**
   * Deletes a menu item.
   */
  const deleteMenuItem = async (id: string) => {
    setIsMutating(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err: any) {
      const msg = err.message || 'Failed to delete menu item';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsMutating(false);
    }
  };

  /**
   * Saves/Updates the theme settings.
   */
  const saveThemeSettings = async (updates: Partial<ThemeSetting> & { id: string }) => {
    setIsMutating(true);
    setError(null);
    try {
      const { data, error: themeError } = await supabase
        .from('theme_settings')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (themeError) throw themeError;
      return data;
    } catch (err: any) {
      const msg = err.message || 'Failed to save theme settings';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsMutating(false);
    }
  };

  return {
    isMutating,
    error,
    uploadMenuImage,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    saveThemeSettings,
  };
};
