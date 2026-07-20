import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  AlertOctagon, 
  Check, 
  Trash2, 
  RefreshCw,
  Search,
  UserCheck
} from 'lucide-react';
import { Report, User, SystemStats } from '../types';

interface AdminPanelProps {
  currentUser: User;
  reports: Report[];
  usersList: User[];
  onResolveReport: (reportId: string) => void;
  onToggleVerifyUser: (userId: string) => void;
  onDeleteStory: (storyId: string) => void;
  stats: SystemStats | null;
  onRefreshStats: () => void;
}

export default function AdminPanel({
  currentUser,
  reports,
  usersList,
  onResolveReport,
  onToggleVerifyUser,
  onDeleteStory,
  stats,
  onRefreshStats
}: AdminPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'reports' | 'users'>('stats');
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-panel-workspace">
      
      {/* Header Banner */}
      <div className="bg-amber-950 border border-amber-800 rounded-3xl p-6 text-white relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-linear-to-r from-amber-900 to-amber-950 opacity-90 z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-800 border border-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider mb-2">
              <ShieldAlert className="h-3 w-3" />
              SISTEMA DE MODERACIÓN ACTIVO
            </div>
            <h2 className="text-2xl font-black">Panel de Administración General</h2>
            <p className="text-amber-200 text-xs mt-1">
              Hola, <strong className="text-white">{currentUser.name}</strong>. Desde aquí puedes verificar identidades de colaboradores, moderar reportes de contenido e inspeccionar métricas.
            </p>
          </div>

          <button
            onClick={onRefreshStats}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            id="admin-refresh-stats-btn"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* Internal Tabs Navigation */}
      <div className="flex border-b border-gray-100 mb-6 gap-2">
        <button
          onClick={() => setActiveAdminTab('stats')}
          className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeAdminTab === 'stats'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
          id="admin-tab-stats"
        >
          Métricas de Sistema
        </button>
        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition flex items-center gap-1 cursor-pointer ${
            activeAdminTab === 'reports'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
          id="admin-tab-reports"
        >
          <span>Reportes de Usuarios</span>
          {reports.filter(r => r.status === 'pendiente').length > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full font-bold">
              {reports.filter(r => r.status === 'pendiente').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeAdminTab === 'users'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
          id="admin-tab-users"
        >
          Verificación de Usuarios
        </button>
      </div>

      {/* TAB 1: METRICS & STATS */}
      {activeAdminTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-3">Miembros Registrados</span>
              <strong className="text-2xl font-black text-gray-900 block mt-1">{stats.totalUsers}</strong>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl w-fit">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-3">Causas Publicadas</span>
              <strong className="text-2xl font-black text-gray-900 block mt-1">{stats.totalStories}</strong>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl w-fit">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-3">Canales de Chat Activos</span>
              <strong className="text-2xl font-black text-gray-900 block mt-1">{stats.activeChats}</strong>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-3">Casos Resueltos exitosamente</span>
              <strong className="text-2xl font-black text-gray-900 block mt-1">{stats.resolvedStories}</strong>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
              <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl w-fit">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-3">Reportes Pendientes</span>
              <strong className="text-2xl font-black text-rose-600 block mt-1">{stats.pendingReports}</strong>
            </div>

          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Estado Operativo de la Comunidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p><strong>Nivel de Colaboración:</strong> {stats.totalStories > 0 ? ((stats.resolvedStories / stats.totalStories) * 100).toFixed(1) : 0}% de causas completadas con éxito.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p><strong>Salud del Contenido:</strong> {stats.pendingReports === 0 ? 'Excelente (0 denuncias pendientes)' : `Precaución (${stats.pendingReports} causas reportadas bajo evaluación)`}.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS LIST */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Informes de contenido inapropiado</h3>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No se han registrado reportes en el sistema.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 font-bold text-gray-500 uppercase">
                    <th className="p-4">Reportado Por</th>
                    <th className="p-4">Causa Denunciada</th>
                    <th className="p-4">Motivo / Razonamiento</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50/30">
                      <td className="p-4 font-semibold text-gray-900">{rep.reporterName}</td>
                      <td className="p-4 text-gray-800">
                        <strong className="block truncate max-w-xs">{rep.storyTitle}</strong>
                        <span className="text-[10px] text-gray-400">ID: {rep.storyId}</span>
                      </td>
                      <td className="p-4 text-gray-600 max-w-sm leading-relaxed">{rep.reason}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          rep.status === 'resuelto' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800 animate-pulse'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        {rep.status === 'pendiente' && (
                          <>
                            <button
                              onClick={() => onResolveReport(rep.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition cursor-pointer"
                              title="Desestimar reporte"
                            >
                              Aprobar / Resolver
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar permanentemente esta publicación denunciada?')) {
                                  onDeleteStory(rep.storyId);
                                  onResolveReport(rep.id);
                                }
                              }}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition inline-flex items-center"
                              title="Eliminar causa inapropiada"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER VERIFICATION */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Gestión de confianza y verificación</h3>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition"
                id="admin-user-search"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 font-bold text-gray-500 uppercase">
                  <th className="p-4">Miembro</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Reputación</th>
                  <th className="p-4">Denuncias contra él</th>
                  <th className="p-4">Verificado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/30">
                    <td className="p-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full object-cover border border-gray-100" />
                      <div>
                        <strong className="block text-gray-900">{u.name}</strong>
                        <span className="text-[9px] text-gray-400">ID: {u.id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4 font-bold text-gray-800">{u.reputation} ★</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.reportsCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {u.reportsCount} reportes
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-md">
                          ✓ SÍ
                        </span>
                      ) : (
                        <span className="text-gray-400 font-semibold">NO VERIFICADO</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onToggleVerifyUser(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          u.isVerified
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        id={`admin-verify-btn-${u.id}`}
                      >
                        {u.isVerified ? 'Revocar Verificación' : '✓ Verificar Identidad'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
