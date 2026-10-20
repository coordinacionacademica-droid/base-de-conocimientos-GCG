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
import { UploadModal } from '@/components/UploadModal';
import {
  FolderUp,
  CheckCircle2,
  Cloud,
  FolderOpen,
  ArrowUpRight,
  ArrowLeft,
  ChevronRight,
  Folder,
  HardDrive
} from 'lucide-react';

interface FolderBreadcrumb {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentCompany, setCurrentCompany] = useState<Company>(COMPANIES[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'directory' | 'company'>('company');
  const [activeFolderId, setActiveFolderId] = useState<string>('');
  const [folderHistory, setFolderHistory] = useState<FolderBreadcrumb[]>([]);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<DriveFileItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
        setActiveTab('directory');
      } else {
        setActiveTab('company');
      }

      if (session.company) {
        const latestCompany = COMPANIES.find((c) => c.id === session.company.id) || session.company;
        setCurrentCompany(latestCompany);
        setActiveFolderId(latestCompany.folderId);
        setFolderHistory([{ id: latestCompany.folderId, name: latestCompany.name }]);
      }
    } catch {
      router.push('/login');
    }
  }, [router]);

  // 2. Fetch Files for active folder
  const loadFiles = async (folderId: string) => {
    if (!folderId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/drive?folderId=${folderId}&t=${Date.now()}`);
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
    if (activeTab === 'company' && activeFolderId) {
      loadFiles(activeFolderId);
    }
  }, [activeFolderId, activeTab]);

  // 3. Category Counts
  const fileCounts = useMemo(() => {
    return {
      all: files.length,
      folder: files.filter((f) => f.fileCategory === 'folder').length,
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
    setActiveFolderId(selected.folderId);
    setFolderHistory([{ id: selected.folderId, name: selected.name }]);
    setActiveTab('company');
  };

  // Subfolder Navigation
  const handleOpenFolder = (folderItem: DriveFileItem) => {
    setActiveFolderId(folderItem.id);
    setFolderHistory((prev) => [...prev, { id: folderItem.id, name: folderItem.name }]);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    const target = folderHistory[index];
    setFolderHistory((prev) => prev.slice(0, index + 1));
    setActiveFolderId(target.id);
  };

  const currentFolderDisplayName =
    folderHistory.length > 0 ? folderHistory[folderHistory.length - 1].name : currentCompany.name;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar */}
      <Navbar
        currentCompany={currentCompany}
        isAdmin={isAdmin}
        isInDirectoryView={isAdmin && activeTab === 'directory'}
        onGoToDirectory={() => setActiveTab('directory')}
        onCompanyChange={(newComp) => {
          handleSelectCompanyFromDirectory(newComp);
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
            {/* Top Navigation Row: Back Button + Breadcrumbs + Drive Link */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('directory')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Directorio</span>
                  </button>
                )}

                {/* Breadcrumb Path */}
                {folderHistory.map((crumb, idx) => (
                  <React.Fragment key={crumb.id}>
                    {(idx > 0 || isAdmin) && (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                    )}
                    <button
                      onClick={() => handleNavigateBreadcrumb(idx)}
                      className={`inline-flex items-center gap-1 font-semibold rounded-lg px-2 py-1 transition ${
                        idx === folderHistory.length - 1
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      <Folder className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[150px] sm:max-w-xs">{crumb.name}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Direct Drive Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
                >
                  <FolderUp className="h-3.5 w-3.5" />
                  <span>Subir Archivos</span>
                </button>

                <a
                  href={`https://drive.google.com/drive/folders/${activeFolderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <FolderUp className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Abrir en Google Drive</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Banner with Company Information & Quick Upload */}
            <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 text-white shadow-lg shadow-blue-900/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-xs">
                      <Cloud className="h-3.5 w-3.5" /> Google Drive en vivo
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-medium text-emerald-200 backdrop-blur-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Sincronización instantánea
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-400/20 px-2.5 py-0.5 text-xs font-medium text-blue-200 backdrop-blur-xs">
                      <HardDrive className="h-3.5 w-3.5" /> 0 MB Servidor Vercel
                    </span>
                  </div>
                  <h2 className="text-xl font-black sm:text-2xl">{currentFolderDisplayName}</h2>
                  <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
                    {currentCompany.description ||
                      'Repositorio institucional de archivos, normativas, capacitaciones y videos.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 hover:shadow-md"
                  >
                    <FolderUp className="h-4 w-4 text-blue-600" />
                    <span>Subir a esta carpeta</span>
                  </button>
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
                onRefresh={() => loadFiles(activeFolderId)}
                onOpenUpload={() => setIsUploadOpen(true)}
                isLoading={isLoading}
                fileCounts={fileCounts}
              />
            </div>

            {/* Content Section: Grid, List or Empty State */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Mostrando <strong>{filteredFiles.length}</strong> elemento(s) en esta carpeta
                </span>
                <button
                  onClick={() => loadFiles(activeFolderId)}
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  🔄 Sincronizar ahora
                </button>
              </div>

              {isLoading ? (
                <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-xs font-semibold text-slate-500">
                      Consultando Google Drive en vivo...
                    </span>
                  </div>
                </div>
              ) : files.length === 0 ? (
                /* Clean Empty State for New Folders */
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50 shadow-xs">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <FolderOpen className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Esta carpeta está vacía en Google Drive
                  </h3>
                  <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Aún no se han subido archivos a esta carpeta. Sube documentos, manuales o subcarpetas en Drive y aparecerán aquí automáticamente en tiempo real.
                  </p>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    <FolderUp className="h-4 w-4" />
                    <span>Subir Archivos a esta Carpeta</span>
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <FileGrid
                  files={filteredFiles}
                  onOpenFile={(file) => setSelectedFile(file)}
                  onOpenFolder={handleOpenFolder}
                />
              ) : (
                <FileList
                  files={filteredFiles}
                  onOpenFile={(file) => setSelectedFile(file)}
                  onOpenFolder={handleOpenFolder}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* File Preview Modal (Videos, PDFs, Docs) */}
      <FilePreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />

      {/* Upload Direct to Google Drive Modal (0 MB in Vercel) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        companyName={currentCompany.name}
        folderName={currentFolderDisplayName}
        folderId={activeFolderId}
        onSync={() => loadFiles(activeFolderId)}
      />
    </div>
  );
}
