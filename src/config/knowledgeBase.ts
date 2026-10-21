export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'Recursos Humanos' | 'Seguridad & SST' | 'Finanzas & Viáticos' | 'Legal & Gobierno';
  summary: string;
  badge?: string;
  externalLink?: {
    label: string;
    url: string;
  };
  steps?: { title: string; description: string }[];
  faqs?: { q: string; a: string }[];
  requirements?: string[];
}

export interface QuickLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  iconName: string;
  badge?: string;
}

export const CORPORATE_QUICK_LINKS: QuickLink[] = [
  {
    id: 'vacaciones',
    title: 'Solicitud de Vacaciones y Permisos',
    description: 'Plataforma oficial para registrar y tramitar descansos laborales y permisos de colaboradores.',
    url: 'https://solicitudvacaciones-one.vercel.app/',
    category: 'Recursos Humanos',
    iconName: 'CalendarCheck',
    badge: 'Oficial GCG'
  },
  {
    id: 'drive-central',
    title: 'Carpeta Central Corporativo GCG',
    description: 'Acceso directo a la raíz institucional de Google Drive con todas las empresas.',
    url: 'https://drive.google.com/drive/folders/1K2kfm7yuPp3Etcrg1TIhsrea-ZCJfMr1',
    category: 'Almacenamiento',
    iconName: 'FolderUp',
    badge: 'Google Drive'
  }
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'solicitud-vacaciones',
    title: 'Procedimiento de Solicitud de Vacaciones y Permisos Laborales',
    category: 'Recursos Humanos',
    summary: 'Guía paso a paso para que los colaboradores de cualquiera de las empresas aliadas tramiten sus días de descanso vacacional o permisos justificados.',
    badge: 'Destacado RRHH',
    externalLink: {
      label: 'Abrir Plataforma de Solicitud de Vacaciones',
      url: 'https://solicitudvacaciones-one.vercel.app/'
    },
    requirements: [
      'Tener cumplido el récord vacacional anual o saldo de días pendientes.',
      'Contar con la coordinación previa con el jefe inmediato o responsable del área.',
      'Presentar la solicitud con un mínimo de 7 días de anticipación para vacaciones.'
    ],
    steps: [
      {
        title: 'Paso 1: Coordinación Previa',
        description: 'Verifica con tu jefatura directa las fechas propuestas para asegurar la continuidad operativa de la empresa.'
      },
      {
        title: 'Paso 2: Registro en la Plataforma Oficial',
        description: 'Ingresa a la plataforma oficial de Solicitud de Vacaciones de GCG (https://solicitudvacaciones-one.vercel.app/), selecciona tu empresa y completa los datos requeridos.'
      },
      {
        title: 'Paso 3: Validación y Aprobación',
        description: 'El área de administración o recursos humanos revisará el registro y validará los días disponibles en la planilla del mes.'
      },
      {
        title: 'Paso 4: Notificación y Goce Vacacional',
        description: 'Recibirás la confirmación formal por correo o notificación para iniciar tu periodo vacacional debidamente justificado.'
      }
    ],
    faqs: [
      {
        q: '¿Puedo solicitar vacaciones fraccionadas?',
        a: 'Sí, de acuerdo con la normativa laboral vigente y coordinación con la administración de tu empresa, siempre que los periodos cumplan con los mínimos legales.'
      },
      {
        q: '¿Qué pasa si tengo una emergencia médica o permiso imprevisto?',
        a: 'En casos imprevistos, notifica de inmediato a tu jefatura y regulariza la solicitud con el sustento médico o documento justificatorio en la plataforma.'
      }
    ]
  },
  {
    id: 'afiliacion-personal',
    title: 'Procedimiento de Alta y Afiliación de Nuevos Colaboradores',
    category: 'Recursos Humanos',
    summary: 'Requisitos y flujo de ingreso de personal para registro en T-Registro, contrato laboral y entrega de implementos.',
    badge: 'Obligatorio',
    requirements: [
      'DNI legible vigente o Carnet de Extranjería / PTP.',
      'Certificado de Antecedentes Policiales o Certiadulto.',
      'Currículum Vitae documentado y copia de recibo de servicio (luz/agua).',
      'Número de cuenta bancaria para pago de haberes.',
      'Examen Médico Ocupacional (EMO) apto según el perfil del puesto.'
    ],
    steps: [
      {
        title: 'Paso 1: Recepción de Expediente',
        description: 'El postulante o encargado entrega la carpeta completa de documentos requeridos al área administrativa.'
      },
      {
        title: 'Paso 2: Firma de Contrato y T-Registro',
        description: 'Emisión del contrato de trabajo y alta inmediata en SUNAT (T-Registro) antes del inicio efectivo de labores.'
      },
      {
        title: 'Paso 3: Inducción y Entrega de EPP',
        description: 'Capacitación en seguridad y salud en el trabajo, entrega de reglamento interno y equipos de protección personal (EPP).'
      }
    ],
    faqs: [
      {
        q: '¿Cuándo se entrega la copia del contrato al colaborador?',
        a: 'Dentro de los 3 días hábiles posteriores a la firma y registro correspondiente.'
      }
    ]
  },
  {
    id: 'seguridad-sst',
    title: 'Protocolo de Seguridad y Salud en el Trabajo (SST)',
    category: 'Seguridad & SST',
    summary: 'Normas y obligaciones generales en prevención de riesgos laborales, reporte de incidentes y uso obligatorio de EPP.',
    badge: 'Normativa',
    requirements: [
      'Uso obligatorio de EPP básico y específico en zonas de operación o talleres.',
      'Reporte inmediato de cualquier condición o acto subestándar.',
      'Participación en las 4 capacitaciones mínimas anuales de SST.'
    ],
    steps: [
      {
        title: 'Paso 1: Charla de Seguridad de 5 Minutos',
        description: 'Antes de iniciar cualquier labor de campo, taller o mantenimiento, se realiza la charla informativa y firma de asistencia.'
      },
      {
        title: 'Paso 2: Inspección Previa de Herramientas y Equipos',
        description: 'Verificación del buen estado de maquinarias, vehículos o herramientas antes de su operación.'
      },
      {
        title: 'Paso 3: Protocolo en Caso de Accidente o Incidente',
        description: 'Brindar primeros auxilios, paralizar labores en zona de riesgo y comunicar inmediatamente al supervisor de SST y gerencia.'
      }
    ],
    faqs: [
      {
        q: '¿A quién debo avisar en caso de un incidente menor?',
        a: 'A tu supervisor directo y al encargado de SST de la empresa para levantar el reporte preventivo.'
      }
    ]
  },
  {
    id: 'rendicion-viaticos',
    title: 'Procedimiento de Rendición de Gastos y Viáticos',
    category: 'Finanzas & Viáticos',
    summary: 'Directiva para la solicitud, uso y rendición documentada de fondos por comisiones de servicio, transporte y gastos operativos.',
    badge: 'Contabilidad',
    requirements: [
      'Comprobantes de pago autorizados (Factura con RUC de la empresa, Boletas válidas).',
      'Plazo máximo de rendición: 48 horas tras finalizar la comisión.',
      'Planilla de movilidad o declaración jurada en casos excepcionales autorizados.'
    ],
    steps: [
      {
        title: 'Paso 1: Solicitud y Asignación de Fondo',
        description: 'Aprobación del presupuesto estimado por gerencia o administración antes del viaje o comisión.'
      },
      {
        title: 'Paso 2: Consumo con Comprobantes Válidos',
        description: 'Solicitar comprobante electrónico a nombre de la empresa respectiva con RUC y detalle claro.'
      },
      {
        title: 'Paso 3: Presentación de Formato de Rendición',
        description: 'Llenar la hoja de liquidación con comprobantes numerados y entregar a contabilidad para el cierre de cuenta.'
      }
    ],
    faqs: [
      {
        q: '¿Qué ocurre si hay saldo a favor no gastado?',
        a: 'Debe ser devuelto mediante depósito o transferencia a la cuenta de la empresa junto con la rendición.'
      }
    ]
  }
];
