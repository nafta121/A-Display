import { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, Coffee, Croissant, Sparkles, Leaf, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- MENU DATA STRUCTURE ---
// In a production environment, this would be fetched from an API.
const INITIAL_MENU_DATA = {
  categories: [
    {
      id: 'espresso-bar',
      title: 'Espresso Bar',
      icon: <Coffee size={18} />,
      items: [
        { name: 'Espresso', price: '3.50', desc: 'Double shot of our signature house blend' },
        { name: 'Americano', price: '4.00', desc: 'Espresso with hot water' },
        { name: 'Cappuccino', price: '4.75', desc: 'Equal parts espresso, steamed milk, and foam' },
        { name: 'Flat White', price: '4.75', desc: 'Velvety micro-foam over a double shot' },
        { name: 'Caffè Latte', price: '5.25', desc: 'Espresso with steamed milk and a thin layer of foam' },
        { name: 'Cortado', price: '4.25', desc: 'Equal parts espresso and warm milk' },
      ]
    },
    {
      id: 'signature-drinks',
      title: 'Signature Drinks',
      icon: <Sparkles size={18} />,
      items: [
        { name: 'Lavender Honey Latte', price: '6.50', desc: 'House-made lavender syrup and local honey' },
        { name: 'Smoked Sea Salt Mocha', price: '6.75', desc: 'Dark chocolate with a hint of hickory smoke' },
        { name: 'Maple Bourbon Cold Brew', price: '6.25', desc: 'Slow-steeped with maple and oak notes' },
        { name: 'Rosemary Pistachio Latte', price: '6.50', desc: 'Earthy pistachio with fresh rosemary infusion' },
      ]
    },
    {
      id: 'non-coffee',
      title: 'Non-Coffee',
      icon: <Leaf size={18} />,
      items: [
        { name: 'Ceremonial Matcha', price: '5.75', desc: 'Stone-ground Japanese green tea' },
        { name: 'Chai Tea Latte', price: '5.50', desc: 'Spiced black tea blend with steamed milk' },
        { name: 'London Fog', price: '5.25', desc: 'Earl Grey tea, vanilla, and steamed milk' },
        { name: 'Hibiscus Berry Iced Tea', price: '4.75', desc: 'Refreshing floral and tart berry notes' },
      ]
    },
    {
      id: 'pastries',
      title: 'Fresh Pastries',
      icon: <Croissant size={18} />,
      items: [
        { name: 'Butter Croissant', price: '4.50', desc: 'Flaky, buttery French classic' },
        { name: 'Almond Pain au Chocolat', price: '5.25', desc: 'Dark chocolate and almond frangipane' },
        { name: 'Cardamom Bun', price: '4.75', desc: 'Swedish-style spiced sweet dough' },
        { name: 'Lemon Poppyseed Loaf', price: '4.25', desc: 'Zesty citrus with a delicate crunch' },
      ]
    }
  ],
  featuredItems: [
    {
      id: 'f1',
      title: 'Midnight Velvet',
      price: '7.50',
      tag: 'Drink of the Day',
      desc: 'A smooth blend of activated charcoal, dark cocoa, and vanilla bean, topped with a dusting of gold flakes.',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'f2',
      title: 'Golden Turmeric Latte',
      price: '6.25',
      tag: 'Seasonal Special',
      desc: 'Warm and earthy turmeric blend with ginger, cinnamon, and a touch of black pepper for the perfect glow.',
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'f3',
      title: 'Pistachio Cloud',
      price: '6.95',
      tag: 'Chef\'s Choice',
      desc: 'Lightly sweetened pistachio cream over our signature cold brew, finished with crushed roasted nuts.',
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=1000'
    }
  ]
};

export default function App() {
  const [menuData, setMenuData] = useState(INITIAL_MENU_DATA);
  const [time, setTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextFeatured = useCallback(() => {
    setDirection(1);
    setCurrentFeaturedIndex((prev) => (prev + 1) % menuData.featuredItems.length);
  }, [menuData.featuredItems.length]);

  const prevFeatured = useCallback(() => {
    setDirection(-1);
    setCurrentFeaturedIndex((prev) => (prev - 1 + menuData.featuredItems.length) % menuData.featuredItems.length);
  }, [menuData.featuredItems.length]);

  useEffect(() => {
    // Auto-play carousel every 8 seconds
    const carouselTimer = setInterval(nextFeatured, 8000);
    return () => clearInterval(carouselTimer);
  }, [nextFeatured]);

  // --- API INTEGRATION EXAMPLE ---
  /*
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://api.yourcoffee.shop/v1/menu');
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);
  */

  useEffect(() => {
    // Simulate loading for motion effect
    const timer = setTimeout(() => setIsLoading(false), 500);
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clockTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animation Variants (Material 3 Inspired)
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
    const pin = prompt("Enter Admin PIN:");
    if (pin === "1234") {
      window.location.href = "/admin.html";
    } else if (pin !== null) {
      alert("Incorrect PIN");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-espresso flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Coffee size={48} className="text-accent" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-espresso text-cream selection:bg-accent selection:text-espresso">
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
                <Coffee size={24} />
              </motion.div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tighter uppercase">Espresso & Co.</h1>
            </div>
            <div className="flex items-center gap-2 text-latte font-mono text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Clock size={16} />
              <span>{formatTime(time)}</span>
            </div>
          </div>

          {/* Featured Carousel */}
          <div className="relative flex-1 min-h-[350px] lg:min-h-0 rounded-3xl overflow-hidden group shadow-2xl shadow-black/50 border border-white/5">
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
                  src={menuData.featuredItems[currentFeaturedIndex].imageUrl} 
                  alt={menuData.featuredItems[currentFeaturedIndex].title}
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
                    <span>{menuData.featuredItems[currentFeaturedIndex].tag}</span>
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic mb-2 leading-tight">
                    {menuData.featuredItems[currentFeaturedIndex].title}
                  </h2>
                  <p className="text-latte text-sm mb-6 leading-relaxed max-w-xs opacity-90">
                    {menuData.featuredItems[currentFeaturedIndex].desc}
                  </p>
                  <div className="text-2xl md:text-3xl font-light tracking-tight">
                    ${menuData.featuredItems[currentFeaturedIndex].price}
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
              {menuData.featuredItems.map((_, idx) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {menuData.categories.map((category) => (
              <motion.section 
                key={category.id}
                variants={itemVariants}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                  <span className="text-accent">{category.icon}</span>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-latte">{category.title}</h2>
                </div>
                
                <div className="space-y-6">
                  {category.items.map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 4 }}
                      className="flex justify-between items-start group cursor-default p-2 -m-2 rounded-xl hover:bg-white/5 transition-all duration-300 ease-m3-standard"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg group-hover:text-accent transition-colors duration-300">{item.name}</h3>
                        </div>
                        <p className="text-xs text-latte/50 font-light leading-relaxed mt-1 group-hover:text-latte/80 transition-colors">
                          {item.desc}
                        </p>
                      </div>
                      <div className="text-lg font-light tracking-tight text-cream/90">${item.price}</div>
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
