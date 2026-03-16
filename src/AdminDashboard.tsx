import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MenuTable } from './MenuTable';
import { ThemeSettings } from './ThemeSettings';
import { Modal } from './Modal';
import { MenuItem, ThemeSettings as ThemeSettingsType, Tab, Category } from './types';

const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Midnight Velvet',
    category: 'Signature Drinks',
    price: 7.50,
    description: 'Activated charcoal, dark cocoa, vanilla bean.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=200',
    isHighlighted: true,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Caffè Latte',
    category: 'Espresso Bar',
    price: 5.25,
    discountPrice: 4.50,
    description: 'Espresso with velvety steamed milk.',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=200',
    isHighlighted: false,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Butter Croissant',
    category: 'Pastries',
    price: 4.50,
    description: 'Flaky, buttery French classic.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200',
    isHighlighted: false,
    isAvailable: true
  }
];

const INITIAL_THEME: ThemeSettingsType = {
  brandName: 'Espresso & Co.',
  logoUrl: '',
  primaryBg: '#120f0e',
  accentColor: '#c4a484',
  textColor: '#f5f2ed',
  layout: 'grid'
};

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsType>(INITIAL_THEME);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MenuItem>>({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        category: 'Espresso Bar',
        isAvailable: true,
        isHighlighted: false,
        price: 0
      });
    }
  }, [editingItem, isModalOpen]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item = formData as MenuItem;
    
    if (editingItem) {
      setMenuItems(prev => prev.map(i => i.id === editingItem.id ? { ...item, id: editingItem.id } : i));
      showToast('Item updated successfully');
    } else {
      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
      setMenuItems(prev => [newItem, ...prev]);
      showToast('New item added');
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(i => i.id !== id));
      showToast('Item removed', 'error');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return (
          <MenuTable 
            items={menuItems} 
            onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
            onDelete={handleDeleteItem}
            onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
          />
        );
      case 'theme':
        return <ThemeSettings settings={themeSettings} onUpdate={setThemeSettings} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Search size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Dashboard Analytics</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Sales reports and visitor statistics are coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search menu, categories..." 
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#c4a484] focus:bg-white outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-900">Admin User</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Manager</div>
              </div>
              <button 
                onClick={onExit}
                className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Item Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
      >
        <form onSubmit={handleSaveItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
              <input 
                type="text" 
                required
                value={formData.imageUrl || ''}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] outline-none transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Item Name</label>
              <input 
                type="text" 
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] outline-none transition-all bg-white"
              >
                <option value="Espresso Bar">Espresso Bar</option>
                <option value="Signature Drinks">Signature Drinks</option>
                <option value="Non-Coffee">Non-Coffee</option>
                <option value="Pastries">Pastries</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Base Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={formData.price || ''}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Discount Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={formData.discountPrice || ''}
                onChange={e => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-bold text-sm text-gray-900">Highlight Item</span>
                <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Chef's Choice Badge</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isHighlighted: !formData.isHighlighted })}
                className={`w-12 h-6 rounded-full transition-all relative ${formData.isHighlighted ? 'bg-[#c4a484]' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: formData.isHighlighted ? 26 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-bold text-sm text-gray-900">Availability</span>
                <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Show as Sold Out if disabled</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                className={`w-12 h-6 rounded-full transition-all relative ${formData.isAvailable ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: formData.isAvailable ? 26 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Item
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] ${
              notification.type === 'success' ? 'bg-gray-900 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
