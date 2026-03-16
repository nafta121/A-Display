import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Sparkles, Clock, Info, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { Category, MenuItem, ThemeSetting } from './types/database.types';

/**
 * CustomerDisplay Component
 * A premium, real-time digital menu board optimized for landscape displays.
 */
export const CustomerDisplay: React.FC = () => {
  // --- STATE ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<ThemeSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [lastUpdatedItemId, setLastUpdatedItemId] = useState<string | null>(null);

  // --- DERIVED DATA ---
  const featuredItems = useMemo(() => 
    menuItems.filter(item => item.is_highlight && item.is_available), 
  [menuItems]);

  const currencyFormatter = useMemo(() => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }), []);

  // --- INITIAL FETCH ---
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [catRes, itemRes, themeRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('menu_items').select('*').eq('is_available', true),
        supabase.from('theme_settings').select('*').single()
      ]);

      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;
      
      setCategories(catRes.data || []);
      setMenuItems(itemRes.data || []);
      setTheme(themeRes.data || null);
    } catch (err: any) {
      console.error('Initial fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- REAL-TIME SUBSCRIPTIONS ---
  useEffect(() => {
    fetchData();

    // Subscribe to menu_items changes
    const menuChannel = supabase
      .channel('menu-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, (payload) => {
        const { eventType, new: newItem, old: oldItem } = payload;

        if (eventType === 'INSERT') {
          if (newItem.is_available) {
            setMenuItems(prev => [...prev, newItem as MenuItem]);
          }
        } else if (eventType === 'UPDATE') {
          setLastUpdatedItemId(newItem.id);
          setTimeout(() => setLastUpdatedItemId(null), 2000); // Clear highlight after 2s

          setMenuItems(prev => {
            if (!newItem.is_available) {
              return prev.filter(item => item.id !== newItem.id);
            }
            const index = prev.findIndex(item => item.id === newItem.id);
            if (index === -1) return [...prev, newItem as MenuItem];
            const next = [...prev];
            next[index] = newItem as MenuItem;
            return next;
          });
        } else if (eventType === 'DELETE') {
          setMenuItems(prev => prev.filter(item => item.id !== oldItem.id));
        }
      })
      .subscribe();

    // Subscribe to theme_settings changes
    const themeChannel = supabase
      .channel('theme-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'theme_settings' }, (payload) => {
        setTheme(payload.new as ThemeSetting);
      })
      .subscribe();

    // Clock Timer
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(themeChannel);
      clearInterval(clockInterval);
    };
  }, [fetchData]);

  // --- FEATURED ROTATION ---
  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredItems.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  // --- THEME STYLES ---
  const themeStyles = useMemo(() => {
    if (!theme) return {};
    return {
      '--primary-bg': theme.primary_bg_color,
      '--accent': theme.accent_color,
      '--text': theme.text_color,
      '--surface': `${theme.primary_bg_color}ee`,
      '--surface-light': `${theme.accent_color}15`,
    } as React.CSSProperties;
  }, [theme]);

  // --- RENDER HELPERS ---
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#120f0e] flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader2 size={48} className="text-[#c4a484]" />
        </motion.div>
        <p className="text-[#d9c5b2] font-mono text-sm tracking-widest uppercase animate-pulse">Initializing Menu Board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-red-950 flex items-center justify-center p-12">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-200">Connection Failed</h1>
          <p className="text-red-300/70 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-800 text-white rounded-full hover:bg-red-700 transition-colors">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-row selection:bg-[var(--accent)] selection:text-[var(--primary-bg)] transition-colors duration-1000"
      style={{ 
        ...themeStyles, 
        backgroundColor: 'var(--primary-bg)', 
        color: 'var(--text)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* LEFT SECTION: BRAND & FEATURED (1/3) */}
      <aside className="w-1/3 h-full border-r border-white/5 flex flex-col p-8 gap-8 relative z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 overflow-hidden">
              {theme?.logo_url ? (
                <img src={theme.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Coffee size={28} className="text-[var(--primary-bg)]" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
                {theme?.brand_name || 'Espresso & Co.'}
              </h1>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold">Digital Menu Board</span>
            </div>
          </div>
        </div>

        {/* Featured Card */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {featuredItems.length > 0 ? (
              <motion.div
                key={featuredItems[featuredIndex].id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
                className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group"
              >
                <img 
                  src={featuredItems[featuredIndex].image_url} 
                  alt={featuredItems[featuredIndex].name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] linear group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-bg)] via-[var(--primary-bg)]/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--accent)] text-[var(--primary-bg)] rounded-full text-[10px] font-black uppercase mb-6 shadow-xl">
                    <Sparkles size={14} />
                    <span>Chef's Choice</span>
                  </div>
                  <h2 className="text-5xl font-serif italic mb-4 leading-[1.1]">
                    {featuredItems[featuredIndex].name}
                  </h2>
                  <p className="text-sm opacity-70 mb-8 leading-relaxed line-clamp-3">
                    {featuredItems[featuredIndex].description}
                  </p>
                  <div className="text-4xl font-light tracking-tighter">
                    {currencyFormatter.format(featuredItems[featuredIndex].discount_price || featuredItems[featuredIndex].base_price)}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="aspect-[3/4] rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                <p className="text-xs opacity-30 uppercase tracking-widest">No Featured Items</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 text-sm font-mono opacity-60">
            <Clock size={18} className="text-[var(--accent)]" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex gap-2">
            {featuredItems.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === featuredIndex ? 'w-8 bg-[var(--accent)]' : 'w-1.5 bg-white/10'}`} 
              />
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT SECTION: MENU GRID (2/3) */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar p-12 lg:p-16 bg-black/10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className={`grid gap-x-16 gap-y-20 ${theme?.display_layout === 'list' ? 'grid-cols-1 max-w-4xl mx-auto' : 'grid-cols-2'}`}
        >
          {categories.map((category) => {
            const items = menuItems.filter(item => item.category_id === category.id);
            if (items.length === 0) return null;

            return (
              <motion.section 
                key={category.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0, 0, 1] } }
                }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] opacity-40">{category.name}</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="space-y-10">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      animate={lastUpdatedItemId === item.id ? { 
                        scale: [1, 1.02, 1],
                        backgroundColor: ['transparent', 'rgba(255,255,255,0.05)', 'transparent']
                      } : {}}
                      className="flex justify-between items-start group relative"
                    >
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold group-hover:text-[var(--accent)] transition-colors duration-300">
                            {item.name}
                          </h3>
                          {item.is_highlight && (
                            <Sparkles size={14} className="text-[var(--accent)] animate-pulse" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm opacity-40 font-light leading-relaxed mt-2 max-w-md">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-light tracking-tighter">
                          {currencyFormatter.format(item.discount_price || item.base_price)}
                        </div>
                        {item.discount_price && (
                          <div className="text-xs line-through opacity-30 mt-1">
                            {currencyFormatter.format(item.base_price)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </motion.div>

        {/* Global Add-ons / Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-x-12 gap-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Milk Alternatives: Oat, Almond, Soy (+ $0.75)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Extra Shot: + $1.50</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Syrups: Vanilla, Caramel, Hazelnut (+ $0.50)</span>
          </div>
        </motion.div>
      </main>

      {/* Custom Scrollbar Hiding Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
