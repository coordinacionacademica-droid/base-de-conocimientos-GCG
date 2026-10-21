'use client';

import React, { useState } from 'react';
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
  Play,
  Folder,
  FolderOpen,
  Copy,
  Check,
  Star,
  Sparkles
} from 'lucide-react';

interface FileGridProps {
  files: DriveFileItem[];
  onOpenFile: (file: DriveFileItem) => void;
  onOpenFolder?: (folder: DriveFileItem) => void;
  onTogglePin?: (file: DriveFileItem) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  onOpenFile,
  onOpenFolder,
  onTogglePin
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent, file: DriveFileItem) => {
    e.stopPropagation();
    const link = `https://drive.google.com/file/d/${file.id}/view`;
    navigator.clipboard.writeText(link);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <File className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
          No se encontraron archivos en esta carpeta
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Esta carpeta aún no tiene archivos cargados o el término de búsqueda no coincide.
        </p>
      </div>
    );
  }

  const renderFileIcon = (file: DriveFileItem) => {
    const isLogo = /^logo\.(png|jpe?g|webp|svg)$/i.test(file.name);

    if (isLogo) {
      return (
        <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100/80 p-2 dark:from-indigo-950/40 dark:to-blue-900/40">
          {file.thumbnailLink ? (
            <img
              src={file.thumbnailLink}
              alt={file.name}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          ) : (
            <Sparkles className="h-10 w-10 text-indigo-600" />
          )}
          <span className="absolute bottom-1.5 right-1.5 rounded-md bg-indigo-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-xs">
            LOGO
          </span>
        </div>
      );
    }

    switch (file.fileCategory) {
      case 'folder':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/80 text-amber-600 transition group-hover:from-amber-100 group-hover:to-amber-200/90 dark:from-amber-950/30 dark:to-amber-900/40 dark:text-amber-400">
            <Folder className="h-12 w-12 fill-amber-400/30 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-amber-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              CARPETA
            </span>
          </div>
        );
      case 'video':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/80 text-orange-600 transition group-hover:from-orange-100 group-hover:to-orange-200/90 dark:from-orange-950/30 dark:to-orange-900/40 dark:text-orange-400">
            {file.thumbnailLink ? (
              <img
                src={file.thumbnailLink}
                alt={file.name}
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <Film className="h-12 w-12 stroke-[1.5]" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100 rounded-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-white shadow-md shadow-orange-600/40">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </span>
            </div>
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              VIDEO
            </span>
          </div>
        );
      case 'pdf':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-100/80 dark:bg-rose-950/30 dark:text-rose-400">
            <FileText className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              PDF
            </span>
          </div>
        );
      case 'spreadsheet':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:text-emerald-400">
            <FileSpreadsheet className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              EXCEL
            </span>
          </div>
        );
      case 'document':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100/80 dark:bg-blue-950/30 dark:text-blue-400">
            <FileText className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              WORD
            </span>
          </div>
        );
      case 'archive':
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-100/80 dark:bg-amber-950/30 dark:text-amber-400">
            <FileArchive className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-amber-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              ZIP
            </span>
          </div>
        );
      default:
        return (
          <div className="relative flex h-24 w-full items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition group-hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400">
            <FileCode className="h-12 w-12 stroke-[1.5]" />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-slate-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              DOC
            </span>
          </div>
        );
    }
  };

  const handleClick = (file: DriveFileItem) => {
    if (file.fileCategory === 'folder' && onOpenFolder) {
      onOpenFolder(file);
    } else {
      onOpenFile(file);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {files.map((file) => {
        const isFolder = file.fileCategory === 'folder';

        return (
          <div
            key={file.id}
            onClick={() => handleClick(file)}
            className={`group relative flex cursor-pointer flex-col justify-between rounded-3xl border p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              isFolder
                ? 'border-amber-200 bg-amber-50/20 hover:border-amber-400 dark:border-amber-900/40 dark:bg-slate-900'
                : file.isPinned
                ? 'border-amber-300 bg-amber-50/10 shadow-xs dark:border-amber-700/60'
                : 'border-slate-200/90 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700'
            }`}
          >
            {/* Visual Icon / Thumbnail */}
            <div className="mb-2.5 w-full overflow-hidden rounded-2xl">
              {renderFileIcon(file)}
            </div>

            {/* Title & Metadata */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start gap-1">
                {file.isPinned && (
                  <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" />
                )}
                <p
                  title={file.name}
                  className={`line-clamp-2 text-xs font-semibold leading-snug transition ${
                    isFolder
                      ? 'text-slate-900 group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-amber-400'
                      : 'text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400'
                  }`}
                >
                  {file.name}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800/80">
                {isFolder ? (
                  <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <FolderOpen className="h-3 w-3" /> Abrir carpeta
                  </span>
                ) : (
                  <span>{formatFileSize(file.size)}</span>
                )}
                {file.modifiedTime && <span>{file.modifiedTime}</span>}
              </div>
            </div>

            {/* Hover Actions Bar */}
            {!isFolder && (
              <div className="absolute right-2 top-2 hidden items-center gap-1 rounded-xl bg-white/95 p-1 shadow-md backdrop-blur-sm group-hover:flex dark:bg-slate-800/95">
                {/* Pin toggle */}
                {onTogglePin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(file);
                    }}
                    title={file.isPinned ? 'Desfijar de destacados' : 'Fijar en destacados'}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg transition ${
                      file.isPinned
                        ? 'text-amber-500'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${file.isPinned ? 'fill-amber-400' : ''}`}
                    />
                  </button>
                )}

                {/* Copy institutional link */}
                <button
                  onClick={(e) => handleCopyLink(e, file)}
                  title="Copiar enlace institucional"
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {copiedId === file.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Preview */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFile(file);
                  }}
                  title="Vista previa"
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>

                {/* Download */}
                <a
                  href={file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Descargar archivo"
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
