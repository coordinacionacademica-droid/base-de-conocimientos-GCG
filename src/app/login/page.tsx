'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, KeyRound, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { COMPANIES, ADMIN_CREDENTIALS, GCG_OFFICIAL_LOGO } from '@/config/companies';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('edumin');
  const [pin, setPin] = useState('edumin2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, pin })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          'gcg_session',
          JSON.stringify({
            company: data.company,
            isAdmin: data.isAdmin
          })
        );
        router.push('/');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const setFastCredentials = (user: string, passwordPin: string) => {
    setIdentifier(user);
    setPin(passwordPin);
    setError('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-xl shadow-blue-500/10 border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <img
              src={GCG_OFFICIAL_LOGO}
              alt="Grupo Corporativo GCG"
              className="h-full w-full object-contain"
            />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Portal de Empresas GCG
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Repositorio y explorador de archivos corporativo seguro
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Empresa o Usuario
              </label>
              <div className="relative mt-1.5">
                <input
                  type="text"
                  required
                  placeholder="Ej: edumin o admin"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                PIN o Contraseña
              </label>
              <div className="relative mt-1.5">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
            >
              {loading ? (
                <span>Ingresando...</span>
              ) : (
                <>
                  <span>Ingresar al Repositorio</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Helper Buttons */}
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3 w-3 text-amber-500" /> Accesos rápidos de prueba
            </span>
            <div className="mt-2.5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setFastCredentials('edumin', 'edumin2026')}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
              >
                <span>Acceso Empresa 1 (EDUMIN)</span>
                <span className="text-[10px] text-slate-400">PIN: edumin2026</span>
              </button>
              <button
                type="button"
                onClick={() => setFastCredentials('admin', 'admin2026')}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
              >
                <span>Acceso Administrador General</span>
                <span className="text-[10px] text-slate-400">PIN: admin2026</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400">
          Archivos sincronizados en tiempo real con Google Drive Institucional
        </p>
      </div>
    </div>
  );
}
