import React, { useState } from 'react';
import { 
  User as UserType, 
  Story 
} from '../types';
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle, 
  PenTool, 
  Camera, 
  Heart,
  Plus,
  Trash2
} from 'lucide-react';

interface ProfileViewProps {
  profileUser: UserType;
  profileStories: Story[];
  currentUser: UserType | null;
  onUpdateProfile: (data: { name: string; bio: string; skills: string[]; avatar?: string; age?: number }) => void;
  onRateReputation: (rating: number) => void;
  onDeleteStory?: (storyId: string) => void;
}

export default function ProfileView({
  profileUser,
  profileStories,
  currentUser,
  onUpdateProfile,
  onRateReputation,
  onDeleteStory
}: ProfileViewProps) {
  const isOwnProfile = currentUser && currentUser.id === profileUser.id;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profileUser.name);
  const [bio, setBio] = useState(profileUser.bio);
  const [skillsString, setSkillsString] = useState(profileUser.skills.join(', '));
  const [avatar, setAvatar] = useState(profileUser.avatar);
  const [age, setAge] = useState(profileUser.age ? String(profileUser.age) : '18');
  const [editError, setEditError] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [ratedSuccessfully, setRatedSuccessfully] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 18) {
      setEditError('Debes ser mayor de 18 años para actualizar tu perfil.');
      return;
    }
    const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s !== '');
    onUpdateProfile({
      name,
      bio,
      skills: skillsArray,
      avatar: avatar || undefined,
      age: ageNum
    });
    setIsEditing(false);
  };

  const handleRate = () => {
    onRateReputation(userRating);
    setRatedSuccessfully(true);
    setTimeout(() => setRatedSuccessfully(false), 3000);
  };

  // Base64 file uploader helper for profile picture
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert('La imagen de perfil no debe superar los 1.5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="profile-container">
      <div className="space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs relative overflow-hidden">
          
          {/* Ambient design banner */}
          <div className="absolute top-0 inset-x-0 h-32 bg-emerald-900/10" />

          <div className="relative pt-12 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            
            {/* Avatar block */}
            <div className="relative">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              {profileUser.isVerified && (
                <span className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-xs" title="Cuenta Verificada">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-500" />
                </span>
              )}
            </div>

            {/* Profile info block */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    {profileUser.name}
                    {profileUser.age && (
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200/50">({profileUser.age} años)</span>
                    )}
                    {profileUser.isAdmin && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-bold tracking-wider">MODERADOR</span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Miembro desde {new Date(profileUser.joinedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  {/* Reputation */}
                  <div className="flex flex-col items-center md:items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reputación</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4.5 w-4.5 ${
                              i < Math.round(profileUser.reputation) 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-gray-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <strong className="text-sm text-gray-800">{profileUser.reputation}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {profileUser.bio}
              </p>

              {/* Skills */}
              <div className="pt-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Habilidades / Herramientas de apoyo</span>
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {profileUser.skills.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">No ha ingresado habilidades de apoyo</span>
                  ) : (
                    profileUser.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Actions / Editing toggles */}
              <div className="pt-4 flex justify-center md:justify-start gap-3">
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-200 hover:border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    id="edit-profile-toggle-btn"
                  >
                    <PenTool className="h-3.5 w-3.5" />
                    Editar Perfil
                  </button>
                ) : (
                  currentUser && (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2 rounded-xl">
                      <span className="text-xs font-bold text-gray-500">Valorar reputación:</span>
                      <select
                        value={userRating}
                        onChange={(e) => setUserRating(parseInt(e.target.value))}
                        className="bg-white border border-gray-200 rounded-lg text-xs p-1 focus:outline-none"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ Excelente colaborador (5)</option>
                        <option value="4">⭐⭐⭐⭐ Muy atento (4)</option>
                        <option value="3">⭐⭐⭐ Neutral / Normal (3)</option>
                        <option value="2">⭐⭐ Regular (2)</option>
                        <option value="1">⭐ Problemático (1)</option>
                      </select>
                      <button
                        onClick={handleRate}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        Enviar
                      </button>
                      {ratedSuccessfully && (
                        <span className="text-xs text-emerald-600 font-bold ml-1 animate-pulse">¡Voto registrado!</span>
                      )}
                    </div>
                  )
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Profile edit form overlay/modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in duration-150">
              <div className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">Editar Perfil de Red</h3>
                
                {editError && (
                  <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">
                  
                  {/* Photo Edit */}
                  <div className="flex items-center space-x-4">
                    <img src={avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-gray-200" />
                    <label className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                      <Camera className="h-3.5 w-3.5" />
                      <span>Cambiar Foto</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nombre de pantalla</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition font-bold"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Edad (Mínimo 18 años)</label>
                    <input
                      type="number"
                      required
                      min="18"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition font-medium"
                    />
                  </div>

                  {/* Biography */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Biografía / Presentación</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Skills comma list */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Habilidades (separadas por comas)</label>
                    <input
                      type="text"
                      value={skillsString}
                      onChange={(e) => setSkillsString(e.target.value)}
                      placeholder="Ej. Electricidad, Cocina, Automóviles, Compañía"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                    <p className="text-[10px] text-gray-400">Ingresa las habilidades con las que estás dispuesto a cooperar en la red.</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition cursor-pointer"
                      id="save-profile-btn"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* User's historical causes */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
            <Heart className="h-5 w-5 text-emerald-500 fill-emerald-500" />
            Historial de publicaciones ({profileStories.length})
          </h3>

          {profileStories.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
              Este usuario aún no ha realizado publicaciones en la red.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileStories.map((story) => (
                <div key={story.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                      {story.category.toUpperCase()}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md ${
                      story.resolved 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {story.resolved ? '✓ RESUELTA' : '● ACTIVA'}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{story.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{story.description}</p>

                  <div className="flex justify-between items-center pt-2 text-[10px] text-gray-400 border-t border-gray-50">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {story.location}
                      </span>
                      <span>Intereses: {story.votesCount}</span>
                    </div>
                    {onDeleteStory && (currentUser?.id === story.userId || currentUser?.isAdmin) && (
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de que deseas borrar esta publicación?')) {
                            onDeleteStory(story.id);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold border border-rose-100 bg-rose-50/30"
                        title="Borrar publicación"
                        id={`delete-btn-profile-${story.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Borrar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
