'use client';

import React, { useState } from 'react';
import {
  X,
  FolderUp,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  HardDrive,
  Sparkles,
  RefreshCw,
  Folder
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  folderName: string;
  folderId: string;
  onSync: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  companyName,
  folderName,
  folderId,
  onSync
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(folderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    onSync();
    setTimeout(() => {
      setIsSyncing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FolderUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                Subir Archivos a Google Drive
              </h3>
              <p className="text-[11px] text-slate-400">
                Almacenamiento directo • 0 MB en Vercel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 p-6">
          {/* Target Folder Pill */}
          <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs dark:border-blue-900/40 dark:bg-blue-950/30">
            <Folder className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="overflow-hidden">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Destino de carga
              </span>
              <p className="truncate font-bold text-slate-900 dark:text-white">
                {companyName} / <span className="text-blue-600 dark:text-blue-400">{folderName}</span>
              </p>
            </div>
          </div>

          {/* Direct Drive Dropzone & CTA */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400">
              <Sparkles className="h-7 w-7" />
            </div>

            <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              Carga directa en Google Drive
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Arrastra tus archivos directamente a la carpeta de Drive o ábrela con un solo clic. Se sincronizarán en tiempo real en este portal.
            </p>

            <a
              href={folderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-lg"
            >
              <FolderUp className="h-4 w-4" />
              <span>Abrir Carpeta en Google Drive</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>

          {/* Zero Storage Explanation Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-start gap-2.5">
              <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">0 MB consumidos en servidor:</strong> Los videos, manuales y documentos subidos viajan directo a los servidores de Google Drive. Tu cuenta de Vercel solo procesa la visualización ligera.
              </div>
            </div>
          </div>

          {/* Quick Copy Link Bar */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
            <span className="truncate pr-2 font-mono text-[11px] text-slate-500">
              {folderUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/80">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Cerrar
          </button>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Ya los subí, Sincronizar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
