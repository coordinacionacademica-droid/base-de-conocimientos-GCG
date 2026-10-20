import { DriveFileItem } from '@/types';

export function getFileCategory(mimeType: string, fileName: string): DriveFileItem['fileCategory'] {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (mimeType.includes('video') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
    return 'video';
  }
  if (mimeType.includes('pdf') || ext === 'pdf') {
    return 'pdf';
  }
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    ['xlsx', 'xls', 'csv'].includes(ext)
  ) {
    return 'spreadsheet';
  }
  if (
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    ['pptx', 'ppt'].includes(ext)
  ) {
    return 'presentation';
  }
  if (
    mimeType.includes('document') ||
    mimeType.includes('word') ||
    mimeType.includes('text') ||
    ['docx', 'doc', 'txt', 'rtf'].includes(ext)
  ) {
    return 'document';
  }
  if (mimeType.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return 'image';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return 'archive';
  }

  return 'other';
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Fallback real files from EDUMIN folder (matches User Screenshot 2)
export const EDUMIN_DEMO_FILES: DriveFileItem[] = [
  {
    id: 'demo-doc-1',
    name: 'PREVENCION_DE_RIESGOS_EN_LA_MINERIA.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 2450000,
    fileCategory: 'document',
    modifiedTime: '2026-10-18T10:30:00Z',
    webViewLink: 'https://docs.google.com/document/d/1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg/edit'
  },
  {
    id: '1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN',
    name: 'video1_final.mp4',
    mimeType: 'video/mp4',
    size: 45200000,
    fileCategory: 'video',
    modifiedTime: '2026-10-19T14:15:00Z',
    webViewLink: 'https://drive.google.com/file/d/1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN/preview'
  },
  {
    id: 'demo-vid-2',
    name: 'hero-mineria_20261016105715.mp4',
    mimeType: 'video/mp4',
    size: 38400000,
    fileCategory: 'video',
    modifiedTime: '2026-10-16T10:57:15Z',
    webViewLink: 'https://drive.google.com/file/d/1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN/preview'
  },
  {
    id: 'demo-vid-3',
    name: 'VIDEO_2_LOGIN.mp4',
    mimeType: 'video/mp4',
    size: 19800000,
    fileCategory: 'video',
    modifiedTime: '2026-10-17T09:20:00Z',
    webViewLink: 'https://drive.google.com/file/d/1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN/preview'
  },
  {
    id: 'demo-vid-4',
    name: 'VIDEO_1_LOGIN.mp4',
    mimeType: 'video/mp4',
    size: 15400000,
    fileCategory: 'video',
    modifiedTime: '2026-10-17T09:10:00Z',
    webViewLink: 'https://drive.google.com/file/d/1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN/preview'
  },
  {
    id: 'demo-pdf-1',
    name: 'DIPLOMA.pdf',
    mimeType: 'application/pdf',
    size: 1850000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-15T16:00:00Z',
    webViewLink: 'https://drive.google.com/file/d/1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN/preview'
  },
  {
    id: 'demo-pdf-2',
    name: 'CERTIFICADO MODULAR.pdf',
    mimeType: 'application/pdf',
    size: 1420000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-15T16:05:00Z',
    webViewLink: 'https://drive.google.com/file/d/1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN/preview'
  },
  {
    id: 'demo-xls-1',
    name: 'Catalogo_Completo_EDUMIN_2026-10-13.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 890000,
    fileCategory: 'spreadsheet',
    modifiedTime: '2026-10-13T11:45:00Z',
    webViewLink: 'https://docs.google.com/spreadsheets/d/1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg/edit'
  },
  {
    id: 'demo-doc-2',
    name: 'GESTION ESTRATEGICA PARA EMPRESAS UTILIZANDO BI.pdf',
    mimeType: 'application/pdf',
    size: 3200000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-14T08:30:00Z',
    webViewLink: 'https://drive.google.com/file/d/1SowvNJFd9-taqzelPXuZ7P7lqu9Y08WN/preview'
  },
  {
    id: 'demo-pdf-3',
    name: 'YAQUELINE MAMANI.pdf',
    mimeType: 'application/pdf',
    size: 780000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-12T15:20:00Z'
  },
  {
    id: 'demo-pdf-4',
    name: 'YAJAIRA CONDOR.pdf',
    mimeType: 'application/pdf',
    size: 810000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-12T15:22:00Z'
  },
  {
    id: 'demo-doc-3',
    name: 'MARILYA NOVOA.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1100000,
    fileCategory: 'document',
    modifiedTime: '2026-10-12T15:25:00Z'
  },
  {
    id: 'demo-pdf-5',
    name: 'MARESTRELLA CALDERON.pdf',
    mimeType: 'application/pdf',
    size: 750000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-12T15:28:00Z'
  },
  {
    id: 'demo-doc-4',
    name: 'KEVIN RAMOS.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1350000,
    fileCategory: 'document',
    modifiedTime: '2026-10-12T15:30:00Z'
  },
  {
    id: 'demo-pdf-6',
    name: 'JESUS SILVA.pdf',
    mimeType: 'application/pdf',
    size: 890000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-12T15:32:00Z'
  },
  {
    id: 'demo-pdf-7',
    name: 'HENRY BORJA.pdf',
    mimeType: 'application/pdf',
    size: 920000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-12T15:35:00Z'
  },
  {
    id: 'demo-pdf-8',
    name: 'GUSTAVO VELASQUEZ.pdf',
    mimeType: 'application/pdf',
    size: 860000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-12T15:38:00Z'
  },
  {
    id: 'demo-doc-5',
    name: 'ERIC ALBURQUEQUE.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1400000,
    fileCategory: 'document',
    modifiedTime: '2026-10-12T15:40:00Z'
  },
  {
    id: 'demo-pdf-9',
    name: 'ANGELICA CUPE.pdf',
    mimeType: 'application/pdf',
    size: 790000,
    fileCategory: 'pdf',
    modifiedTime: '2026-10-12T15:42:00Z'
  },
  {
    id: 'demo-xls-2',
    name: 'Resultados_tarea.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 450000,
    fileCategory: 'spreadsheet',
    modifiedTime: '2026-10-11T12:00:00Z'
  },
  {
    id: 'demo-xls-3',
    name: 'Estructura_DIP_01.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 520000,
    fileCategory: 'spreadsheet',
    modifiedTime: '2026-10-10T14:30:00Z'
  }
];
