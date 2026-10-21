import { NextRequest, NextResponse } from 'next/server';
import { validateCompanyCredentials, COMPANIES } from '@/config/companies';
import { Company } from '@/types';

// Helper to fetch and parse credentials from a published Google Sheet CSV
async function validateWithGoogleSheet(
  identifier: string,
  pin: string
): Promise<{ isValid: boolean; isAdmin: boolean; company?: Company } | null> {
  const sheetUrl = process.env.USERS_SHEET_CSV_URL;
  if (!sheetUrl) return null;

  try {
    const res = await fetch(sheetUrl, { cache: 'no-store' });
    if (!res.ok) return null;

    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return null;

    // Headers format: Empresa, Usuario, PIN, Rol, Sector
    const cleanId = identifier.trim().toLowerCase();
    const cleanPin = pin.trim();

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      const [companyName, username, userPin, role] = parts;

      if (username && userPin) {
        if (username.toLowerCase() === cleanId && userPin === cleanPin) {
          const isAdmin = role?.toLowerCase() === 'admin';
          const matchedCompany =
            COMPANIES.find((c) =>
              c.name.toLowerCase().includes(companyName?.toLowerCase() || '') ||
              c.id.toLowerCase() === username.toLowerCase()
            ) || COMPANIES[0];

          return {
            isValid: true,
            isAdmin,
            company: matchedCompany
          };
        }
      }
    }
    return null;
  } catch (err) {
    console.error('Error consultando Google Sheet de usuarios:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, pin } = body;

    if (!identifier || !pin) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingrese usuario y PIN' },
        { status: 400 }
      );
    }

    // 1. Check Google Sheets if configured
    let authResult = await validateWithGoogleSheet(identifier, pin);

    // 2. Fallback to standard credentials
    if (!authResult) {
      authResult = validateCompanyCredentials(identifier, pin);
    }

    if (!authResult.isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas o empresa no encontrada' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      isAdmin: authResult.isAdmin,
      company: authResult.company,
      availableCompanies: authResult.isAdmin ? COMPANIES : undefined
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error procesando autenticación' },
      { status: 500 }
    );
  }
}
