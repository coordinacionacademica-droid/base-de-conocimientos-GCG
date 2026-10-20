'use client';

import React from 'react';
import { Search, Film, FileText, FileSpreadsheet, LayoutGrid, List, RefreshCw, Layers } from 'lucide-react';
import { DriveFileItem } from '@/types';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalFiles: number;
  onRefresh: () => void;
  isLoading: boolean;
  fileCounts: {
    all: number;
    video: number;
    document: number;
    spreadsheet: number;
    pdf: number;
  };
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  totalFiles,
  onRefresh,
  isLoading,
  fileCounts
}) => {
  const categories = [
    { id: 'all', label: 'Todos', icon: Layers, count: fileCounts.all },
    { id: 'video', label: 'Videos', icon: Film, count: fileCounts.video },
    { id: 'document', label: 'Word / Docs', icon: FileText, count: fileCounts.document },
    { id: 'spreadsheet', label: 'Excel / Tablas', icon: FileSpreadsheet, count: fileCounts.spreadsheet },
    { id: 'pdf', label: 'PDFs / Certificados', icon: FileText, count: fileCounts.pdf },
  ];

  return (
    <div className="space-y-4">
      {/* Top bar: Search + View Mode + Refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de archivo (ej. video, diploma, riesgos)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Recargar archivos"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Grid / List switch */}
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Vista en cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Vista en lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-blue-600 dark:text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                  isSelected
                    ? 'bg-slate-800 text-slate-200 dark:bg-blue-700'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
