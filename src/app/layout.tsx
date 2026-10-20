import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portal de Empresas GCG - Repositorio Corporativo',
  description: 'Gestor y explorador seguro de archivos corporativos en la nube para empresas aliadas GCG',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
