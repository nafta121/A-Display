import React from 'react';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  Palette, 
  ChevronLeft, 
  ChevronRight,
  Coffee
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tab } from './types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const menuItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu' as Tab, label: 'Menu Management', icon: MenuIcon },
    { id: 'theme' as Tab, label: 'Theme Settings', icon: Palette },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out z-40"
    >
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-[#c4a484] rounded-lg flex items-center justify-center text-white">
              <Coffee size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Admin Panel</span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-[#c4a484] rounded-lg flex items-center justify-center text-white mx-auto">
            <Coffee size={20} />
          </div>
        )}
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-gray-100 text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'text-[#c4a484]' : 'group-hover:text-[#c4a484]'} />
            {!isCollapsed && (
              <span className="font-medium whitespace-nowrap">{item.label}</span>
            )}
            {!isCollapsed && activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 bg-[#c4a484] rounded-full"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  );
};
