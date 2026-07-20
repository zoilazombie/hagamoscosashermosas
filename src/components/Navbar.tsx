import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  User as UserIcon, 
  ShieldAlert, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { User, Notification } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: Notification[];
  onLogout: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onMarkNotificationsRead: () => void;
}

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  notifications,
  onLogout,
  onOpenAuthModal,
  onMarkNotificationsRead
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const toggleNotifMenu = () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu && unreadNotifs.length > 0) {
      onMarkNotificationsRead();
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => handleTabClick('feed')}
              className="flex items-center space-x-2 text-emerald-600 font-bold text-xl tracking-tight transition duration-150 cursor-pointer"
              id="navbar-logo-btn"
            >
              <Heart className="h-6 w-6 text-emerald-500 fill-emerald-500 animate-pulse" />
              <span className="font-black text-lg tracking-wider text-gray-950">HAGAMOS COSAS HERMOSAS</span>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleTabClick('feed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              id="nav-feed-btn"
            >
              Feed de Ayuda
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => handleTabClick('chat')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  id="nav-chat-btn"
                >
                  <MessageSquare className="h-4 w-4" />
                  Mensajes
                </button>

                {currentUser.isAdmin && (
                  <button
                    onClick={() => handleTabClick('admin')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    id="nav-admin-btn"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Panel Control
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={toggleNotifMenu}
                    className="p-2 text-gray-500 hover:text-emerald-600 rounded-full hover:bg-gray-100 transition relative cursor-pointer"
                    id="bell-notif-btn"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                    )}
                  </button>

                  {/* Notification Dropdown menu */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Notificaciones</span>
                        {unreadNotifs.length > 0 && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">
                            {unreadNotifs.length} nuevas
                          </span>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-400 text-sm">
                            No tienes notificaciones
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 transition text-xs ${!notif.read ? 'bg-emerald-50/30' : ''}`}>
                              <p className="text-gray-800 font-medium leading-relaxed">{notif.content}</p>
                              <div className="flex items-center gap-1 mt-1 text-gray-400 text-[10px]">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Widget */}
                <button
                  onClick={() => handleTabClick('profile')}
                  className={`flex items-center space-x-2 p-1 rounded-full border transition cursor-pointer ${
                    activeTab === 'profile'
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                  id="navbar-profile-avatar-btn"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 pr-2 hidden lg:inline-block">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  {currentUser.isVerified && (
                    <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                  )}
                </button>

                {/* Log out */}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Cerrar Sesión"
                  id="navbar-logout-btn"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition cursor-pointer"
                  id="navbar-login-modal-btn"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs cursor-pointer"
                  id="navbar-register-modal-btn"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none"
              id="navbar-mobile-toggle-btn"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 space-y-1">
          <button
            onClick={() => handleTabClick('feed')}
            className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium ${
              activeTab === 'feed'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            id="mobile-nav-feed-btn"
          >
            Feed de Ayuda
          </button>

          {currentUser ? (
            <>
              <button
                onClick={() => handleTabClick('chat')}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium flex items-center gap-2 ${
                  activeTab === 'chat'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                id="mobile-nav-chat-btn"
              >
                <MessageSquare className="h-5 w-5" />
                Mensajes
              </button>

              <button
                onClick={() => handleTabClick('profile')}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                id="mobile-nav-profile-btn"
              >
                <UserIcon className="h-5 w-5" />
                Mi Perfil
              </button>

              {currentUser.isAdmin && (
                <button
                  onClick={() => handleTabClick('admin')}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium flex items-center gap-2 ${
                    activeTab === 'admin'
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  id="mobile-nav-admin-btn"
                >
                  <ShieldAlert className="h-5 w-5" />
                  Panel Control
                </button>
              )}

              <hr className="border-gray-100 my-2" />

              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                id="mobile-nav-logout-btn"
              >
                <LogOut className="h-5 w-5" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => {
                  onOpenAuthModal('login');
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition text-sm"
                id="mobile-nav-login-btn"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  onOpenAuthModal('register');
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-medium transition text-sm"
                id="mobile-nav-register-btn"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
