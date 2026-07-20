import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  AlertTriangle, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  Trash2, 
  Flag, 
  Filter,
  Flame,
  Tag,
  Star,
  Clock,
  ExternalLink,
  ShieldAlert,
  Info,
  Heart
} from 'lucide-react';
import { Story, User, Category, Urgency } from '../types';

interface FeedProps {
  stories: Story[];
  currentUser: User | null;
  onVote: (storyId: string) => void;
  onResolve: (storyId: string) => void;
  onDelete: (storyId: string) => void;
  onOpenChatWith: (userId: string) => void;
  onSubmitReport: (storyId: string, reason: string) => void;
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: Category | '';
  setSelectedCategory: (c: Category | '') => void;
  selectedUrgency: Urgency | '';
  setSelectedUrgency: (u: Urgency | '') => void;
  filterResolved: boolean;
  setFilterResolved: (r: boolean) => void;
}

export default function Feed({
  stories,
  currentUser,
  onVote,
  onResolve,
  onDelete,
  onOpenChatWith,
  onSubmitReport,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedUrgency,
  setSelectedUrgency,
  filterResolved,
  setFilterResolved
}: FeedProps) {
  const [reportingStoryId, setReportingStoryId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [showRelevanceExplanation, setShowRelevanceExplanation] = useState<string | null>(null);

  const categories: { value: Category | ''; label: string; icon: string }[] = [
    { value: '', label: 'Todas las Categorías', icon: '📁' },
    { value: 'alimentos', label: 'Alimentos', icon: '🍎' },
    { value: 'salud', label: 'Salud', icon: '🩺' },
    { value: 'educacion', label: 'Educación', icon: '📚' },
    { value: 'tecnologia', label: 'Mano de Obra / Tec.', icon: '💻' },
    { value: 'transporte', label: 'Transporte', icon: '🚗' },
    { value: 'refugio', label: 'Refugio', icon: '🏠' },
    { value: 'compania', label: 'Acompañamiento', icon: '👥' },
    { value: 'otros', label: 'Otros', icon: '📦' },
  ];

  const urgencies: { value: Urgency | ''; label: string }[] = [
    { value: '', label: 'Cualquier Urgencia' },
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'critica', label: 'Crítica 🔥' },
  ];

  const getUrgencyBadge = (urgency: Urgency) => {
    switch (urgency) {
      case 'critica':
        return 'bg-rose-50 text-rose-700 border-rose-200 border text-xs font-bold px-2 py-1 rounded-md';
      case 'alta':
        return 'bg-amber-50 text-amber-700 border-amber-200 border text-xs font-medium px-2 py-1 rounded-md';
      case 'media':
        return 'bg-blue-50 text-blue-700 border-blue-200 border text-xs font-medium px-2 py-1 rounded-md';
      case 'baja':
        return 'bg-gray-50 text-gray-600 border-gray-200 border text-xs font-medium px-2 py-1 rounded-md';
    }
  };

  const getSupportTypeBadge = (supportType: string) => {
    return supportType === 'ofrece_ayuda'
      ? 'bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full'
      : 'bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full';
  };

  const handleOpenReport = (storyId: string) => {
    setReportingStoryId(storyId);
    setReportReason('');
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportingStoryId && reportReason.trim() !== '') {
      onSubmitReport(reportingStoryId, reportReason);
      setReportingStoryId(null);
      setReportReason('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="feed-container">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Search & Filter Options */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-500" />
              Filtrar Causas
            </h3>

            {/* Text Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por palabra clave..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
                id="search-input"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>

            {/* Support Type Resolution Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Estado de la causa</label>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setFilterResolved(false)}
                  className={`text-xs py-1.5 font-semibold rounded-lg transition cursor-pointer ${
                    !filterResolved 
                      ? 'bg-white text-emerald-700 shadow-xs' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  id="toggle-pending-btn"
                >
                  Activas
                </button>
                <button
                  onClick={() => setFilterResolved(true)}
                  className={`text-xs py-1.5 font-semibold rounded-lg transition cursor-pointer ${
                    filterResolved 
                      ? 'bg-white text-emerald-700 shadow-xs' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  id="toggle-resolved-btn"
                >
                  Resueltas
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Categoría</label>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer ${
                      selectedCategory === cat.value
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    id={`cat-filter-${cat.value || 'all'}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Nivel de Urgencia</label>
              <div className="space-y-1">
                {urgencies.map((urg) => (
                  <button
                    key={urg.value}
                    onClick={() => setSelectedUrgency(urg.value)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer ${
                      selectedUrgency === urg.value
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    id={`urg-filter-${urg.value || 'all'}`}
                  >
                    <span>{selectedUrgency === urg.value ? '●' : '○'}</span>
                    <span>{urg.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Feed of stories */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 shadow-3xs" id="demo-disclaimer-banner">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <p className="font-bold text-amber-900 mb-0.5">💡 Entorno de Demostración</p>
              <p>Los perfiles iniciales de la plataforma (como <strong>Marta Díaz</strong>, <strong>Carlos Mendoza</strong> o <strong>Elena Gómez</strong>) son <strong>perfiles de ejemplo preestablecidos</strong> diseñados para mostrar el funcionamiento del feed de ayuda, el algoritmo de relevancia inteligente y el sistema de mensajería privada. Puedes registrar una nueva cuenta para publicar tus propias causas reales o interacciones.</p>
            </div>
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
            <span className="text-sm font-medium text-gray-500">
              Mostrando <strong className="text-gray-900">{stories.length}</strong> publicaciones ordenadas por <strong className="text-emerald-600">relevancia inteligente</strong>
            </span>
            <div className="relative group">
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-emerald-600 transition flex items-center gap-1 text-xs cursor-pointer"
                onClick={() => alert("Relevancia Algorítmica:\nEl orden de las causas se calcula dinámicamente mediante un algoritmo que premia:\n1. Nivel de Urgencia (Crítica +150, Alta +80, Media +30)\n2. Intereses / Votos de la comunidad (+15 por interés)\n3. Cuentas Verificadas (+40 puntos de confianza)\n4. Tiempo sin resolver (+2 puntos por hora transcurrida para evitar que queden en el olvido)")}
              >
                <Info className="h-4 w-4" />
                ¿Cómo funciona?
              </button>
            </div>
          </div>

          {stories.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Tag className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">No hay publicaciones</h4>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                No encontramos publicaciones que coincidan con los filtros seleccionados en este momento. Intenta cambiar los criterios de búsqueda.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {stories.map((story) => {
                const userVoted = currentUser && story.votedUserIds.includes(currentUser.id);
                return (
                  <div 
                    key={story.id} 
                    className={`bg-white rounded-2xl border transition duration-200 overflow-hidden relative shadow-2xs ${
                      story.resolved ? 'border-gray-200/60 opacity-85' : 'border-gray-100 hover:shadow-xs'
                    }`}
                    id={`story-card-${story.id}`}
                  >
                    
                    {/* Urgency Highlight Bar */}
                    <div className={`h-1 w-full ${
                      story.urgency === 'critica' ? 'bg-rose-500' :
                      story.urgency === 'alta' ? 'bg-amber-500' :
                      story.urgency === 'media' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />

                    <div className="p-6">
                      
                      {/* Header with profile info & badges */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <img
                            src={story.userAvatar}
                            alt={story.userName}
                            className="h-10 w-10 rounded-full object-cover border border-gray-100"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 text-sm">{story.userName}</span>
                              {story.userVerified && (
                                <span className="inline-flex items-center text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold border border-emerald-100 gap-0.5" title="Perfil Verificado">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                                  Verificado
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" />
                                {story.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Story Urgency and Type Badges */}
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={getSupportTypeBadge(story.supportType)}>
                            {story.supportType === 'ofrece_ayuda' ? 'Ofrece Ayuda' : 'Pide Ayuda'}
                          </span>
                          <span className={getUrgencyBadge(story.urgency)}>
                            {story.urgency.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-6">
                        
                        {story.image && (
                          <div className="md:col-span-2 overflow-hidden rounded-xl border border-gray-100">
                            <img
                              src={story.image}
                              alt={story.title}
                              className="h-48 w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className={story.image ? 'md:col-span-3' : 'md:col-span-5'}>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                              {story.category.toUpperCase()}
                            </span>
                            {story.resolved && (
                              <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 font-bold rounded-md border border-emerald-200">
                                ✓ RESUELTA
                              </span>
                            )}
                          </div>
                          
                          <h4 className="mt-2 text-lg font-extrabold text-gray-900 leading-snug">
                            {story.title}
                          </h4>
                          
                          <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-4">
                            {story.description}
                          </p>

                          {story.videoUrl && (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-black shadow-xs max-w-lg">
                              <div className="bg-emerald-50 px-3 py-1.5 flex items-center gap-2 border-b border-emerald-100">
                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Video de la historia</span>
                              </div>
                              <video 
                                src={story.videoUrl} 
                                controls 
                                className="w-full h-auto max-h-64 object-contain mx-auto"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer: interactions, votes, report, delete */}
                      <div className="mt-6 pt-5 border-t border-gray-50 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center space-x-3">
                          
                          {/* Vote / Support offer button */}
                          <button
                            onClick={() => onVote(story.id)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                              userVoted
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/60'
                            }`}
                            title={userVoted ? 'Quitar Me Gusta' : 'Dar Me Gusta'}
                            id={`vote-btn-${story.id}`}
                          >
                            <ThumbsUp className={`h-4 w-4 ${userVoted ? 'fill-white' : 'fill-none'}`} />
                            <span>Le gusta a {story.votesCount} {story.votesCount === 1 ? 'persona' : 'personas'}</span>
                          </button>

                          {/* "Quiero ayudar" direct button */}
                          {(!currentUser || currentUser.id !== story.userId) && (
                            <button
                              onClick={() => onOpenChatWith(story.userId)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition duration-150 cursor-pointer"
                              id={`help-direct-btn-${story.id}`}
                            >
                              <Heart className="h-4 w-4 fill-white" />
                              <span>Quiero ayudar</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          
                          {/* Resolve cause button (owner or admin) */}
                          {currentUser && (currentUser.id === story.userId || currentUser.isAdmin) && !story.resolved && (
                            <button
                              onClick={() => onResolve(story.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1 cursor-pointer"
                              id={`resolve-btn-${story.id}`}
                            >
                              ✓ Marcar Resuelta
                            </button>
                          )}

                          {/* Flag / Report Cause */}
                          {currentUser && currentUser.id !== story.userId && (
                            <button
                              onClick={() => handleOpenReport(story.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Reportar esta causa"
                              id={`report-btn-${story.id}`}
                            >
                              <Flag className="h-4.5 w-4.5" />
                            </button>
                          )}

                          {/* Delete story button (owner or admin) */}
                          {currentUser && (currentUser.id === story.userId || currentUser.isAdmin) && (
                            <button
                              onClick={() => onDelete(story.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Eliminar causa"
                              id={`delete-btn-${story.id}`}
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Inline Report Modal */}
      {reportingStoryId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                Reportar Publicación Inapropiada
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                La moderación de HAGAMOS COSAS HERMOSAS actúa rápidamente ante spam, fraude, insultos o faltas de respeto. Explica brevemente el motivo.
              </p>

              <form onSubmit={handleSendReport} className="mt-4 space-y-4">
                <div>
                  <textarea
                    required
                    rows={4}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Escribe el motivo del reporte detallando la situación..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReportingStoryId(null)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition cursor-pointer"
                  >
                    Enviar Reporte
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
