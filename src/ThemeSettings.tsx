import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeSettings as ThemeSettingsType } from './types';
import { 
  Grid, 
  List, 
  Type, 
  Palette, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';

interface ThemeSettingsProps {
  settings: ThemeSettingsType;
  onUpdate: (settings: ThemeSettingsType) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<ThemeSettingsType>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Sync local state if prop changes externally
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof ThemeSettingsType, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    onUpdate(localSettings);
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Theme Customization</h3>
          <p className="text-gray-500 text-sm mt-1">Personalize the visual identity of your digital menu board.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Branding Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <Type size={20} className="text-[#c4a484]" />
            <h4 className="font-bold text-gray-900">Branding</h4>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Brand Name</label>
              <input 
                type="text" 
                value={localSettings.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] focus:border-transparent outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Logo URL</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={localSettings.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] focus:border-transparent outline-none transition-all font-medium"
                  placeholder="https://..."
                />
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                  {localSettings.logoUrl ? (
                    <img src={localSettings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon size={20} className="text-gray-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Colors Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <Palette size={20} className="text-[#c4a484]" />
            <h4 className="font-bold text-gray-900">Color Palette</h4>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-gray-700">Primary Background</label>
                <p className="text-xs text-gray-400">Main screen background</p>
              </div>
              <input 
                type="color" 
                value={localSettings.primaryBg}
                onChange={(e) => handleChange('primaryBg', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-gray-700">Accent Color</label>
                <p className="text-xs text-gray-400">Buttons and highlights</p>
              </div>
              <input 
                type="color" 
                value={localSettings.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-gray-700">Text Color</label>
                <p className="text-xs text-gray-400">Primary typography</p>
              </div>
              <input 
                type="color" 
                value={localSettings.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 overflow-hidden"
              />
            </div>
          </div>
        </motion.div>

        {/* Layout Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 md:col-span-2"
        >
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <Grid size={20} className="text-[#c4a484]" />
            <h4 className="font-bold text-gray-900">Display Layout</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleChange('layout', 'grid')}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                localSettings.layout === 'grid' 
                  ? 'border-[#c4a484] bg-[#c4a484]/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-3 rounded-xl ${localSettings.layout === 'grid' ? 'bg-[#c4a484] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Grid size={24} />
              </div>
              <div>
                <span className="block font-bold text-gray-900">Grid View</span>
                <span className="block text-xs text-gray-500">Modern card-based layout</span>
              </div>
            </button>
            <button
              onClick={() => handleChange('layout', 'list')}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                localSettings.layout === 'list' 
                  ? 'border-[#c4a484] bg-[#c4a484]/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-3 rounded-xl ${localSettings.layout === 'list' ? 'bg-[#c4a484] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <List size={24} />
              </div>
              <div>
                <span className="block font-bold text-gray-900">List View</span>
                <span className="block text-xs text-gray-500">Classic vertical list layout</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-[280px] right-0 p-4 md:p-6 z-40">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-4 flex items-center justify-between gap-4"
          >
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unsaved Changes</p>
              <p className="text-sm text-gray-600 font-medium">Modify your theme and apply to live board.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 md:left-[calc(50%+140px)] z-50 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="font-bold text-sm">Theme Updated</p>
              <p className="text-xs text-gray-400">Changes are now live on the menu board.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
