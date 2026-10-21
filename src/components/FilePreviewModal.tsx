'use client';

import React, { useState } from 'react';
import { DriveFileItem } from '@/types';
import {
  X,
  ExternalLink,
  Download,
  FileText,
  Film,
  FileSpreadsheet,
  Copy,
  Check,
  Maximize2
} from 'lucide-react';
import { formatFileSize } from '@/lib/drive';

interface FilePreviewModalProps {
  file: DriveFileItem | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!file) return null;

  const isVideo = file.fileCategory === 'video';
  const isPdf = file.fileCategory === 'pdf';
  const previewUrl = file.webViewLink?.includes('/preview')
    ? file.webViewLink
    : `https://drive.google.com/file/d/${file.id}/preview`;

  const viewUrl = `https://drive.google.com/file/d/${file.id}/view`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(viewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-6">
          <div className="flex items-center gap-3 overflow-hidden pr-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              {isVideo ? (
                <Film className="h-5 w-5 text-orange-500" />
              ) : isPdf ? (
                <FileText className="h-5 w-5 text-rose-500" />
              ) : (
                <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                {file.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                {formatFileSize(file.size)} • {file.fileCategory.toUpperCase()} • Google Drive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy direct institutional link */}
            <button
              onClick={handleCopyLink}
              title="Copiar enlace directo institucional"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Copiar enlace</span>
                </>
              )}
            </button>

            {/* Open in Google Drive */}
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">Google Drive</span>
            </a>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
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
            Alojado directamente en Google Drive institucional • 0 MB consumidos en servidor
          </span>
          <div className="flex items-center gap-2">
            <a
              href={file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar Archivo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
