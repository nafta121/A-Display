import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, Coffee, Croissant, Sparkles, Leaf, Info, ChevronLeft, ChevronRight, Loader2, Monitor, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminDashboard } from './AdminDashboard';
import { CustomerDisplay } from './CustomerDisplay';
import { useMenuData } from './hooks/useMenuData';

type ViewMode = 'board' | 'admin' | 'customer';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const { categories, menuItems, themeSettings, isLoading: isDataLoading, error } = useMenuData();
  const [time, setTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Filter featured items from menu items (e.g., items with is_highlight = true)
  const featuredItems = useMemo(() => {
    return menuItems.filter(item => item.is_highlight);
  }, [menuItems]);

  const nextFeatured = useCallback(() => {
    if (featuredItems.length === 0) return;
    setDirection(1);
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
  }, [featuredItems.length]);

  const prevFeatured = useCallback(() => {
    if (featuredItems.length === 0) return;
    setDirection(-1);
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  }, [featuredItems.length]);

  useEffect(() => {
    if (featuredItems.length === 0) return;
    const carouselTimer = setInterval(nextFeatured, 8000);
    return () => clearInterval(carouselTimer);
  }, [nextFeatured, featuredItems.length]);

  useEffect(() => {
    // Simulate initial loading for motion effect
    const timer = setTimeout(() => setIsLoading(false), 800);
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clockTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Dynamic Theme Styles
  const themeStyles = useMemo(() => {
    if (!themeSettings) return {};
    return {
      '--color-espresso': themeSettings.primary_bg_color,
      '--color-accent': themeSettings.accent_color,
      '--color-cream': themeSettings.text_color,
      // Derive a surface color (slightly lighter/darker than bg)
      '--color-surface': `${themeSettings.primary_bg_color}cc`, 
    } as React.CSSProperties;
  }, [themeSettings]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: [0.2, 0, 0, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.3, 0, 0, 1] }
    }
  };

  const handleAdminAccess = () => {
    const pin = prompt("Enter PIN (1234 for Admin, 0000 for Customer Display):");
    if (pin === "1234") {
      setViewMode('admin');
    } else if (pin === "0000") {
      setViewMode('customer');
    } else if (pin !== null) {
      alert("Incorrect PIN");
    }
  };

  if (isLoading || isDataLoading) {
    return (
      <div className="h-screen w-screen bg-espresso flex items-center justify-center" style={themeStyles}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Coffee size={48} className="text-accent" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-espresso flex flex-col items-center justify-center p-8 text-center" style={themeStyles}>
        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Connection Error</h2>
          <p className="text-cream/60 text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent text-espresso rounded-full font-bold text-sm"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'admin') {
    return <AdminDashboard onExit={() => setViewMode('board')} />;
  }

  if (viewMode === 'customer') {
    return (
      <div className="relative h-screen w-screen">
        <CustomerDisplay />
        <button 
          onClick={() => setViewMode('board')}
          className="fixed bottom-4 right-4 z-50 p-3 bg-black/20 backdrop-blur-md rounded-full text-white/40 hover:text-white hover:bg-black/40 transition-all opacity-0 hover:opacity-100"
          title="Exit Customer Display"
        >
          <Monitor size={20} />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-espresso text-cream selection:bg-accent selection:text-espresso transition-colors duration-700"
      style={themeStyles}
    >
      {/* View Switcher (Dev Only) */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setViewMode('customer')}
          className="p-2 bg-white/5 backdrop-blur-md rounded-lg text-cream/40 hover:text-cream hover:bg-white/10 transition-all"
          title="Switch to Customer Display"
        >
          <Monitor size={18} />
        </button>
        <button 
          onClick={handleAdminAccess}
          className="p-2 bg-white/5 backdrop-blur-md rounded-lg text-cream/40 hover:text-cream hover:bg-white/10 transition-all"
          title="Admin Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Main Container: Mobile-First Stack, Desktop Row */}
      <div className="flex flex-col lg:flex-row h-full min-h-screen p-4 md:p-6 lg:p-8 gap-6 lg:gap-8">
        
        {/* Left/Top Section: Brand & Featured */}
        <motion.aside 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleAdminAccess}
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-full flex items-center justify-center text-espresso shadow-lg shadow-accent/20"
              >
                {themeSettings?.logo_url ? (
                  <img src={themeSettings.logo_url} alt="Logo" className="w-6 h-6 object-contain" />
                ) : (
                  <Coffee size={24} />
                )}
              </motion.div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tighter uppercase">
                {themeSettings?.brand_name || 'Espresso & Co.'}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-latte font-mono text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Clock size={16} />
              <span>{formatTime(time)}</span>
            </div>
          </div>

          {/* Featured Carousel */}
          <div className="relative flex-1 min-h-[350px] lg:min-h-0 rounded-3xl overflow-hidden group shadow-2xl shadow-black/50 border border-white/5">
            {featuredItems.length > 0 ? (
              <>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={currentFeaturedIndex}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                    transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={featuredItems[currentFeaturedIndex].image_url} 
                      alt={featuredItems[currentFeaturedIndex].name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-espresso rounded-full text-[10px] font-bold uppercase mb-4"
                      >
                        <Sparkles size={12} />
                        <span>Featured Item</span>
                      </motion.div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic mb-2 leading-tight">
                        {featuredItems[currentFeaturedIndex].name}
                      </h2>
                      <p className="text-latte text-sm mb-6 leading-relaxed max-w-xs opacity-90">
                        {featuredItems[currentFeaturedIndex].description}
                      </p>
                      <div className="text-2xl md:text-3xl font-light tracking-tight">
                        ${featuredItems[currentFeaturedIndex].base_price}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevFeatured(); }}
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent hover:text-espresso transition-all duration-300 pointer-events-auto"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextFeatured(); }}
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent hover:text-espresso transition-all duration-300 pointer-events-auto"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="absolute top-6 right-8 flex gap-2">
                  {featuredItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentFeaturedIndex ? 1 : -1);
                        setCurrentFeaturedIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        idx === currentFeaturedIndex ? 'w-6 bg-accent' : 'w-1.5 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <p className="text-latte/40 text-sm italic">No featured items available</p>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="bg-surface rounded-2xl p-5 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-latte/10 rounded-xl flex items-center justify-center text-latte">
              <Leaf size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-xs uppercase tracking-wider">Ethically Sourced</h3>
              <p className="text-[11px] text-latte/60 leading-normal">100% Arabica beans from sustainable farms in Ethiopia.</p>
            </div>
            <Info size={16} className="text-latte/30" />
          </div>
        </motion.aside>

        {/* Right Section: Menu Grid */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-8"
        >
          {/* Menu Grid: 1 col on small, 2 cols on medium+ */}
          <div className={`grid grid-cols-1 ${themeSettings?.display_layout === 'list' ? 'md:grid-cols-1 max-w-2xl mx-auto w-full' : 'md:grid-cols-2'} gap-x-12 gap-y-10`}>
            {categories.map((category) => (
              <motion.section 
                key={category.id}
                variants={itemVariants}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-latte">{category.name}</h2>
                </div>
                
                <div className="space-y-6">
                  {menuItems
                    .filter(item => item.category_id === category.id && item.is_available)
                    .map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 4 }}
                      className="flex justify-between items-start group cursor-default p-2 -m-2 rounded-xl hover:bg-white/5 transition-all duration-300 ease-m3-standard"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg group-hover:text-accent transition-colors duration-300">{item.name}</h3>
                          {item.is_highlight && (
                            <Sparkles size={14} className="text-accent" />
                          )}
                        </div>
                        <p className="text-xs text-latte/50 font-light leading-relaxed mt-1 group-hover:text-latte/80 transition-colors">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-light tracking-tight text-cream/90">
                          ${item.discount_price || item.base_price}
                        </div>
                        {item.discount_price && (
                          <div className="text-[10px] line-through text-latte/40">${item.base_price}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Footer Add-ons */}
          <motion.div 
            variants={itemVariants}
            className="mt-auto pt-8 border-t border-white/5"
          >
            <div className="flex flex-wrap gap-y-4 gap-x-8 text-[10px] uppercase tracking-[0.2em] text-latte/40 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" />
                <span>Milk Alternatives: Oat, Almond, Soy (+ $0.75)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" />
                <span>Extra Shot: + $1.50</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" />
                <span>Syrups: Vanilla, Caramel, Hazelnut (+ $0.50)</span>
              </div>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
