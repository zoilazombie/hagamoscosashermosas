import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Compass, 
  ArrowRight,
  Plus,
  AlertCircle,
  HelpCircle,
  Award,
  Users
} from 'lucide-react';
import { 
  User, 
  Story, 
  Message, 
  Report, 
  Notification, 
  Category, 
  Urgency, 
  SupportType, 
  SystemStats 
} from './types';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Feed from './components/Feed';
import StoryModal from './components/StoryModal';
import ProfileView from './components/ProfileView';
import ChatBox from './components/ChatBox';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('feed');
  
  const [stories, setStories] = useState<Story[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  
  // Admin Data
  const [reports, setReports] = useState<Report[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedUrgency, setSelectedUrgency] = useState<Urgency | ''>('');
  const [selectedSupportType, setSelectedSupportType] = useState<SupportType | null>(null);
  const [filterResolved, setFilterResolved] = useState(false);

  // Modals & Profile Viewing
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);

  // Authentication states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBio, setAuthBio] = useState('');
  const [authAge, setAuthAge] = useState('');
  const [authError, setAuthError] = useState('');

  // 1. Persisted Local Session Load
  useEffect(() => {
    const savedToken = localStorage.getItem('solidaria_token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    }
  }, []);

  // 2. Load stories on filter/search changes
  useEffect(() => {
    fetchStories();
  }, [search, selectedCategory, selectedUrgency, selectedSupportType, filterResolved]);

  // 3. Periodic Polling for notifications and active chat messages
  useEffect(() => {
    if (token && currentUser) {
      const interval = setInterval(() => {
        fetchNotifications();
        if (activeTab === 'chat') {
          fetchConversations();
          if (activePartnerId) {
            fetchChatMessages(activePartnerId);
          }
        }
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [token, currentUser, activeTab, activePartnerId]);

  // Fetch helper with auth header
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    } as any;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, { ...options, headers });
  };

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        // Refresh notifications
        const nRes = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (nRes.ok) {
          const nData = await nRes.json();
          setNotifications(nData);
        }
      } else {
        // Clear stale token
        handleLogout();
      }
    } catch (e) {
      console.error('Error fetching current user', e);
    }
  };

  const fetchStories = async () => {
    try {
      let url = `/api/stories?resolved=${filterResolved}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (selectedUrgency) url += `&urgency=${selectedUrgency}`;
      if (selectedSupportType) url += `&supportType=${selectedSupportType}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch (e) {
      console.error('Error fetching stories', e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await authFetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await authFetch('/api/chat/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChatMessages = async (partnerId: string) => {
    try {
      const res = await authFetch(`/api/chat/messages/${partnerId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminData = async () => {
    try {
      const rRes = await authFetch('/api/admin/reports');
      const uRes = await authFetch('/api/admin/users');
      const sRes = await authFetch('/api/admin/stats');

      if (rRes.ok) setReports(await rRes.json());
      if (uRes.ok) setUsersList(await uRes.json());
      if (sRes.ok) setSystemStats(await sRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Admin tab loading
  useEffect(() => {
    if (activeTab === 'admin' && currentUser?.isAdmin) {
      fetchAdminData();
    } else if (activeTab === 'chat') {
      fetchConversations();
    }
  }, [activeTab, currentUser]);

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const endpoint = showAuthModal === 'login' ? '/api/auth/login' : '/api/auth/register';
    
    if (showAuthModal === 'register') {
      const ageNum = Number(authAge);
      if (!authAge || isNaN(ageNum) || ageNum < 18) {
        setAuthError('Debes ser mayor de 18 años para unirte a la plataforma.');
        return;
      }
    }

    const payload = showAuthModal === 'login' 
      ? { email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword, name: authName, bio: authBio, age: Number(authAge) };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error('Failed to parse response as JSON:', text);
        setAuthError(`Error del servidor (${res.status}): No se recibió una respuesta válida.`);
        return;
      }

      if (res.ok) {
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('solidaria_token', data.token);
        setShowAuthModal(null);
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
        setAuthBio('');
        setAuthAge('');
        // Trigger initial actions
        fetchStories();
      } else {
        setAuthError(data.error || 'Ocurrió un error inesperado');
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
      setAuthError(`Fallo en la comunicación con el servidor: ${err.message || err}`);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('solidaria_token');
    setActiveTab('feed');
    setNotifications([]);
  };

  // Stories operations
  const handleCreateStory = async (storyData: any) => {
    try {
      const res = await authFetch('/api/stories', {
        method: 'POST',
        body: JSON.stringify(storyData)
      });

      if (res.ok) {
        setShowCreateModal(false);
        fetchStories();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'No se pudo crear la causa.');
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  const handleVote = async (storyId: string) => {
    if (!currentUser) {
      setShowAuthModal('login');
      return;
    }

    try {
      const res = await authFetch(`/api/stories/${storyId}/vote`, { method: 'POST' });
      if (res.ok) {
        fetchStories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (storyId: string) => {
    try {
      const res = await authFetch(`/api/stories/${storyId}/resolve`, { method: 'POST' });
      if (res.ok) {
        fetchStories();
        if (activeTab === 'admin') fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      const res = await authFetch(`/api/stories/${storyId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStories();
        if (activeTab === 'admin') fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReportStory = async (storyId: string, reason: string) => {
    try {
      const res = await authFetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify({ storyId, reason })
      });
      if (res.ok) {
        alert('Reporte enviado correctamente a moderación. Analizaremos el caso inmediatamente.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Chat actions
  const handleOpenChatWith = (userId: string) => {
    if (!currentUser) {
      setShowAuthModal('login');
      return;
    }
    setActivePartnerId(userId);
    setActiveTab('chat');
    fetchChatMessages(userId);
  };

  const handleSendMessage = async (receiverId: string, content: string) => {
    try {
      const res = await authFetch('/api/chat/messages', {
        method: 'POST',
        body: JSON.stringify({ receiverId, content })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setChatMessages(prev => [...prev, newMsg]);
        fetchConversations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await authFetch('/api/notifications/read-all', { method: 'POST' });
      // update state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  // Admin operations
  const handleResolveReport = async (reportId: string) => {
    try {
      const res = await authFetch(`/api/admin/reports/${reportId}/resolve`, { method: 'POST' });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleVerifyUser = async (userId: string) => {
    try {
      const res = await authFetch(`/api/admin/users/${userId}/verify`, { method: 'POST' });
      if (res.ok) {
        fetchAdminData();
        // If viewing profile, update it
        if (viewingProfileUser && viewingProfileUser.id === userId) {
          const updatedUser = await res.json();
          setViewingProfileUser(updatedUser);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (profileData: any) => {
    try {
      const res = await authFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        alert('Perfil actualizado con éxito');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRateReputation = async (rating: number) => {
    if (!viewingProfileUser) return;
    try {
      const res = await authFetch(`/api/users/${viewingProfileUser.id}/reputation`, {
        method: 'POST',
        body: JSON.stringify({ rating })
      });
      if (res.ok) {
        // reload viewing user
        const uRes = await fetch(`/api/users/${viewingProfileUser.id}`);
        if (uRes.ok) {
          const uData = await uRes.json();
          setViewingProfileUser(uData.user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick navigation to user profile clicking a user
  const handleViewProfileOf = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setViewingProfileUser(data.user);
        setActiveTab('profile');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Determine user to render in Profile tab
  const activeProfileUser = viewingProfileUser || currentUser;
  const filteredProfileStories = stories.filter(s => s.userId === activeProfileUser?.id);

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans" id="red-solidaria-app">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'profile') {
            setViewingProfileUser(null); // Reset when navigating away
          }
        }}
        notifications={notifications}
        onLogout={handleLogout}
        onOpenAuthModal={(mode) => setShowAuthModal(mode)}
        onMarkNotificationsRead={handleMarkNotificationsRead}
      />

      {/* Main Layout Body */}
      <main className="pb-16" id="app-main-content">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: FEED DE AYUDA */}
          {activeTab === 'feed' && (
            <motion.div
              key="feed-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Hero
                onFilterSupportType={(type) => setSelectedSupportType(type)}
                selectedSupportType={selectedSupportType}
                onOpenCreateStory={() => {
                  if (!currentUser) {
                    setShowAuthModal('login');
                  } else {
                    setShowCreateModal(true);
                  }
                }}
                isAuthenticated={!!currentUser}
              />

              <Feed
                stories={stories}
                currentUser={currentUser}
                onVote={handleVote}
                onResolve={handleResolve}
                onDelete={handleDeleteStory}
                onOpenChatWith={handleOpenChatWith}
                onSubmitReport={handleReportStory}
                search={search}
                setSearch={setSearch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedUrgency={selectedUrgency}
                setSelectedUrgency={setSelectedUrgency}
                filterResolved={filterResolved}
                setFilterResolved={setFilterResolved}
              />
            </motion.div>
          )}

          {/* TAB 2: CHAT PRIVATE WORKSPACE */}
          {activeTab === 'chat' && currentUser && (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ChatBox
                currentUser={currentUser}
                conversations={conversations}
                activePartnerId={activePartnerId}
                onSelectPartner={(pid) => {
                  setActivePartnerId(pid);
                  fetchChatMessages(pid);
                }}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </motion.div>
          )}

          {/* TAB 3: PROFILE SCREEN */}
          {activeTab === 'profile' && activeProfileUser && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="bg-emerald-950 py-4 border-b border-emerald-800 text-center text-xs font-semibold text-emerald-100">
                {viewingProfileUser ? (
                  <div className="flex justify-center items-center gap-2">
                    <span>Estás viendo el perfil de {viewingProfileUser.name}.</span>
                    <button 
                      onClick={() => setViewingProfileUser(null)} 
                      className="underline text-white hover:text-emerald-300 font-bold"
                    >
                      Volver a mi perfil
                    </button>
                  </div>
                ) : (
                  <span>Estás administrando tu perfil de colaborador de la comunidad.</span>
                )}
              </div>
              <ProfileView
                profileUser={activeProfileUser}
                profileStories={filteredProfileStories}
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onRateReputation={handleRateReputation}
                onDeleteStory={handleDeleteStory}
              />
            </motion.div>
          )}

          {/* TAB 4: ADMIN CONTROLS */}
          {activeTab === 'admin' && currentUser?.isAdmin && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AdminPanel
                currentUser={currentUser}
                reports={reports}
                usersList={usersList}
                onResolveReport={handleResolveReport}
                onToggleVerifyUser={handleToggleVerifyUser}
                onDeleteStory={handleDeleteStory}
                stats={systemStats}
                onRefreshStats={fetchAdminData}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* MODAL 1: AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-gray-100 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-emerald-600 fill-emerald-100" />
              </div>
              <h3 className="text-xl font-black text-gray-900">
                {showAuthModal === 'login' ? 'Iniciar Sesión' : 'Crea tu Cuenta'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {showAuthModal === 'login' 
                  ? 'Accede para publicar causas de ayuda o chatear con voluntarios' 
                  : 'Únete a HAGAMOS COSAS HERMOSAS para cooperar con tus vecinos.'}
              </p>
            </div>

            {authError && (
              <div className="mt-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="mt-5 space-y-4">
              
              {showAuthModal === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nombre Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ej. Juan Pérez"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 transition font-medium"
                      />
                      <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Preséntate brevemente</label>
                    <textarea
                      placeholder="Ej. Jubilado con ganas de enseñar matemáticas o ayudar con trámites..."
                      value={authBio}
                      onChange={(e) => setAuthBio(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Edad (Mínimo 18 años)</label>
                    <input
                      type="number"
                      required
                      min="18"
                      placeholder="Ej. 25"
                      value={authAge}
                      onChange={(e) => setAuthAge(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500 transition font-medium"
                      id="auth-age-input"
                    />
                    <p className="text-[9px] text-gray-400">Por seguridad, todos los perfiles deben ser de mayores de edad.</p>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Correo Electrónico</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 transition font-medium"
                    id="auth-email-input"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contraseña</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 transition font-medium"
                    id="auth-pass-input"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                id="auth-submit-btn"
              >
                <span>{showAuthModal === 'login' ? 'Ingresar a la Red' : 'Crear mi Cuenta'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  setAuthError('');
                  setShowAuthModal(showAuthModal === 'login' ? 'register' : 'login');
                }}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                {showAuthModal === 'login' 
                  ? '¿No tienes cuenta? Regístrate aquí' 
                  : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
              <br />
              <button
                onClick={() => setShowAuthModal(null)}
                className="text-xs text-gray-400 hover:text-gray-900 mt-2 transition font-medium"
              >
                Cerrar Ventana
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: STORY CREATION MODAL */}
      {showCreateModal && (
        <StoryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateStory}
        />
      )}

      {/* Clean elegant footer */}
      <footer className="border-t border-gray-100 bg-white py-8 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-bold text-emerald-600">HAGAMOS COSAS HERMOSAS - Plataforma de Apoyo Mutuo</p>
        </div>
      </footer>

    </div>
  );
}
