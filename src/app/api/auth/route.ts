import { NextRequest, NextResponse } from 'next/server';
import { validateCompanyCredentials, COMPANIES } from '@/config/companies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, pin } = body;

    if (!identifier || !pin) {
      return NextResponse.json({ success: false, error: 'Por favor ingrese usuario y PIN' }, { status: 400 });
    }

    const authResult = validateCompanyCredentials(identifier, pin);

    if (!authResult.isValid) {
      return NextResponse.json({ success: false, error: 'Credenciales inválidas o empresa no encontrada' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      isAdmin: authResult.isAdmin,
      company: authResult.company,
      availableCompanies: authResult.isAdmin ? COMPANIES : undefined
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error procesando autenticación' }, { status: 500 });
  }
}
