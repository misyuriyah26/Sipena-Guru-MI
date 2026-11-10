import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { navigationGroups } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage, madrasahProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSelectPage = (pageId: PageId) => {
    setActivePage(pageId);
    onClose();
  };

  const allItems = navigationGroups.flatMap((g) => g.items);
  const filteredItems = searchQuery.trim()
    ? allItems.filter((i) =>
        i.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-emerald-950 text-slate-100 flex flex-col h-full shadow-2xl z-10">
        {/* Drawer Header */}
        <div className="p-4 border-b border-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              SP
            </div>
            <div>
              <p className="font-bold text-sm text-white">SIPENA MI PERSONAL</p>
              <p className="text-[10px] text-emerald-300 truncate max-w-[170px]">
                {madrasahProfile.namaMadrasah}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-900 rounded-lg"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="p-3 border-b border-emerald-900/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu halaman..."
              className="w-full bg-emerald-900/70 text-white placeholder-emerald-400 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-emerald-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {filteredItems ? (
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-emerald-400 px-2 pb-1">
                Hasil Pencarian ({filteredItems.length})
              </p>
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-left ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-emerald-100/90 hover:bg-emerald-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
              {filteredItems.length === 0 && (
                <p className="text-center py-4 text-emerald-400 text-xs">
                  Tidak ada menu yang sesuai.
                </p>
              )}
            </div>
          ) : (
            navigationGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2 pb-1 text-[10px] font-bold text-emerald-400/80 uppercase">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectPage(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-left ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'text-emerald-100/90 hover:bg-emerald-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
