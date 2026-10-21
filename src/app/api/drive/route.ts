import { NextRequest, NextResponse } from 'next/server';
import { getFileCategory } from '@/lib/drive';
import { DriveFileItem } from '@/types';
import { MAIN_DRIVE_PARENT_FOLDER } from '@/config/companies';

interface CacheEntry {
  data: { files: DriveFileItem[]; detectedLogo: string | null };
  timestamp: number;
}

// In-memory cache to protect against Google rate limits and avoid any production crashes
const driveFolderCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 25000; // 25 seconds cache

// Helper function to scrape live files and subfolders from public embeddedfolderview
async function fetchLiveDriveFolder(
  folderId: string
): Promise<{ files: DriveFileItem[]; detectedLogo: string | null }> {
  try {
    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store'
    });

    if (!res.ok) return { files: [], detectedLogo: null };

    const html = await res.text();
    const files: DriveFileItem[] = [];

    // Split HTML by flip-entry div to guarantee 100% complete parsing per card
    const parts = html.split('<div class="flip-entry"');

    let detectedLogo: string | null = null;

    for (let i = 1; i < parts.length; i++) {
      const entryContent = parts[i];

      // Extract ID
      const idMatch = /id="entry-([^"]+)"/.exec(entryContent);
      if (!idMatch) continue;
      const fileId = idMatch[1];

      // Extract Title
      const titleMatch = /<div class="flip-entry-title">([^<]+)<\/div>/.exec(entryContent);
      const name = titleMatch ? titleMatch[1].trim() : 'Archivo';

      // Check if it's a folder
      const isFolder = entryContent.includes('drive-sprite-folder') || entryContent.includes('/drive/folders/');

      // Check if this file is a company logo
      if (!isFolder && /^logo\.(png|jpe?g|webp|svg)$/i.test(name)) {
        detectedLogo = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
      }

      // Extract Thumbnail if available
      const thumbMatch = /<div class="flip-entry-thumb"><img src="([^"]+)"/.exec(entryContent);
      const thumbnailLink = thumbMatch ? thumbMatch[1].replace(/&amp;/g, '&') : undefined;

      // Extract Last Modified
      const modifiedMatch = /<div class="flip-entry-last-modified"><div>([^<]+)<\/div>/.exec(entryContent);
      const modifiedTime = modifiedMatch ? modifiedMatch[1].trim() : undefined;

      const category = isFolder ? 'folder' : getFileCategory('', name);

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

    return { files, detectedLogo };
  } catch (error) {
    console.error('Error analizando carpeta en vivo de Drive:', error);
    return { files: [], detectedLogo: null };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetFolderId = searchParams.get('folderId') || MAIN_DRIVE_PARENT_FOLDER;
  const forceRefresh = searchParams.get('force') === 'true';

  // Check in-memory cache if not forcing refresh
  const now = Date.now();
  const cached = driveFolderCache.get(targetFolderId);

  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      source: 'cache-safe',
      folderId: targetFolderId,
      files: cached.data.files,
      detectedLogo: cached.data.detectedLogo
    });
  }

  // Fetch real-time files and subfolders from Google Drive
  const result = await fetchLiveDriveFolder(targetFolderId);

  // Store in cache
  driveFolderCache.set(targetFolderId, {
    data: result,
    timestamp: now
  });

  return NextResponse.json({
    success: true,
    source: 'google-drive-live',
    folderId: targetFolderId,
    files: result.files,
    detectedLogo: result.detectedLogo
  });
}
