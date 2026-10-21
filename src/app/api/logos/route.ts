import { NextRequest, NextResponse } from 'next/server';
import { COMPANIES } from '@/config/companies';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// In-memory cache for discovered company logos (TTL: 1 hour)
let cachedLogos: Record<string, string> = {};
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function checkSingleCompanyLogo(folderId: string): Promise<string | null> {
  try {
    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const html = await res.text();
    const parts = html.split('<div class="flip-entry"');

    for (let i = 1; i < parts.length; i++) {
      const entryContent = parts[i];
      const isFolder = entryContent.includes('drive-sprite-folder') || entryContent.includes('/drive/folders/');
      if (isFolder) continue;

      const titleMatch = /<div class="flip-entry-title">([^<]+)<\/div>/.exec(entryContent);
      const idMatch = /id="entry-([^"]+)"/.exec(entryContent);

      if (titleMatch && idMatch) {
        const fileName = titleMatch[1].trim();
        if (/^logo\.(png|jpe?g|webp|svg)$/i.test(fileName)) {
          return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w400`;
        }
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';

  const now = Date.now();

  // Return from server cache if valid
  if (!force && Object.keys(cachedLogos).length > 0 && now - lastCacheTime < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      source: 'cache',
      logos: cachedLogos
    });
  }

  // Scan in chunks of 6 to respect rate limits
  const chunkSize = 6;
  const discovered: Record<string, string> = { ...cachedLogos };

  for (let i = 0; i < COMPANIES.length; i += chunkSize) {
    const chunk = COMPANIES.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map(async (company) => {
        const logoUrl = await checkSingleCompanyLogo(company.folderId);
        return { id: company.id, logoUrl };
      })
    );

    for (const res of results) {
      if (res.logoUrl) {
        discovered[res.id] = res.logoUrl;
      }
    }
  }

  cachedLogos = discovered;
  lastCacheTime = now;

  return NextResponse.json({
    success: true,
    source: 'live-scan',
    logos: discovered
  });
}
