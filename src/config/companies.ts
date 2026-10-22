import { Company } from '@/types';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  pin: 'admin2026',
  name: 'Administrador General GCG'
};

export const MAIN_DRIVE_PARENT_FOLDER = '1K2kfm7yuPp3Etcrg1TIhsrea-ZCJfMr1';

export const GCG_OFFICIAL_LOGO = 'https://i.pandape.com/PROD/atslogos/cf6b645a-4f13-4b46-804c-81a655f843ee_4.png';

export const SECTORS = [
  'Todos',
  'Educación & Minería',
  'Salud & Medicina',
  'Construcción & Inmobiliaria',
  'Automotriz & Inspección',
  'Legal & Jurídico',
  'Tecnología & Domótica',
  'Servicios & Inversiones'
];

// Todas las empresas vinculadas a sus IDs exactos de Google Drive, ordenadas alfabéticamente
export const COMPANIES: Company[] = [
  {
    id: 'act-gesserv',
    name: 'ACT GESTIONES Y SERVICIOS S.A.C. - ACT GESSERV S.A.C.',
    code: 'ACTGESSERV',
    folderId: '1JWQ_yCeXbXm3j_-HbiFc8ESrQ7gq4j2z',
    pin: 'gesserv2026',
    sector: 'Servicios & Inversiones',
    description: 'Gestiones integrales, asesoría empresarial y soporte corporativo',
    logoColor: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'alexmath',
    name: 'ALEXMATH E.I.R.L.',
    code: 'ALEXMATH',
    folderId: '1zRmOE-itA0nFgjc_xYGnFcJhsllLTyOF',
    pin: 'alexmath2026',
    sector: 'Educación & Minería',
    description: 'Servicios técnicos, formativos y comerciales especializados',
    logoColor: 'from-fuchsia-600 to-pink-600'
  },
  {
    id: 'auto-team',
    name: 'AUTO TEAM MOTORSPORT CUSTOM PERFORMANCE S.A.C.',
    code: 'AUTOTEAM',
    folderId: '138KTWn3luY_LKmBIXtth-lJ9pAEtrBBj',
    pin: 'autoteam2026',
    sector: 'Automotriz & Inspección',
    description: 'Motorsport, mantenimiento preventivo y custom performance',
    logoColor: 'from-red-600 to-neutral-900'
  },
  {
    id: 'san-diego',
    name: 'AUTOSERVICIO SAN DIEGO S.A.C.',
    code: 'SANDIEGO',
    folderId: '1JOcolFnuBg7UpP3l5QRhJ_3gDcKZbewE',
    pin: 'sandiego2026',
    sector: 'Automotriz & Inspección',
    description: 'Servicio mecánico automotriz, diagnóstico y mantenimiento integral',
    logoColor: 'from-blue-600 to-orange-500'
  },
  {
    id: 'magnum',
    name: 'CENTRO DE SALUD Y SERVICIOS MEDICOS MAGNUM E.I.R.L.',
    code: 'MAGNUM',
    folderId: '1qPs68CvQIEVjR0m6m9SqvDUEMHnHGiaW',
    pin: 'magnum2026',
    sector: 'Salud & Medicina',
    description: 'Atención médica especializada, salud ocupacional y diagnóstico',
    logoColor: 'from-teal-600 to-emerald-600'
  },
  {
    id: 'citv-transoceanica',
    name: 'CITV Transoceanica Chapi',
    code: 'CITVTRANS',
    folderId: '1qf1qASuqL-UVB-Tc7q4-pG813rC6TJab',
    pin: 'citv2026',
    sector: 'Automotriz & Inspección',
    description: 'Centro de Inspección Técnica Vehicular autorizada',
    logoColor: 'from-amber-600 to-yellow-600'
  },
  {
    id: 'colonia-proyectos',
    name: 'COLONIA PROYECTOS INTEGRALES SAC.',
    code: 'COLONIA',
    folderId: '1Nqv1VNMQtGwm5Uw7zoUDmFnOUZ_UkEM_',
    pin: 'colonia2026',
    sector: 'Construcción & Inmobiliaria',
    description: 'Consultoría, ingeniería, proyectos de infraestructura y ejecución',
    logoColor: 'from-orange-600 to-red-600'
  },
  {
    id: 'constructora-gainza',
    name: 'CONSTRUCTORA E INMOBILIARIA GAINZA Y ASOCIADOS S.A.C.',
    code: 'GAINZA',
    folderId: '1PTuADF27Fi95XG460tbGSpED7k2Jh7J4',
    pin: 'gainza2026',
    sector: 'Construcción & Inmobiliaria',
    description: 'Desarrollo inmobiliario, edificación civil y construcción moderna',
    logoColor: 'from-amber-700 to-orange-800'
  },
  {
    id: 'divino-nino',
    name: 'DIVINO NIÑO JESUS BENDICENOS S.R.L.',
    code: 'DIVINONINO',
    folderId: '1ZtFFiDIOyIVe2VVnZG23mmXX5w06fD3U',
    pin: 'divinonino2026',
    sector: 'Servicios & Inversiones',
    description: 'Comercialización, distribución mayorista y servicios corporativos',
    logoColor: 'from-sky-500 to-blue-700'
  },
  {
    id: 'domotronic',
    name: 'DOMOTRONIC SMART HOME S.A.C.',
    code: 'DOMOTRONIC',
    folderId: '15N6LxP_HHp4qx3-c1UpT77arWi9pyI5o',
    pin: 'domotronic2026',
    sector: 'Tecnología & Domótica',
    description: 'Automatización de edificios, domótica, seguridad y smart IoT',
    logoColor: 'from-indigo-600 to-violet-800'
  },
  {
    id: 'don-toribio',
    name: 'DON TORIBIO',
    code: 'DONTORIBIO',
    folderId: '1vdJdFIRQEN9MjgJJkuScDeZTVmZi-OoA',
    pin: 'toribio2026',
    sector: 'Servicios & Inversiones',
    description: 'Alimentos, gastronomía, eventos y provisión corporativa',
    logoColor: 'from-amber-600 to-red-700'
  },
  {
    id: 'edson-gainza',
    name: 'EDSON JOSE GAINZA CHAVEZ',
    code: 'EGAINZA',
    folderId: '1DeXoOVoqXkn2fcXPWvdHHFvd2uWewSlK',
    pin: 'egainza2026',
    sector: 'Servicios & Inversiones',
    description: 'Servicios profesionales, consultoría y representación',
    logoColor: 'from-slate-600 to-slate-900'
  },
  {
    id: 'edumin',
    name: 'EDUMIN - Escuela de Minería',
    code: 'EDUMIN',
    folderId: '177Kys9VArtLuE26QyK_FUKNeib5ajJ2A',
    pin: 'edumin2026',
    sector: 'Educación & Minería',
    description: 'Capacitaciones técnicas, seguridad minera y cursos especializados',
    logoColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 'ego-car-wash',
    name: 'EGO CAR WASH E.I.R.L.',
    code: 'EGOCARWASH',
    folderId: '1WN8R4g6swVZr96GPlWSIfyJY1v_1i0fv',
    pin: 'egocarwash2026',
    sector: 'Automotriz & Inspección',
    description: 'Lavado premium, detallado automotriz y estética vehicular',
    logoColor: 'from-blue-500 to-sky-600'
  },
  {
    id: 'estudio-gainza',
    name: 'ESTUDIO JURIDICO GAINZA, RODRIGUEZ, CASTRO, LOAYZA, ANDIA Y ABOGADOS ASOCIADOS S.A.C.',
    code: 'ESTUDIOGAINZA',
    folderId: '1BJDTM3Fj-V7RItjD0Z6itluboRLjVVLh',
    pin: 'juridico2026',
    sector: 'Legal & Jurídico',
    description: 'Asesoría jurídica corporativa, litigios y derecho empresarial',
    logoColor: 'from-amber-800 to-stone-900'
  },
  {
    id: 'fermat',
    name: 'FERMAT SERVICIOS GENERALES S.A.C.',
    code: 'FERMAT',
    folderId: '1BrO_bP77CRjf1cG9DR-EGHBLnr0t2F2m',
    pin: 'fermat2026',
    sector: 'Servicios & Inversiones',
    description: 'Mantenimiento integral, ingeniería aplicada y servicios generales',
    logoColor: 'from-teal-600 to-blue-800'
  },
  {
    id: 'gitoca',
    name: 'GITOCA S.R.L.',
    code: 'GITOCA',
    folderId: '11ey8wFJ-sIYgopkFKRJn5gpAZCXF5ntO',
    pin: 'gitoca2026',
    sector: 'Servicios & Inversiones',
    description: 'Gestión de operaciones, inversiones y proyectos corporativos',
    logoColor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'grs-constructores',
    name: 'GRS CONSTRUCTORES SAC',
    code: 'GRS',
    folderId: '1B9v25mPk7pQpnok52ytL_Zs8MGNxKQvQ',
    pin: 'grs2026',
    sector: 'Construcción & Inmobiliaria',
    description: 'Construcción civil pesada, obras industriales y remodelaciones',
    logoColor: 'from-amber-700 to-yellow-600'
  },
  {
    id: 'creesiendo',
    name: 'GRUPO CREESIENDO S.A.C.',
    code: 'CREESIENDO',
    folderId: '109RJ6EH0vokMFXNkii6t4h7iZUfaZAYM',
    pin: 'creesiendo2026',
    sector: 'Servicios & Inversiones',
    description: 'Crecimiento empresarial, incubación de negocios y consultoría',
    logoColor: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'santa-isabel',
    name: 'GRUPO SANTA ISABEL MULTISERVICIOS GENERALES S.A.C.',
    code: 'SANTAISABEL',
    folderId: '15NnMR9xvg4Y2hHyA40OO8OQTrde_1h2w',
    pin: 'santaisabel2026',
    sector: 'Servicios & Inversiones',
    description: 'Multiservicios corporativos, logística y abastecimiento',
    logoColor: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'avanza',
    name: 'INSTITUTO TÉCNICO AVANZA CORPORACION EDUCATIVA S.A.C.',
    code: 'AVANZA',
    folderId: '1vIfPQXNZ_jdKdnB80ApDhkatVKYmNpm6',
    pin: 'avanza2026',
    sector: 'Educación & Minería',
    description: 'Formación profesional técnica, carreras certificadas y talleres',
    logoColor: 'from-indigo-600 to-blue-700'
  },
  {
    id: 'panter',
    name: 'INVERSIONES Y SERVICIOS PANTER S.A.C.',
    code: 'PANTER',
    folderId: '1vF0ytlnq2uyw_5QNnlnEVLzb_7suR9yn',
    pin: 'panter2026',
    sector: 'Servicios & Inversiones',
    description: 'Gestión patrimonial, inversiones estratégicas y soporte comercial',
    logoColor: 'from-zinc-700 to-black'
  },
  {
    id: 'wills',
    name: 'INVERSIONES WILLS S.A.C.',
    code: 'WILLS',
    folderId: '1dROwhtuZwdR-QTLQToAKnnrUtvbcCZIT',
    pin: 'wills2026',
    sector: 'Servicios & Inversiones',
    description: 'Desarrollo de proyectos comerciales e inversión de capital',
    logoColor: 'from-emerald-600 to-cyan-700'
  },
  {
    id: 'ccapua',
    name: 'MULTISERVICIOS CCAPUA S.A.C. - CCAPUA S.A.C.',
    code: 'CCAPUA',
    folderId: '1P5gf6-xx69vM2oEEUpx690QmPxEOZhg6',
    pin: 'ccapua2026',
    sector: 'Servicios & Inversiones',
    description: 'Operaciones múltiples, mantenimiento y servicios a la industria',
    logoColor: 'from-orange-500 to-amber-700'
  },
  {
    id: 'santissimo-corazon',
    name: 'POLICLINICO SANTISIMO SAGRADO CORAZON DE JESUS S.A.C.',
    code: 'SANTISIMO',
    folderId: '14iNgMm7bNxXi4xXVpGEOnXndlde6WfA5',
    pin: 'santissimo2026',
    sector: 'Salud & Medicina',
    description: 'Policlínico de salud integral, consultas médicas y laboratorio clínico',
    logoColor: 'from-rose-600 to-pink-700'
  },
  {
    id: 'coaguila',
    name: 'SERVICIOS E INVERSIONES COAGUILA Y ASOCIADOS S.A.C.',
    code: 'COAGUILA',
    folderId: '1uNEY_UxlQKTEFlUmoLz6ojDomuwz-Lua',
    pin: 'coaguila2026',
    sector: 'Servicios & Inversiones',
    description: 'Asesoría empresarial, gestión de inversiones y servicios técnicos',
    logoColor: 'from-indigo-600 to-teal-600'
  },
  {
    id: 'rutas-andinas',
    name: 'SERVICIOS E INVERSIONES RUTAS ANDINAS S.A.C',
    code: 'RUTASANDINAS',
    folderId: '1Nl2DLNGupq-22AAm3zH-nPI-kCs59Bwz',
    pin: 'rutas2026',
    sector: 'Automotriz & Inspección',
    description: 'Transporte de carga, logística regional e inversiones de flota',
    logoColor: 'from-amber-600 to-stone-800'
  },
  {
    id: 'texao',
    name: 'SERVICIOS E INVERSIONES TEXAO AREQUIPA S.A.C',
    code: 'TEXAO',
    folderId: '1KSy1JB0nAASiIFPfBxf3kBBADqg-3zlt',
    pin: 'texao2026',
    sector: 'Servicios & Inversiones',
    description: 'Servicios corporativos, proyectos comerciales y provisión local',
    logoColor: 'from-red-600 to-orange-600'
  },
  {
    id: 'gutierrez',
    name: 'SERVICIOS GENERALES GUTIERREZ Y ASOCIADOS S.A.C.',
    code: 'GUTIERREZ',
    folderId: '1jb8ubJ9joKxjUXxbeJv5QBe11WozY6xt',
    pin: 'gutierrez2026',
    sector: 'Servicios & Inversiones',
    description: 'Contratistas generales, mantenimiento electromecánico y obras',
    logoColor: 'from-slate-700 to-blue-900'
  },
  {
    id: 'royal-class',
    name: 'SERVICIOS GENERALES E INVERSIONES ROYAL INTERNATIONAL CLASS S.A.C.',
    code: 'ROYALCLASS',
    folderId: '12-KE6bFuyssJoo_wt9N_FuCM7KA2_oFy',
    pin: 'royal2026',
    sector: 'Servicios & Inversiones',
    description: 'Servicios internacionales, hotelería, logística y protocolo',
    logoColor: 'from-yellow-600 to-amber-800'
  },
  {
    id: 'smart-reasons',
    name: 'SMART REASONS S.R.L.',
    code: 'SMARTREASONS',
    folderId: '106HNkklQeTCGfxI-4BoUcYTl_8jPS2p6',
    pin: 'smart2026',
    sector: 'Tecnología & Domótica',
    description: 'Desarrollo de software, consultoría digital e inteligencia de datos',
    logoColor: 'from-violet-600 to-purple-800'
  }
];

export function validateCompanyCredentials(
  identifier: string,
  pin: string
): { isValid: boolean; isAdmin: boolean; company?: Company } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPin = pin.trim();

  // Admin Check
  if (
    cleanId === ADMIN_CREDENTIALS.username.toLowerCase() &&
    cleanPin === ADMIN_CREDENTIALS.pin
  ) {
    return {
      isValid: true,
      isAdmin: true,
      company: COMPANIES[0]
    };
  }

  // Company Check
  const foundCompany = COMPANIES.find(
    (c) =>
      (c.id.toLowerCase() === cleanId ||
        c.code.toLowerCase() === cleanId ||
        c.name.toLowerCase().includes(cleanId)) &&
      c.pin.toLowerCase() === cleanPin.toLowerCase()
  );

  if (foundCompany) {
    return {
      isValid: true,
      isAdmin: false,
      company: foundCompany
    };
  }

  return { isValid: false, isAdmin: false };
}
