import { Company } from '@/types';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  pin: 'admin2026',
  name: 'Administrador General GCG'
};

export const COMPANIES: Company[] = [
  {
    id: 'edumin',
    name: 'EDUMIN - Escuela de Minería',
    code: 'EDUMIN',
    folderId: '1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg',
    pin: 'edumin2026',
    description: 'Capacitaciones, seguridad y minería',
    logoColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 'empresa-02',
    name: 'Empresa 02',
    code: 'EMP02',
    folderId: '1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg', // Reemplazar con su respectivo folder ID de Drive
    pin: 'emp022026',
    description: 'Gestión documental y archivos',
    logoColor: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'empresa-03',
    name: 'Empresa 03',
    code: 'EMP03',
    folderId: '1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg',
    pin: 'emp032026',
    description: 'Gestión documental y archivos',
    logoColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'empresa-04',
    name: 'Empresa 04',
    code: 'EMP04',
    folderId: '1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg',
    pin: 'emp042026',
    description: 'Gestión documental y archivos',
    logoColor: 'from-purple-500 to-violet-600'
  },
  {
    id: 'empresa-05',
    name: 'Empresa 05',
    code: 'EMP05',
    folderId: '1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg',
    pin: 'emp052026',
    description: 'Gestión documental y archivos',
    logoColor: 'from-rose-500 to-pink-600'
  }
];

export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id.toLowerCase() === id.toLowerCase() || c.code.toLowerCase() === id.toLowerCase());
}

export function validateCompanyCredentials(identifier: string, pin: string): { isValid: boolean; company?: Company; isAdmin: boolean } {
  // Check Admin first
  if (
    identifier.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
    pin.trim() === ADMIN_CREDENTIALS.pin
  ) {
    return {
      isValid: true,
      isAdmin: true,
      company: COMPANIES[0] // Defaults to EDUMIN for viewing, but admin can switch to any
    };
  }

  // Check Companies
  const company = COMPANIES.find(
    (c) =>
      c.id.toLowerCase() === identifier.trim().toLowerCase() ||
      c.code.toLowerCase() === identifier.trim().toLowerCase() ||
      c.name.toLowerCase().includes(identifier.trim().toLowerCase())
  );

  if (company && company.pin === pin.trim()) {
    return {
      isValid: true,
      isAdmin: false,
      company
    };
  }

  return { isValid: false, isAdmin: false };
}
