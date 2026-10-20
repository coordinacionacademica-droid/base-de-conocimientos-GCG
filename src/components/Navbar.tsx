'use client';

import React from 'react';
import { Company } from '@/types';
import { Building2, LogOut, ExternalLink, ShieldCheck, FolderUp, ChevronDown } from 'lucide-react';
import { COMPANIES } from '@/config/companies';

interface NavbarProps {
  currentCompany: Company;
  isAdmin: boolean;
  onCompanyChange?: (company: Company) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCompany,
  isAdmin,
  onCompanyChange,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Branding & Company Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${currentCompany.logoColor || 'from-blue-600 to-indigo-600'} text-white shadow-md shadow-blue-500/20`}>
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Portal Corporativo GCG
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                    <ShieldCheck className="h-3 w-3" /> Admin
                  </span>
                )}
              </div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                {currentCompany.name}
              </h1>
            </div>
          </div>

          {/* Admin Company Switcher Dropdown */}
          {isAdmin && onCompanyChange && (
            <div className="relative ml-2 hidden md:block">
              <select
                aria-label="Seleccionar empresa a inspeccionar"
                value={currentCompany.id}
                onChange={(e) => {
                  const found = COMPANIES.find((c) => c.id === e.target.value);
                  if (found) onCompanyChange(found);
                }}
                className="appearance-none rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <a
            href={`https://drive.google.com/drive/folders/${currentCompany.folderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:inline-flex"
          >
            <FolderUp className="h-4 w-4" />
            <span>Subir / Abrir en Drive</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
