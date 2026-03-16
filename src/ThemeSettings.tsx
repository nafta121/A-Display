import React from 'react';
import { motion } from 'motion/react';
import { ThemeSettings as ThemeSettingsType } from './types';
import { Grid, List, Type, Palette, Image as ImageIcon } from 'lucide-react';

interface ThemeSettingsProps {
  settings: ThemeSettingsType;
  onUpdate: (settings: ThemeSettingsType) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ settings, onUpdate }) => {
  const handleChange = (key: keyof ThemeSettingsType, value: string) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Theme Customization</h3>
        <p className="text-gray-500 text-sm mt-1">Personalize the visual identity of your digital menu board.</p>
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
                value={settings.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] focus:border-transparent outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Logo URL</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={settings.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#c4a484] focus:border-transparent outline-none transition-all font-medium"
                  placeholder="https://..."
                />
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
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
                value={settings.primaryBg}
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
                value={settings.accentColor}
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
                value={settings.textColor}
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
                settings.layout === 'grid' 
                  ? 'border-[#c4a484] bg-[#c4a484]/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-3 rounded-xl ${settings.layout === 'grid' ? 'bg-[#c4a484] text-white' : 'bg-gray-100 text-gray-400'}`}>
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
                settings.layout === 'list' 
                  ? 'border-[#c4a484] bg-[#c4a484]/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-3 rounded-xl ${settings.layout === 'list' ? 'bg-[#c4a484] text-white' : 'bg-gray-100 text-gray-400'}`}>
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
    </div>
  );
};
