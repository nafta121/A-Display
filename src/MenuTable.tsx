import React from 'react';
import { Edit2, Trash2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem } from './types';

interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const MenuTable: React.FC<MenuTableProps> = ({ items, onEdit, onDelete, onAdd }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Menu Inventory</h3>
          <p className="text-gray-500 text-sm mt-1">Manage your coffee shop offerings and pricing.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Item
        </motion.button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Item</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Price</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <motion.tr 
                  layout
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          {item.name}
                          {item.isHighlighted && <Sparkles size={14} className="text-amber-500" />}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">${item.price.toFixed(2)}</div>
                    {item.discountPrice && (
                      <div className="text-[10px] text-red-500 line-through font-medium">
                        ${item.discountPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                      item.isAvailable 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">No menu items found. Start by adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
};
