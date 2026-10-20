import { NextRequest, NextResponse } from 'next/server';
import { getFileCategory } from '@/lib/drive';
import { DriveFileItem } from '@/types';

// Helper function to scrape live files from public embeddedfolderview
async function fetchLiveDriveFolder(folderId: string): Promise<DriveFileItem[]> {
  try {
    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store' // Always fetch fresh contents in real time
    });

    if (!res.ok) return [];

    const html = await res.text();
    const files: DriveFileItem[] = [];

    // Match all flip-entry divs
    const entryRegex = /<div class="flip-entry"[^>]*id="entry-([^"]+)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    let match;

    while ((match = entryRegex.exec(html)) !== null) {
      const fileId = match[1];
      const entryContent = match[2];

      // Extract Title
      const titleMatch = /<div class="flip-entry-title">([^<]+)<\/div>/.exec(entryContent);
      const name = titleMatch ? titleMatch[1].trim() : 'Archivo sin nombre';

      // Check if it's a folder
      const isFolder = entryContent.includes('drive-sprite-folder') || entryContent.includes('/drive/folders/');

      // Extract Thumbnail if available
      const thumbMatch = /<div class="flip-entry-thumb"><img src="([^"]+)"/.exec(entryContent);
      const thumbnailLink = thumbMatch ? thumbMatch[1].replace(/&amp;/g, '&') : undefined;

      // Extract Last Modified
      const modifiedMatch = /<div class="flip-entry-last-modified"><div>([^<]+)<\/div>/.exec(entryContent);
      const modifiedTime = modifiedMatch ? modifiedMatch[1].trim() : undefined;

      const category = isFolder ? 'other' : getFileCategory('', name);

      files.push({
        id: fileId,
        name,
        mimeType: isFolder ? 'application/vnd.google-apps.folder' : 'application/octet-stream',
        thumbnailLink,
        webViewLink: isFolder
          ? `https://drive.google.com/drive/folders/${fileId}`
          : `https://drive.google.com/file/d/${fileId}/preview`,
        webContentLink: `https://drive.google.com/uc?export=download&id=${fileId}`,
        modifiedTime,
        fileCategory: category
      });
    }

    return files;
  } catch (error) {
    console.error('Error al analizar carpeta en vivo de Drive:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId') || '177Kys9VArtLuE26QyK_FUKNeib5ajJ2A';
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;

  // 1. Try Google Drive API v3 if API Key is configured
  if (apiKey) {
    try {
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,size,iconLink,thumbnailLink,webViewLink,webContentLink,createdTime,modifiedTime)&pageSize=100&orderBy=folder,name&key=${apiKey}`;
      const res = await fetch(url, { cache: 'no-store' });

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
          source: 'google-drive-api-live',
          folderId,
          files
        });
      }
    } catch (err) {
      console.error('Error llamando a Google Drive API:', err);
    }
  }

  // 2. Fetch live real-time files directly from Google Drive public folder
  const liveFiles = await fetchLiveDriveFolder(folderId);

  // Return exactly what is in Google Drive in real time (even if 0 files)
  return NextResponse.json({
    success: true,
    source: 'google-drive-live',
    folderId,
    files: liveFiles
  });
}
