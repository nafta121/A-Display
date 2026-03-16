/**
 * Database schema interfaces matching Supabase PostgreSQL tables.
 */

export interface Category {
  id: string; // UUID
  name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface MenuItem {
  id: string; // UUID
  category_id: string; // UUID (Foreign Key)
  name: string;
  description: string | null;
  image_url: string;
  base_price: number;
  discount_price: number | null;
  is_highlight: boolean;
  is_available: boolean;
  created_at?: string;
}

export interface ThemeSetting {
  id: string; // UUID
  brand_name: string;
  logo_url: string | null;
  primary_bg_color: string;
  accent_color: string;
  text_color: string;
  display_layout: 'grid' | 'list';
  updated_at?: string;
}

export type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
  themeSettings: ThemeSetting | null;
};
