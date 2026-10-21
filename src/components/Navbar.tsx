'use client';

import React, { useState, useEffect } from 'react';
import { Company } from '@/types';
import { Building2, LogOut, ExternalLink, ShieldCheck, FolderUp, ChevronDown, Grid, Sun, Moon } from 'lucide-react';
import { COMPANIES, GCG_OFFICIAL_LOGO } from '@/config/companies';

interface NavbarProps {
  currentCompany: Company;
  isAdmin: boolean;
  isInDirectoryView?: boolean;
  onGoToDirectory?: () => void;
  onCompanyChange?: (company: Company) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCompany,
  isAdmin,
  isInDirectoryView,
  onGoToDirectory,
  onCompanyChange,
  onLogout
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check saved theme or default to light
    const saved = localStorage.getItem('gcg_theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to Light Mode
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('gcg_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Branding & Company Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 overflow-hidden p-1 transition"
            >
              {isInDirectoryView ? (
                <img
                  src={GCG_OFFICIAL_LOGO}
                  alt="Grupo Corporativo GCG"
                  className="h-full w-full object-contain"
                />
              ) : currentCompany.logoUrl ? (
                <img
                  src={currentCompany.logoUrl}
                  alt={currentCompany.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-tr ${
                    currentCompany.logoColor || 'from-blue-600 to-indigo-600'
                  } text-white font-bold text-xs`}
                >
                  {currentCompany.code.slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Portal Corporativo GCG
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.2 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300">
                    <ShieldCheck className="h-3 w-3 text-amber-600" /> Admin
                  </span>
                )}
              </div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {isAdmin && isInDirectoryView ? 'Directorio General de Empresas' : currentCompany.name}
              </h1>
            </div>
          </div>

          {/* Admin Switcher */}
          {isAdmin && onCompanyChange && !isInDirectoryView && (
            <div className="relative ml-2 hidden xl:block">
              <select
                aria-label="Seleccionar empresa"
                value={currentCompany.id}
                onChange={(e) => {
                  const found = COMPANIES.find((c) => c.id === e.target.value);
                  if (found) onCompanyChange(found);
                }}
                className="appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-white focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {COMPANIES.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    Cambiar a: {comp.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Button to Toggle Directory */}
          {isAdmin && onGoToDirectory && !isInDirectoryView && (
            <button
              onClick={onGoToDirectory}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Grid className="h-4 w-4 text-blue-600" />
              <span className="hidden md:inline">Todas las Empresas</span>
            </button>
          )}

          {/* Direct Drive Link */}
          <a
            href={`https://drive.google.com/drive/folders/${currentCompany.folderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 sm:inline-flex"
          >
            <FolderUp className="h-4 w-4" />
            <span>Google Drive</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-amber-400"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-slate-600 hover:text-indigo-600" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-xs transition hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
