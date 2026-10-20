import { NextRequest, NextResponse } from 'next/server';
import { EDUMIN_DEMO_FILES, getFileCategory } from '@/lib/drive';
import { DriveFileItem } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId') || '1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg';
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

  if (apiKey) {
    try {
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,size,iconLink,thumbnailLink,webViewLink,webContentLink,createdTime,modifiedTime)&pageSize=100&orderBy=folder,name&key=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 60 } });

      if (res.ok) {
        const data = await res.json();
        const files: DriveFileItem[] = (data.files || []).map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size ? parseInt(file.size, 10) : undefined,
          iconLink: file.iconLink,
          thumbnailLink: file.thumbnailLink,
          webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/preview`,
          webContentLink: file.webContentLink,
          createdTime: file.createdTime,
          modifiedTime: file.modifiedTime,
          fileCategory: getFileCategory(file.mimeType, file.name)
        }));

        return NextResponse.json({
          success: true,
          source: 'google-drive-api',
          folderId,
          files
        });
      }
    } catch (err) {
      console.error('Error fetching from Google Drive API:', err);
    }
  }

  // Fallback / Demo data mode (Active when no API key provided yet)
  return NextResponse.json({
    success: true,
    source: 'preloaded-catalog',
    folderId,
    apiKeyConfigured: Boolean(apiKey),
    files: EDUMIN_DEMO_FILES
  });
}
