'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  KnowledgeArticle,
  KNOWLEDGE_ARTICLES,
  AttachedDriveFile
} from '@/config/knowledgeBase';
import { Company, DriveFileItem } from '@/types';
import {
  BookOpen,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  CalendarCheck,
  Plus,
  Trash2,
  Paperclip,
  FileText,
  Video,
  FileSpreadsheet,
  X,
  Sparkles
} from 'lucide-react';

interface KnowledgeBaseViewProps {
  company: Company;
  driveFiles?: DriveFileItem[];
  onOpenFile?: (file: DriveFileItem) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  company,
  driveFiles = [],
  onOpenFile
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('solicitud-vacaciones');

  // Custom Protocols per company stored in localStorage
  const [customArticles, setCustomArticles] = useState<KnowledgeArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for creating a new protocol
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formNewCategoryInput, setFormNewCategoryInput] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [formSummary, setFormSummary] = useState('');
  const [formRequirements, setFormRequirements] = useState<string[]>(['']);
  const [formSteps, setFormSteps] = useState<{ title: string; description: string }[]>([
    { title: 'Paso 1: Inicio del trámite', description: '' }
  ]);
  const [selectedDriveFileIds, setSelectedDriveFileIds] = useState<string[]>([]);

  // 1. Load custom articles for this company on mount or company change
  useEffect(() => {
    try {
      const storageKey = `gcg_custom_protocols_${company.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCustomArticles(JSON.parse(saved));
      } else {
        setCustomArticles([]);
      }
    } catch (_) {
      setCustomArticles([]);
    }
  }, [company.id]);

  // Combine standard GCG articles with this company's custom articles
  const allArticles = useMemo(() => {
    return [...customArticles, ...KNOWLEDGE_ARTICLES];
  }, [customArticles]);

  // Compute all unique categories dynamically
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    set.add('Todos');
    set.add('Recursos Humanos');
    set.add('Seguridad & SST');
    set.add('Finanzas & Viáticos');
    set.add('Operaciones & Logística');
    allArticles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [allArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
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
  }, [allArticles, search, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  // Save new custom protocol
  const handleSaveProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const finalCategory = isCreatingNewCategory
      ? formNewCategoryInput.trim() || 'General'
      : formCategory || 'General';

    // Map selected drive files
    const attachedFiles: AttachedDriveFile[] = driveFiles
      .filter((f) => selectedDriveFileIds.includes(f.id))
      .map((f) => ({
        id: f.id,
        name: f.name,
        fileCategory: f.fileCategory,
        webViewLink: f.webViewLink,
        webContentLink: f.webContentLink
      }));

    const cleanRequirements = formRequirements.map((r) => r.trim()).filter(Boolean);
    const cleanSteps = formSteps.filter((s) => s.title.trim() || s.description.trim());

    const newArticle: KnowledgeArticle = {
      id: `custom-${Date.now()}`,
      title: formTitle.trim(),
      category: finalCategory,
      summary: formSummary.trim() || 'Protocolo operativo institucional configurado para el equipo.',
      badge: company.code,
      isCustom: true,
      companyId: company.id,
      createdAt: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
      attachedDriveFiles: attachedFiles,
      requirements: cleanRequirements.length > 0 ? cleanRequirements : undefined,
      steps: cleanSteps.length > 0 ? cleanSteps : undefined
    };

    const updated = [newArticle, ...customArticles];
    setCustomArticles(updated);

    try {
      localStorage.setItem(`gcg_custom_protocols_${company.id}`, JSON.stringify(updated));
    } catch (_) {}

    // Reset Form
    setFormTitle('');
    setFormCategory('');
    setFormNewCategoryInput('');
    setIsCreatingNewCategory(false);
    setFormSummary('');
    setFormRequirements(['']);
    setFormSteps([{ title: 'Paso 1: Inicio del trámite', description: '' }]);
    setSelectedDriveFileIds([]);
    setIsModalOpen(false);
    setExpandedArticleId(newArticle.id);
  };

  // Delete custom protocol
  const handleDeleteProtocol = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Deseas eliminar este protocolo personalizado?')) return;
    const updated = customArticles.filter((a) => a.id !== id);
    setCustomArticles(updated);
    try {
      localStorage.setItem(`gcg_custom_protocols_${company.id}`, JSON.stringify(updated));
    } catch (_) {}
  };

  // Toggle drive file attachment in modal
  const handleToggleFileSelect = (fileId: string) => {
    setSelectedDriveFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
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
                Activo para {company.name}
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

      {/* Header Row: Title + "Crear Nuevo Protocolo" Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              Manuales, Protocolos y Políticas ({filteredArticles.length})
            </h3>
            {customArticles.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                {customArticles.length} propios
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Crea tus propias categorías, pasos operativos y adjunta recursos de tu Google Drive.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setFormCategory(availableCategories.find((c) => c !== 'Todos') || 'Operaciones');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Nuevo Protocolo</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en protocolos, categorías o archivos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <span className="text-xs text-slate-400">
            Mostrando <strong>{filteredArticles.length}</strong> guías activas
          </span>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {availableCategories.map((cat) => {
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
        {filteredArticles.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <BookOpen className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              No se encontraron protocolos para esta búsqueda o categoría.
            </p>
            <button
              onClick={() => {
                setFormCategory(selectedCategory !== 'Todos' ? selectedCategory : 'Operaciones');
                setIsModalOpen(true);
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Crear protocolo en &quot;{selectedCategory}&quot;</span>
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => {
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
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        article.isCustom
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}
                    >
                      {article.isCustom ? <Sparkles className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {article.category}
                        </span>
                        {article.isCustom ? (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                            Protocolo Propio • {company.code}
                          </span>
                        ) : (
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            Corporativo GCG
                          </span>
                        )}
                        {article.attachedDriveFiles && article.attachedDriveFiles.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <Paperclip className="h-3 w-3" />
                            {article.attachedDriveFiles.length} {article.attachedDriveFiles.length === 1 ? 'recurso' : 'recursos'}
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

                  <div className="flex items-center gap-2">
                    {article.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteProtocol(article.id, e)}
                        title="Eliminar este protocolo"
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
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

                    {/* ATTACHED DRIVE FILES & RESOURCES SECTION */}
                    {article.attachedDriveFiles && article.attachedDriveFiles.length > 0 && (
                      <div className="space-y-2.5 rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                        <div className="flex items-center justify-between">
                          <h5 className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                            <Paperclip className="h-3.5 w-3.5" />
                            <span>Recursos y Archivos de Google Drive Vinculados ({article.attachedDriveFiles.length})</span>
                          </h5>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                            Disponibles para consulta y descarga
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {article.attachedDriveFiles.map((file) => {
                            // Find the full file from driveFiles if present
                            const matchedFile = driveFiles.find((f) => f.id === file.id);

                            return (
                              <div
                                key={file.id}
                                className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                    {file.fileCategory === 'video' ? (
                                      <Video className="h-4 w-4" />
                                    ) : file.fileCategory === 'spreadsheet' ? (
                                      <FileSpreadsheet className="h-4 w-4" />
                                    ) : (
                                      <FileText className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                                      {file.name}
                                    </p>
                                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                                      {file.fileCategory || 'Archivo'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {matchedFile && onOpenFile && (
                                    <button
                                      type="button"
                                      onClick={() => onOpenFile(matchedFile)}
                                      className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                                    >
                                      Ver
                                    </button>
                                  )}
                                  {file.webViewLink && (
                                    <a
                                      href={file.webViewLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Abrir en Google Drive"
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
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
                              className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                            >
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-xs">
                                {i + 1}
                              </div>
                              <div className="space-y-1">
                                <h6 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {st.title}
                                </h6>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {st.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQs if present */}
                    {article.faqs && article.faqs.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Preguntas Frecuentes
                        </h5>
                        <div className="space-y-2">
                          {article.faqs.map((faq, i) => (
                            <div
                              key={i}
                              className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                            >
                              <p className="font-bold text-slate-900 dark:text-white">
                                ¿{faq.q}?
                              </p>
                              <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
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
          })
        )}
      </div>

      {/* MODAL: CREAR NUEVO PROTOCOLO CON CATEGORÍA Y RECURSOS DE DRIVE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Crear Nuevo Protocolo / Manual
                  </h3>
                  <p className="text-xs text-slate-400">
                    Empresa: <strong>{company.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProtocol} className="mt-5 space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Título del Protocolo o Guía *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Protocolo de Seguridad en Operaciones y Uso de EPP"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Category Picker & Custom Category Option */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Categoría del Protocolo *
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {!isCreatingNewCategory ? (
                    <>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      >
                        {availableCategories
                          .filter((c) => c !== 'Todos')
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsCreatingNewCategory(true)}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>+ Crear Nueva Categoría</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex w-full items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nombre de la nueva categoría (Ej: Operaciones, Ventas, Control de Calidad)..."
                        value={formNewCategoryInput}
                        onChange={(e) => setFormNewCategoryInput(e.target.value)}
                        className="flex-1 rounded-xl border border-blue-400 bg-white p-2.5 text-xs text-slate-900 shadow-xs focus:outline-none dark:border-blue-600 dark:bg-slate-950 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCreatingNewCategory(false)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">
                  Resumen o Propósito del Protocolo
                </label>
                <textarea
                  rows={2}
                  placeholder="Explica brevemente para qué sirve este protocolo y a quiénes aplica..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* SELECT DRIVE FILES TO ATTACH */}
              <div className="space-y-2 rounded-2xl border border-blue-200/90 bg-blue-50/50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                      <Paperclip className="h-3.5 w-3.5" />
                      <span>Vincular Recursos de tu Google Drive ({selectedDriveFileIds.length} seleccionados)</span>
                    </label>
                    <p className="text-[11px] text-blue-700/80 dark:text-blue-400">
                      Selecciona qué archivos, manuales o videos de tu carpeta de Drive formarán parte de este protocolo.
                    </p>
                  </div>
                </div>

                {driveFiles.filter((f) => f.fileCategory !== 'folder').length === 0 ? (
                  <p className="rounded-xl bg-white/70 p-3 text-center text-xs text-slate-500 dark:bg-slate-900/70">
                    No hay archivos en la carpeta de Drive de esta empresa todavía. Puedes guardar el protocolo y vincularlos más tarde.
                  </p>
                ) : (
                  <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
                    {driveFiles
                      .filter((f) => f.fileCategory !== 'folder')
                      .map((f) => {
                        const isSelected = selectedDriveFileIds.includes(f.id);
                        return (
                          <div
                            key={f.id}
                            onClick={() => handleToggleFileSelect(f.id)}
                            className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl p-2.5 transition border ${
                              isSelected
                                ? 'border-blue-500 bg-blue-100/90 dark:border-blue-500 dark:bg-blue-900/50'
                                : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="h-4 w-4 rounded-sm text-blue-600"
                              />
                              <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                {f.name}
                              </span>
                            </div>
                            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              {f.fileCategory}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-200">
                    Requisitos Previos (Opcional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormRequirements((prev) => [...prev, ''])}
                    className="text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    + Agregar requisito
                  </button>
                </div>
                {formRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Requisito ${idx + 1}...`}
                      value={req}
                      onChange={(e) => {
                        const copy = [...formRequirements];
                        copy[idx] = e.target.value;
                        setFormRequirements(copy);
                      }}
                      className="flex-1 rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                    {formRequirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormRequirements((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-200">
                    Pasos Operativos del Protocolo
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormSteps((prev) => [
                        ...prev,
                        { title: `Paso ${prev.length + 1}: `, description: '' }
                      ])
                    }
                    className="text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    + Agregar paso
                  </button>
                </div>
                {formSteps.map((st, idx) => (
                  <div
                    key={idx}
                    className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder={`Título del Paso ${idx + 1}...`}
                        value={st.title}
                        onChange={(e) => {
                          const copy = [...formSteps];
                          copy[idx].title = e.target.value;
                          setFormSteps(copy);
                        }}
                        className="flex-1 rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                      {formSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormSteps((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="rounded-lg p-1 text-slate-400 hover:text-red-500"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      placeholder={`Descripción detallada del Paso ${idx + 1}...`}
                      value={st.description}
                      onChange={(e) => {
                        const copy = [...formSteps];
                        copy[idx].description = e.target.value;
                        setFormSteps(copy);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    />
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Publicar Protocolo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
