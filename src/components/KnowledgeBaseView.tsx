'use client';

import React, { useState, useMemo } from 'react';
import {
  KnowledgeArticle,
  KNOWLEDGE_ARTICLES,
  CORPORATE_QUICK_LINKS,
  QuickLink
} from '@/config/knowledgeBase';
import {
  BookOpen,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  CalendarCheck,
  HelpCircle,
  FileCheck,
  ArrowRight,
  Sparkles,
  Shield,
  Coins,
  Scale,
  Users
} from 'lucide-react';

interface KnowledgeBaseViewProps {
  companyName: string;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ companyName }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('solicitud-vacaciones');

  const categories = ['Todos', 'Recursos Humanos', 'Seguridad & SST', 'Finanzas & Viáticos'];

  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter((article) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      const matchesCat =
        selectedCategory === 'Todos' || article.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: Quick Tool Access (Solicitud de Vacaciones) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 p-6 sm:p-7 text-white shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold backdrop-blur-md">
                <CalendarCheck className="h-3.5 w-3.5" /> Trámites en Línea GCG
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/20 px-2.5 py-0.5 text-xs font-medium text-emerald-100 backdrop-blur-md">
                Activo para {companyName}
              </span>
            </div>
            <h3 className="text-xl font-black sm:text-2xl">
              Sistema Oficial de Solicitud de Vacaciones
            </h3>
            <p className="max-w-xl text-xs sm:text-sm text-emerald-50 leading-relaxed">
              Registra descansos laborales, permisos justificados y licencias oficiales directamente en la plataforma web institucional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://solicitudvacaciones-one.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-md transition hover:bg-slate-100 hover:shadow-lg"
            >
              <span>Abrir Solicitud de Vacaciones</span>
              <ExternalLink className="h-4 w-4 text-emerald-600" />
            </a>
          </div>
        </div>
      </div>

      {/* Header, Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              Manuales de Procedimientos y Políticas ({filteredArticles.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guías operativas paso a paso, normativas internas y respuestas a preguntas frecuentes.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en manuales y guías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => {
          const isExpanded = expandedArticleId === article.id;

          return (
            <div
              key={article.id}
              className={`overflow-hidden rounded-3xl border transition-all duration-200 ${
                isExpanded
                  ? 'border-blue-300 bg-white shadow-md dark:border-blue-900/60 dark:bg-slate-900'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/70'
              }`}
            >
              {/* Header Row */}
              <div
                onClick={() => toggleExpand(article.id)}
                className="flex cursor-pointer items-start justify-between gap-4 p-5 sm:p-6"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {article.category}
                      </span>
                      {article.badge && (
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {article.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 sm:p-6 dark:border-slate-800/80 space-y-6 bg-slate-50/40 dark:bg-slate-950/20">
                  {/* External Link Callout if available */}
                  {article.externalLink && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Trámite en Línea
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Accede a la plataforma web oficial para procesar este trámite.
                        </p>
                      </div>
                      <a
                        href={article.externalLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                      >
                        <span>{article.externalLink.label}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Requirements Checklist */}
                  {article.requirements && article.requirements.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Requisitos Previos
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {article.requirements.map((req, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 rounded-xl bg-white p-3 text-xs text-slate-700 border border-slate-200/70 shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                          >
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step-by-Step Procedure */}
                  {article.steps && article.steps.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Flujo Paso a Paso
                      </h5>
                      <div className="space-y-2.5">
                        {article.steps.map((st, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 rounded-2xl bg-white p-4 border border-slate-200/70 shadow-xs dark:bg-slate-900 dark:border-slate-800"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                              {i + 1}
                            </span>
                            <div className="space-y-0.5">
                              <h6 className="text-xs font-bold text-slate-900 dark:text-white">
                                {st.title}
                              </h6>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {st.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Frequently Asked Questions */}
                  {article.faqs && article.faqs.length > 0 && (
                    <div className="space-y-2.5">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Preguntas Frecuentes
                      </h5>
                      <div className="space-y-2">
                        {article.faqs.map((faq, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs"
                          >
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <HelpCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              {faq.q}
                            </p>
                            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed pl-5">
                              {faq.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
