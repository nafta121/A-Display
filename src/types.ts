export type Category = 'Espresso Bar' | 'Signature Drinks' | 'Non-Coffee' | 'Pastries';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  discountPrice?: number;
  description: string;
  imageUrl: string;
  isHighlighted: boolean;
  isAvailable: boolean;
}

export interface ThemeSettings {
  brandName: string;
  logoUrl: string;
  primaryBg: string;
  accentColor: string;
  textColor: string;
  layout: 'grid' | 'list';
}

export type Tab = 'dashboard' | 'menu' | 'theme';
