'use client';

import React from 'react';
import { DriveFileItem } from '@/types';
import { X, ExternalLink, Download, FileText, Film, FileSpreadsheet } from 'lucide-react';
import { formatFileSize } from '@/lib/drive';

interface FilePreviewModalProps {
  file: DriveFileItem | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  const isVideo = file.fileCategory === 'video';
  const isPdf = file.fileCategory === 'pdf';
  const previewUrl = file.webViewLink?.includes('/preview')
    ? file.webViewLink
    : `https://drive.google.com/file/d/${file.id}/preview`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-6">
          <div className="flex items-center gap-2.5 overflow-hidden pr-4">
            {isVideo ? (
              <Film className="h-5 w-5 text-orange-500 shrink-0" />
            ) : isPdf ? (
              <FileText className="h-5 w-5 text-rose-500 shrink-0" />
            ) : (
              <FileSpreadsheet className="h-5 w-5 text-emerald-500 shrink-0" />
            )}
            <div className="overflow-hidden">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                {file.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                {formatFileSize(file.size)} • {file.fileCategory.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://drive.google.com/file/d/${file.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Google Drive</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Preview Frame */}
        <div className="relative flex-1 bg-slate-950">
          <iframe
            src={previewUrl}
            title={file.name}
            className="h-full w-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/60 sm:px-6">
          <span className="text-[11px] text-slate-500">
            Alojado de forma segura en Google Drive (0 consumo de servidor)
          </span>
          <a
            href={file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Descargar Archivo</span>
          </a>
        </div>
      </div>
    </div>
  );
};
