'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Company, DriveFileItem } from '@/types';
import { COMPANIES } from '@/config/companies';
import { Navbar } from '@/components/Navbar';
import { CompanyDirectory } from '@/components/CompanyDirectory';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { FileGrid } from '@/components/FileGrid';
import { FileList } from '@/components/FileList';
import { FilePreviewModal } from '@/components/FilePreviewModal';
import { FolderUp, CheckCircle2, Cloud, FolderOpen, ArrowUpRight, ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [currentCompany, setCurrentCompany] = useState<Company>(COMPANIES[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'directory' | 'company'>('company');
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<DriveFileItem | null>(null);

  // 1. Check Auth Session
  useEffect(() => {
    const sessionStr = localStorage.getItem('gcg_session');
    if (!sessionStr) {
      router.push('/login');
      return;
    }

    try {
      const session = JSON.parse(sessionStr);
      const isAdm = Boolean(session.isAdmin);
      setIsAdmin(isAdm);

      if (isAdm) {
        // Admin starts by seeing all company bubbles!
        setActiveTab('directory');
      } else {
        setActiveTab('company');
      }

      if (session.company) {
        const latestCompany = COMPANIES.find((c) => c.id === session.company.id) || session.company;
        setCurrentCompany(latestCompany);
      }
    } catch {
      router.push('/login');
    }
  }, [router]);

  // 2. Fetch Files for Company
  const loadFiles = async (folderId: string, company?: Company) => {
    setIsLoading(true);
    try {
      const comp = company || currentCompany;
      const res = await fetch(
        `/api/drive?folderId=${folderId}&companyName=${encodeURIComponent(comp.name)}&companyCode=${encodeURIComponent(comp.code)}&t=${Date.now()}`
      );
      const data = await res.json();
      if (data.success) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error cargando archivos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'company' && currentCompany?.folderId) {
      loadFiles(currentCompany.folderId, currentCompany);
    }
  }, [currentCompany, activeTab]);

  // 3. Category Counts
  const fileCounts = useMemo(() => {
    return {
      all: files.length,
      video: files.filter((f) => f.fileCategory === 'video').length,
      document: files.filter((f) => f.fileCategory === 'document').length,
      spreadsheet: files.filter((f) => f.fileCategory === 'spreadsheet').length,
      pdf: files.filter((f) => f.fileCategory === 'pdf').length
    };
  }, [files]);

  // 4. Filter and Search
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || file.fileCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [files, searchQuery, selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem('gcg_session');
    router.push('/login');
  };

  const handleSelectCompanyFromDirectory = (selected: Company) => {
    setCurrentCompany(selected);
    setActiveTab('company');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <Navbar
        currentCompany={currentCompany}
        isAdmin={isAdmin}
        isInDirectoryView={isAdmin && activeTab === 'directory'}
        onGoToDirectory={() => setActiveTab('directory')}
        onCompanyChange={(newComp) => {
          setCurrentCompany(newComp);
          setActiveTab('company');
        }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* VIEW 1: ADMIN DIRECTORY (BUBBLES ORDERED ALPHABETICALLY) */}
        {isAdmin && activeTab === 'directory' ? (
          <CompanyDirectory
            companies={COMPANIES}
            onSelectCompany={handleSelectCompanyFromDirectory}
          />
        ) : (
          /* VIEW 2: SINGLE COMPANY REPOSITORY */
          <div className="space-y-6">
            {/* Admin Back Button to Directory */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>← Volver al Directorio de Todas las Empresas</span>
              </button>
            )}

            {/* Banner with Company Information & Quick Upload */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl shadow-blue-950/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                      <Cloud className="h-3.5 w-3.5" /> Google Drive en vivo
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Sincronización en tiempo real
                    </span>
                  </div>
                  <h2 className="text-xl font-bold sm:text-2xl">{currentCompany.name}</h2>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {currentCompany.description || 'Repositorio exclusivo de archivos, manuales, normativas y videos.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={`https://drive.google.com/drive/folders/${currentCompany.folderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <FolderUp className="h-4 w-4 text-blue-600" />
                    <span>Subir / Gestionar en Drive</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </a>
                </div>
              </div>
            </div>

            {/* Search, Filter Tabs and View Switcher */}
            <div>
              <SearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalFiles={filteredFiles.length}
                onRefresh={() => loadFiles(currentCompany.folderId, currentCompany)}
                isLoading={isLoading}
                fileCounts={fileCounts}
              />
            </div>

            {/* Content Section: Grid, List or Empty State */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Mostrando <strong>{filteredFiles.length}</strong> archivo(s) de{' '}
                  <strong>{files.length}</strong> en Google Drive
                </span>
                <button
                  onClick={() => loadFiles(currentCompany.folderId, currentCompany)}
                  className="text-[11px] text-blue-600 hover:underline dark:text-blue-400"
                >
                  🔄 Sincronizar ahora
                </button>
              </div>

              {isLoading ? (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-xs font-medium text-slate-500">
                      Consultando Google Drive en vivo...
                    </span>
                  </div>
                </div>
              ) : files.length === 0 ? (
                /* Clean Empty State for New Folders */
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <FolderOpen className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Esta carpeta está vacía en Google Drive
                  </h3>
                  <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400">
                    Aún no se han subido archivos a la carpeta de <strong>{currentCompany.name}</strong>. En cuanto subas cualquier documento, video o PDF en Drive, aparecerá aquí automáticamente.
                  </p>
                  <a
                    href={`https://drive.google.com/drive/folders/${currentCompany.folderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    <FolderUp className="h-4 w-4" />
                    <span>Abrir carpeta en Google Drive para subir archivos</span>
                  </a>
                </div>
              ) : viewMode === 'grid' ? (
                <FileGrid files={filteredFiles} onOpenFile={(file) => setSelectedFile(file)} />
              ) : (
                <FileList files={filteredFiles} onOpenFile={(file) => setSelectedFile(file)} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* File Preview Modal (Videos, PDFs, Docs) */}
      <FilePreviewModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </div>
  );
}
