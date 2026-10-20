import { NextRequest, NextResponse } from 'next/server';
import { getFileCategory } from '@/lib/drive';
import { DriveFileItem } from '@/types';
import { MAIN_DRIVE_PARENT_FOLDER } from '@/config/companies';

// Helper function to scrape live files from public embeddedfolderview
async function fetchLiveDriveFolder(folderId: string): Promise<DriveFileItem[]> {
  try {
    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store' // Real-time: no stale cache
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
    console.error('Error analizando carpeta en vivo de Drive:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let targetFolderId = searchParams.get('folderId') || MAIN_DRIVE_PARENT_FOLDER;
  const companyName = searchParams.get('companyName') || '';
  const companyCode = searchParams.get('companyCode') || '';

  // Smart Discovery: If pointing to the parent Corporativo GCG folder, find the company's subfolder!
  if (targetFolderId === MAIN_DRIVE_PARENT_FOLDER && (companyName || companyCode)) {
    const parentEntries = await fetchLiveDriveFolder(MAIN_DRIVE_PARENT_FOLDER);
    const subfolder = parentEntries.find((entry) => {
      if (entry.mimeType !== 'application/vnd.google-apps.folder') return false;
      const cleanEntryName = entry.name.toLowerCase();
      return (
        (companyName && cleanEntryName.includes(companyName.toLowerCase().slice(0, 10))) ||
        (companyCode && cleanEntryName.includes(companyCode.toLowerCase()))
      );
    });

    if (subfolder) {
      targetFolderId = subfolder.id;
    }
  }

  // Fetch real-time files from the target folder
  const liveFiles = await fetchLiveDriveFolder(targetFolderId);

  return NextResponse.json({
    success: true,
    source: 'google-drive-live',
    folderId: targetFolderId,
    files: liveFiles
  });
}
