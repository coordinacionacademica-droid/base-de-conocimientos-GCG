# Portal de Empresas GCG - Repositorio Corporativo

Plataforma web moderna para la visualización, gestión y descarga segura de archivos corporativos en la nube para empresas aliadas de GCG, conectada directamente a Google Drive.

## 🚀 Características

- **Diseño Visual en Cuadrícula:** Idéntico a un explorador de archivos con iconos y badges para Word (.docx), Excel (.xlsx), PDF (.pdf) y Videos (.mp4).
- **Aislamiento por Empresa:** Cada empresa tiene su propio PIN/Contraseña y solo accede a su respectiva carpeta.
- **Acceso Administrador General:** Permite al administrador inspeccionar y alternar entre las 30 empresas desde un menú desplegable.
- **Cero Costo de Almacenamiento:** Todo se almacena en el Google Drive institucional (0 MB consumidos en servidor).
- **Reproductor y Visor Integrados:** Los videos y PDFs se pueden previsualizar sin salir del portal.
- **Buscador en Tiempo Real y Filtros:** Búsqueda instantánea por nombre y filtros rápidos por categoría (*Videos, Word, Excel, PDFs*).

---

## 🔑 Credenciales de Acceso Iniciales

| Rol / Empresa | Usuario | PIN / Contraseña | Carpeta Asignada |
| :--- | :--- | :--- | :--- |
| **Administrador General** | `admin` | `admin2026` | Acceso a todas las empresas |
| **Empresa 1 (EDUMIN)** | `edumin` | `edumin2026` | `1rF5kYtKJp63bKgOK9x6uFlHZx-75wffg` |
| **Empresa 2** | `emp02` | `emp022026` | Asignable en `src/config/companies.ts` |
| **Empresa 3** | `emp03` | `emp032026` | Asignable en `src/config/companies.ts` |

---

## ⚙️ Cómo agregar las 30 Empresas

Para registrar o cambiar las carpetas y accesos de las 30 empresas, edita el archivo:
📁 `src/config/companies.ts`

Ejemplo:
```typescript
{
  id: 'minera-andes',
  name: 'Minera Los Andes SAC',
  code: 'ANDES',
  folderId: 'ID_DE_SU_CARPETA_EN_GOOGLE_DRIVE',
  pin: 'andes2026',
  description: 'Contratos, certificaciones y seguridad'
}
```

---

## ☁️ Despliegue en Vercel (1 Clic)

1. Sube este repositorio a tu GitHub.
2. Entra a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **"Add New..."** > **Project**.
4. Selecciona el repositorio `base-de-conocimientos-GCG`.
5. Haz clic en **Deploy**. ¡Estará en línea en 30 segundos sin límites de compilación!

### Variable de Entorno Opcional en Vercel:
- `GOOGLE_DRIVE_API_KEY`: *(Opcional)* Si deseas sincronización directa con la API de Google Drive.
