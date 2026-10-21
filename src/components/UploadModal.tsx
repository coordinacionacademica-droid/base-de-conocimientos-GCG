'use client';

import React, { useState, useRef } from 'react';
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
  Folder,
  Upload,
  FileText,
  AlertCircle,
  Code
} from 'lucide-react';
import { formatFileSize } from '@/lib/drive';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [setupGuideOpen, setSetupGuideOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(folderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDirectUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress('Transmitiendo archivo directamente a Google Drive...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folderId', folderId);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        setUploadSuccess(true);
        setUploadProgress('¡Archivo guardado con éxito en Google Drive!');
        setSelectedFile(null);
        setTimeout(() => {
          onSync();
        }, 1000);
      } else if (data.setupNeeded) {
        setSetupGuideOpen(true);
        setUploadProgress('Requiere vincular Google Apps Script para subida interna o usar el botón directo de Drive.');
      } else {
        alert(data.error || 'Error al procesar la subida.');
      }
    } catch (err: any) {
      alert('Error de conexión al subir: ' + err.message);
    } finally {
      setIsUploading(false);
    }
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
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FolderUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                Subir a Google Drive Institucional
              </h3>
              <p className="text-[11px] text-slate-400">
                0 MB en Vercel • Almacenamiento 100% en la nube
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
                Carpeta Destino
              </span>
              <p className="truncate font-bold text-slate-900 dark:text-white">
                {companyName} / <span className="text-blue-600 dark:text-blue-400">{folderName}</span>
              </p>
            </div>
          </div>

          {/* Interactive In-App File Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-blue-500"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-xs transition group-hover:scale-105 dark:bg-slate-800 dark:text-blue-400">
              <Upload className="h-6 w-6" />
            </div>

            {selectedFile ? (
              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                  <FileText className="h-3.5 w-3.5" /> {selectedFile.name}
                </span>
                <p className="mt-1 text-[11px] text-slate-500">
                  {formatFileSize(selectedFile.size)} • Clic para cambiar archivo
                </p>
              </div>
            ) : (
              <>
                <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Arrastra tu archivo aquí o haz clic para seleccionarlo
                </h4>
                <p className="mt-1 text-[11px] text-slate-400">
                  PDFs, Word, Excel, Videos o imágenes (como <code className="text-blue-600 dark:text-blue-400 font-mono">logo.png</code>)
                </p>
              </>
            )}
          </div>

          {/* Action to Upload File */}
          {selectedFile && (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDirectUpload}
                disabled={isUploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Subiendo a Google Drive...</span>
                  </>
                ) : (
                  <>
                    <FolderUp className="h-4 w-4" />
                    <span>Subir {selectedFile.name} ahora</span>
                  </>
                )}
              </button>

              {uploadProgress && (
                <p className="text-center text-xs font-medium text-blue-600 dark:text-blue-400">
                  {uploadProgress}
                </p>
              )}
            </div>
          )}

          {/* Direct Drive Option (Alternative for multiple or heavy files) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  ¿Subir múltiples archivos o carpetas pesadas?
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Abre la carpeta en Drive para arrastrar carpetas enteras de gigabytes.
                </p>
              </div>
              <a
                href={folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-100 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-200"
              >
                <span>Abrir en Drive</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Zero Server Storage Notice */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50/70 p-3.5 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-[11px] leading-relaxed">
              <strong>Garantía 0 MB en Servidor:</strong> Todo se guarda en tu Google Drive corporativo. Vercel no retiene ningún archivo en disco, manteniendo el portal ligero y sin cobros de almacenamiento.
            </p>
          </div>

          {/* Quick Copy Link Bar */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
            <span className="truncate pr-2 font-mono text-[10px] text-slate-500">
              {folderUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200"
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
