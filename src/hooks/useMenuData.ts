import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Category, MenuItem, ThemeSetting, MenuData } from '../types/database.types';

/**
 * Custom hook to fetch and manage digital menu board data from Supabase.
 * Returns data, loading state, error state, and a refresh function.
 */
export const useMenuData = () => {
  const [data, setData] = useState<MenuData>({
    categories: [],
    menuItems: [],
    themeSettings: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch Categories ordered by display_order
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (catError) throw catError;

      // 2. Fetch Menu Items
      const { data: menuItems, error: itemError } = await supabase
        .from('menu_items')
        .select('*');

      if (itemError) throw itemError;

      // 3. Fetch Theme Settings (Single row)
      const { data: themeSettings, error: themeError } = await supabase
        .from('theme_settings')
        .select('*')
        .single();

      // We don't throw if theme is missing, just handle it as null
      if (themeError && themeError.code !== 'PGRST116') {
        throw themeError;
      }

      setData({
        categories: categories || [],
        menuItems: menuItems || [],
        themeSettings: themeSettings || null,
      });
    } catch (err: any) {
      console.error('Error fetching menu data:', err.message);
      setError(err.message || 'An unexpected error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  return {
    ...data,
    isLoading,
    error,
    refresh: fetchMenuData,
  };
};
