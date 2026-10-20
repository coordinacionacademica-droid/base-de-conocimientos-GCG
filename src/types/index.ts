export interface Company {
  id: string;
  name: string;
  code: string;
  folderId: string;
  pin: string;
  sector?: string;
  description?: string;
  logoColor?: string;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  fileCategory: 'folder' | 'video' | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'archive' | 'other';
}

export interface UserSession {
  companyId: string;
  companyName: string;
  isAdmin: boolean;
  folderId: string;
}
