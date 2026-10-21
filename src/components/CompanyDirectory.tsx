'use client';

import React, { useState, useMemo } from 'react';
import { Company } from '@/types';
import { SECTORS } from '@/config/companies';
import {
  Building2,
  Search,
  ArrowRight,
  ExternalLink,
  KeyRound,
  FolderOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';

interface CompanyDirectoryProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

export const CompanyDirectory: React.FC<CompanyDirectoryProps> = ({
  companies,
  onSelectCompany
}) => {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos');

  // Sort alphabetically by name
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) =>
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );
  }, [companies]);

  // Filter by search & sector
  const filteredCompanies = useMemo(() => {
    return sortedCompanies.filter((company) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        company.name.toLowerCase().includes(query) ||
        company.code.toLowerCase().includes(query) ||
        (company.description && company.description.toLowerCase().includes(query));

      const matchesSector =
        selectedSector === 'Todos' || company.sector === selectedSector;

      return matchesSearch && matchesSector;
    });
  }, [sortedCompanies, search, selectedSector]);

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Directorio Corporativo Central
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-medium text-emerald-200 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> {companies.length} Empresas Vinculadas
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Portal Corporativo GCG
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-blue-100 leading-relaxed">
              Explorador en tiempo real de archivos institucionales. Selecciona cualquier empresa aliada para inspeccionar sus carpetas, manuales y videos almacenados en Google Drive con 0 MB de consumo en servidor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://solicitudvacaciones-one.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 hover:shadow-lg"
            >
              <span>Solicitud de Vacaciones</span>
              <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
            </a>

            <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur-md border border-white/10">
              <div className="text-xl font-black text-white">{companies.length}</div>
              <div className="text-[10px] font-medium text-blue-200 uppercase tracking-wider">Empresas</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur-md border border-white/10">
              <div className="text-xl font-black text-emerald-300">100%</div>
              <div className="text-[10px] font-medium text-blue-200 uppercase tracking-wider">Cloud Drive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sector Filter Row */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar empresa por nombre, código o rubro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Mostrando <strong>{filteredCompanies.length}</strong> de {companies.length} empresas
          </span>
        </div>

        {/* Sector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {SECTORS.map((sector) => {
            const isSelected = selectedSector === sector;
            return (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span>{sector}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Company Bubbles / Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            onClick={() => onSelectCompany(company)}
            className="group relative flex cursor-pointer flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/80 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-blue-600/80"
          >
            {/* Top row: Avatar Bubble + Code & Sector Badges */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${
                    company.logoColor || 'from-blue-600 to-indigo-600'
                  } text-white shadow-md shadow-blue-500/20 transition group-hover:scale-105 overflow-hidden`}
                >
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="h-full w-full object-contain p-1.5 bg-white"
                    />
                  ) : (
                    <Building2 className="h-6 w-6" />
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {company.code}
                  </span>
                  {company.sector && (
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {company.sector}
                    </span>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <h3 className="mt-4 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {company.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                {company.description || 'Gestión documental y repositorio institucional en la nube'}
              </p>
            </div>

            {/* Bottom Details & Actions */}
            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400">
                  <KeyRound className="h-3 w-3" />
                  PIN: {company.pin}
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Drive en Vivo
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-blue-600"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Explorar Archivos</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </button>

                <a
                  href={`https://drive.google.com/drive/folders/${company.folderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Abrir carpeta en Google Drive"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
