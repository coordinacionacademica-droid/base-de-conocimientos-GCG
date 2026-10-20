'use client';

import React from 'react';
import { DriveFileItem } from '@/types';
import { formatFileSize } from '@/lib/drive';
import {
  FileText,
  Film,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  File,
  Eye,
  Download,
  Play
} from 'lucide-react';

interface FileGridProps {
  files: DriveFileItem[];
  onOpenFile: (file: DriveFileItem) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, onOpenFile }) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <File className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
          No se encontraron archivos
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Prueba cambiando el término de búsqueda o seleccionando otra categoría.
        </p>
      </div>
    );
  }

  const renderFileIcon = (file: DriveFileItem) => {
    switch (file.fileCategory) {
      case 'video':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/20 text-orange-600 dark:from-amber-950/30 dark:to-orange-950/40 dark:text-orange-400">
            <Film className="h-12 w-12 stroke-[1.5]" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg shadow-orange-600/40">
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </span>
            </div>
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              MP4
            </span>
          </div>
        );
      case 'pdf':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            <div className="flex flex-col items-center">
              <FileText className="h-12 w-12 stroke-[1.5]" />
            </div>
            <span className="absolute bottom-1.5 right-1.5 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              PDF
            </span>
          </div>
        );
      case 'spreadsheet':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <FileSpreadsheet className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              XLSX
            </span>
          </div>
        );
      case 'document':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <FileText className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              DOCX
            </span>
          </div>
        );
      case 'archive':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <FileArchive className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded bg-amber-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              ZIP
            </span>
          </div>
        );
      default:
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <FileCode className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded bg-slate-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              FILE
            </span>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onOpenFile(file)}
          className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
        >
          {/* File Thumbnail / Visual Graphic */}
          <div className="mb-2 w-full overflow-hidden rounded-lg">
            {renderFileIcon(file)}
          </div>

          {/* File Name & Metadata */}
          <div className="flex flex-1 flex-col justify-between">
            <p
              title={file.name}
              className="line-clamp-2 text-xs font-medium text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400"
            >
              {file.name}
            </p>
            <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
              <span>{formatFileSize(file.size)}</span>
              <span className="capitalize">{file.fileCategory}</span>
            </div>
          </div>

          {/* Hover Action Badges */}
          <div className="absolute right-2 top-2 hidden items-center gap-1 rounded-lg bg-white/95 p-1 shadow-md backdrop-blur-sm group-hover:flex dark:bg-slate-800/95">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenFile(file);
              }}
              title="Abrir / Ver"
              className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <a
              href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Descargar / Ver en Drive"
              className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
