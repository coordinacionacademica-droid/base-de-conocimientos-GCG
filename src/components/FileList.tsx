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
  ExternalLink
} from 'lucide-react';

interface FileListProps {
  files: DriveFileItem[];
  onOpenFile: (file: DriveFileItem) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onOpenFile }) => {
  const getIcon = (category: DriveFileItem['fileCategory']) => {
    switch (category) {
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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Tamaño</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((file) => (
              <tr
                key={file.id}
                onClick={() => onOpenFile(file)}
                className="cursor-pointer transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2.5">
                    {getIcon(file.fileCategory)}
                    <span className="truncate max-w-xs sm:max-w-md">{file.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-slate-500 dark:text-slate-400">
                  {file.fileCategory}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenFile(file)}
                      title="Vista previa"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir en Google Drive"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
