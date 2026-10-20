'use client';

import React, { useState, useMemo } from 'react';
import { Company } from '@/types';
import { Building2, Search, ArrowRight, ExternalLink, KeyRound, FolderOpen } from 'lucide-react';

interface CompanyDirectoryProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

export const CompanyDirectory: React.FC<CompanyDirectoryProps> = ({
  companies,
  onSelectCompany
}) => {
  const [search, setSearch] = useState('');

  // Sort alphabetically by name
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [companies]);

  // Filter by search
  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return sortedCompanies;
    const query = search.toLowerCase();
    return sortedCompanies.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
    );
  }, [sortedCompanies, search]);

  return (
    <div className="space-y-6">
      {/* Directory Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Directorio Corporativo ({companies.length} Empresas)
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Selecciona una empresa para gestionar, visualizar y sincronizar sus archivos en tiempo real.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar empresa por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Grid of Company Bubbles / Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCompanies.map((company, index) => (
          <div
            key={company.id}
            onClick={() => onSelectCompany(company)}
            className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            {/* Top row: Avatar Bubble + Code Badge */}
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${
                    company.logoColor || 'from-blue-600 to-indigo-600'
                  } text-white shadow-md shadow-blue-500/20`}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {company.code}
                </span>
              </div>

              {/* Company Name */}
              <h3 className="mt-4 text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {company.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {company.description || 'Gestión documental y repositorio en la nube'}
              </p>
            </div>

            {/* Bottom Details & Actions */}
            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <KeyRound className="h-3 w-3 text-slate-400" />
                  PIN: {company.pin}
                </span>
                <a
                  href={`https://drive.google.com/drive/folders/${company.folderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Abrir en Google Drive"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-blue-600"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Explorar Archivos</span>
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
