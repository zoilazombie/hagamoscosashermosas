import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCheck, 
  Clock, 
  Search, 
  User as UserIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Message, User } from '../types';

interface Conversation {
  partner: User;
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatBoxProps {
  currentUser: User;
  conversations: Conversation[];
  activePartnerId: string | null;
  onSelectPartner: (partnerId: string) => void;
  messages: Message[];
  onSendMessage: (receiverId: string, content: string) => void;
}

export default function ChatBox({
  currentUser,
  conversations,
  activePartnerId,
  onSelectPartner,
  messages,
  onSendMessage
}: ChatBoxProps) {
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.partner.id === activePartnerId);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePartnerId && content.trim() !== '') {
      onSendMessage(activePartnerId, content.trim());
      setContent('');
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="chat-workspace">
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 h-[600px]">
        
        {/* Left Side: Contact List / Conversations */}
        <div className="md:col-span-1 border-r border-gray-100 flex flex-col h-full bg-gray-50/50">
          
          {/* Header & Search */}
          <div className="p-4 bg-white border-b border-gray-100 space-y-3">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-500" />
              Mensajes Privados
            </h3>

            <div className="relative">
              <input
                type="text"
                placeholder="Buscar contacto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 transition"
                id="chat-search-input"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* Conversations Scroll view */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                {searchQuery ? 'Sin contactos coincidentes' : 'No tienes chats activos todavía. Escribe un mensaje desde el feed de ayuda.'}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.partner.id === activePartnerId;
                return (
                  <button
                    key={conv.partner.id}
                    onClick={() => onSelectPartner(conv.partner.id)}
                    className={`w-full text-left p-4 transition flex items-center gap-3 relative cursor-pointer ${
                      isActive ? 'bg-emerald-50/50 text-emerald-950 border-l-4 border-emerald-500' : 'bg-transparent hover:bg-gray-50'
                    }`}
                    id={`chat-partner-btn-${conv.partner.id}`}
                  >
                    <div className="relative">
                      <img
                        src={conv.partner.avatar}
                        alt={conv.partner.name}
                        className="h-10 w-10 rounded-full object-cover border border-gray-100"
                      />
                      {conv.partner.isVerified && (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs">
                          <CheckCircle className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-gray-900 text-xs truncate">{conv.partner.name}</h4>
                        {conv.lastMessage && (
                          <span className="text-[9px] text-gray-400 font-medium">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 truncate ${conv.unreadCount > 0 ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                        {conv.lastMessage ? conv.lastMessage.content : 'Inicia una conversación...'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 px-2 py-0.5 bg-rose-500 text-white font-bold text-[9px] rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Right Side: Active Chat Stream */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {activePartnerId && activeConv ? (
            <>
              {/* Partner profile header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConv.partner.avatar}
                    alt={activeConv.partner.name}
                    className="h-9 w-9 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1">
                      {activeConv.partner.name}
                      {activeConv.partner.isVerified && (
                        <CheckCircle className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                      )}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate max-w-sm">{activeConv.partner.bio}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-lg text-emerald-800 text-[10px] font-bold">
                  <span>Reputación: {activeConv.partner.reputation} ★</span>
                </div>
              </div>

              {/* Message Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/20">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6">
                    <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-xs">No hay mensajes. ¡Di hola para iniciar la coordinación!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                            isOwn
                              ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-2xs'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div className={`flex items-center gap-1 justify-end mt-1 text-[9px] ${isOwn ? 'text-emerald-100' : 'text-gray-400'}`}>
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isOwn && (
                              <CheckCheck className={`h-3 w-3 ${msg.read ? 'text-emerald-300' : 'text-emerald-100/50'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Inputs */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={`Escribe un mensaje de apoyo a ${activeConv.partner.name}...`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-500 transition"
                    id="chat-message-input"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs cursor-pointer"
                    id="chat-send-btn"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
                <div className="mt-2 flex items-center gap-1 text-[9px] text-gray-400">
                  <AlertCircle className="h-3 w-3 text-emerald-500" />
                  <span>Si el destinatario no está conectado, recibirá una alerta por correo electrónico.</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-gray-300" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Tu Centro de Mensajería</h4>
              <p className="mt-2 text-xs text-gray-500 max-w-sm">
                Selecciona una conversación de la barra lateral para coordinar el apoyo con otros colaboradores o personas necesitadas de forma privada y segura.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
