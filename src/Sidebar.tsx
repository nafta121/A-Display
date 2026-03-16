import React from 'react';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  Palette, 
  ChevronLeft, 
  ChevronRight,
  Coffee,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab } from './types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen,
  onClose
}) => {
  const menuItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu' as Tab, label: 'Menu Management', icon: MenuIcon },
    { id: 'theme' as Tab, label: 'Theme Settings', icon: Palette },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -280,
          transition: { type: 'spring', damping: 25, stiffness: 200 }
        }}
        className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-200 z-50 flex flex-col md:translate-x-0 md:static"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c4a484] rounded-lg flex items-center justify-center text-white">
              <Coffee size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Admin Panel</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) onClose();
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-[#c4a484]' : 'group-hover:text-[#c4a484]'} />
              <span className="font-medium whitespace-nowrap">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 bg-[#c4a484] rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase truncate">Manager</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
