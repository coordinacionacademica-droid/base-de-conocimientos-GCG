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
  Eye,
  Folder,
  FolderOpen,
  ArrowRight,
  ExternalLink,
  Download
} from 'lucide-react';

interface FileListProps {
  files: DriveFileItem[];
  onOpenFile: (file: DriveFileItem) => void;
  onOpenFolder?: (folder: DriveFileItem) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onOpenFile, onOpenFolder }) => {
  const getIcon = (category: DriveFileItem['fileCategory']) => {
    switch (category) {
      case 'folder':
        return <Folder className="h-4 w-4 text-amber-500 fill-amber-400/20" />;
      case 'video':
        return <Film className="h-4 w-4 text-orange-500" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-rose-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'archive':
        return <FileArchive className="h-4 w-4 text-amber-500" />;
      default:
        return <FileCode className="h-4 w-4 text-slate-500" />;
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
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Nombre del Archivo / Carpeta</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Tamaño</th>
              <th className="px-4 py-3 font-semibold">Modificación</th>
              <th className="px-5 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {files.map((file) => {
              const isFolder = file.fileCategory === 'folder';

              return (
                <tr
                  key={file.id}
                  onClick={() => handleClick(file)}
                  className={`group cursor-pointer transition ${
                    isFolder
                      ? 'hover:bg-amber-50/40 dark:hover:bg-amber-950/20'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      {getIcon(file.fileCategory)}
                      <span className={`truncate max-w-xs sm:max-w-md ${isFolder ? 'font-bold text-amber-700 dark:text-amber-400' : ''}`}>
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {isFolder ? (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        Carpeta
                      </span>
                    ) : (
                      <span className="capitalize text-slate-500 dark:text-slate-400">
                        {file.fileCategory}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                    {isFolder ? '—' : formatFileSize(file.size)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 dark:text-slate-500 text-[11px]">
                    {file.modifiedTime || 'En vivo'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isFolder ? (
                        <button
                          onClick={() => onOpenFolder && onOpenFolder(file)}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
                        >
                          <FolderOpen className="h-3.5 w-3.5" />
                          <span>Abrir</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onOpenFile(file)}
                            title="Vista previa"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a
                            href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Abrir en Google Drive"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
