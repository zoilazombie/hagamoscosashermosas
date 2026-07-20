import React, { useState } from 'react';
import { X, AlertCircle, Camera, Check, Sparkles, Video } from 'lucide-react';
import { Category, Urgency, SupportType } from '../types';
import { z } from 'zod';

interface StoryModalProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: Category;
    urgency: Urgency;
    supportType: SupportType;
    location: string;
    image?: string;
    videoUrl?: string;
  }) => void | Promise<void>;
}

// Client-side Zod validation schema
const clientStorySchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }),
  description: z.string().min(3, { message: 'La descripción debe detallar bien la causa (mín. 3 car.)' }),
  location: z.string().min(3, { message: 'Debes ingresar un vecindario o ciudad' }),
  category: z.string().min(1, { message: 'Selecciona una categoría válida' }),
  urgency: z.string().min(1, { message: 'Selecciona el nivel de urgencia' }),
  supportType: z.string().min(1, { message: 'Selecciona si ofreces o pides ayuda' }),
});

export default function StoryModal({ onClose, onSubmit }: StoryModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('alimentos');
  const [urgency, setUrgency] = useState<Urgency>('media');
  const [supportType, setSupportType] = useState<SupportType>('pide_ayuda');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Built-in high-quality preset image selection to make the feed beautiful
  const presets: { label: string; url: string; cat: Category }[] = [
    { label: 'Canasta Básica Alimentos', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600', cat: 'alimentos' },
    { label: 'Medicinas y Farmacia', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600', cat: 'salud' },
    { label: 'Útiles y Libros Escolares', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600', cat: 'educacion' },
    { label: 'Herramientas de Trabajo', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600', cat: 'tecnologia' },
    { label: 'Transporte Solidario', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600', cat: 'transporte' },
    { label: 'Acompañamiento Social', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', cat: 'compania' }
  ];

  // Base64 file uploader helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('La imagen no debe superar los 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Base64 video file uploader helper
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setErrorMsg('El video no debe superar los 20MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg('');

    const validationResult = clientStorySchema.safeParse({
      title,
      description,
      location,
      category,
      urgency,
      supportType,
    });

    if (!validationResult.success) {
      setErrorMsg(validationResult.error.issues[0].message);
      setTimeout(() => {
        const container = document.getElementById('story-modal-container');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        category,
        urgency,
        supportType,
        location,
        image: imageUrl || undefined,
        videoUrl: supportType === 'pide_ayuda' && videoUrl ? videoUrl : undefined,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado al publicar.');
      setTimeout(() => {
        const container = document.getElementById('story-modal-container');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
        id="story-modal-container"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500 fill-emerald-100" />
              Publicar Causa o Servicio
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Completa el formulario para publicarlo en la red de apoyo</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition cursor-pointer"
            id="close-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-sm flex items-center gap-2 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Support Type */}
            <div className="col-span-1 space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">¿Cuál es el rol de tu publicación?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSupportType('pide_ayuda')}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    supportType === 'pide_ayuda'
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  id="modal-pide-ayuda-btn"
                >
                  Pido Ayuda
                </button>
                <button
                  type="button"
                  onClick={() => setSupportType('ofrece_ayuda')}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    supportType === 'ofrece_ayuda'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  id="modal-ofrece-ayuda-btn"
                >
                  Ofrezco Ayuda
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="col-span-1 space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Categoría de Apoyo</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition font-medium text-gray-800"
                id="modal-category-select"
              >
                <option value="alimentos">🍎 Alimentos</option>
                <option value="salud">🩺 Salud</option>
                <option value="educacion">📚 Educación</option>
                <option value="tecnologia">💻 Mano de Obra y Oficios</option>
                <option value="transporte">🚗 Transporte / Traslados</option>
                <option value="refugio">🏠 Refugio / Vivienda</option>
                <option value="compania">👥 Acompañamiento Social</option>
                <option value="otros">📦 Otros / Misceláneos</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div className="col-span-1 space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Ubicación aproximada</label>
              <input
                type="text"
                required
                placeholder="Ej. Buenos Aires, San Telmo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition text-gray-800"
                id="modal-location-input"
              />
            </div>

            {/* Urgency */}
            <div className="col-span-1 space-y-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Nivel de Urgencia</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition font-medium text-gray-800"
                id="modal-urgency-select"
              >
                <option value="baja">Baja - Sin apuro</option>
                <option value="media">Media - Coordinar con tiempo</option>
                <option value="alta">Alta - Se necesita esta semana</option>
                <option value="critica">Crítica - Emergencia inmediata 🔥</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Título descriptivo</label>
            <input
              type="text"
              required
              placeholder="Ej. Necesito arreglar instalación eléctrica / Ofrezco acompañamiento escolar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500 transition font-bold text-gray-800"
              id="modal-title-input"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Descripción de la Causa o Servicio</label>
            <textarea
              required
              rows={4}
              placeholder="Explica detalladamente qué necesitas o qué ofreces. Sé específico, respetuoso y explica cómo pueden contactarte o coordinar."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 transition text-gray-800 leading-relaxed"
              id="modal-desc-input"
            />
          </div>

          {/* Image Upload or Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Foto Ilustrativa</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              
              {/* Preset selection */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Preseteados rápidos de calidad</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`text-[10px] p-2 text-left rounded-lg border transition truncate flex items-center justify-between cursor-pointer ${
                        imageUrl === preset.url
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {imageUrl === preset.url && <Check className="h-3 w-3 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Base64 File Uploader */}
              <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl bg-white p-4">
                {imageUrl && !presets.some(p => p.url === imageUrl) ? (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-100">
                    <img src={imageUrl} alt="Subida" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full py-4 text-gray-400 hover:text-emerald-600 transition">
                    <Camera className="h-8 w-8 mb-1" />
                    <span className="text-xs font-semibold">Subir imagen propia (máx. 2MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

            </div>
          </div>

          {/* Video upload or provision (Only if pide_ayuda) */}
          {supportType === 'pide_ayuda' && (
            <div className="space-y-2 border border-emerald-100 bg-emerald-50/40 p-4 rounded-2xl">
              <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ¿Querés sumar un video contando tu historia?
              </label>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Las publicaciones con video transmiten muchísima confianza y conectan mejor con los vecinos. Podés pegar el enlace de un video (YouTube, Vimeo o un archivo directo .mp4), o usar nuestro video de ejemplo para probar cómo se ve.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Opción 1: Enlace o Ejemplo */}
                <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-emerald-100/60 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wider">Opción 1: Enlace de Internet</span>
                    <input
                      type="text"
                      placeholder="Pegá enlace de YouTube, Vimeo, o link .mp4"
                      value={videoUrl.startsWith('data:') ? '' : videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition text-gray-800 font-medium"
                      id="modal-video-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-holding-hands-of-an-elderly-person-41618-large.mp4')}
                    className="mt-2 w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    id="modal-use-example-video-btn"
                  >
                    Usar video de ejemplo
                  </button>
                </div>

                {/* Opción 2: Subir archivo de video */}
                <div className="bg-white/70 p-3.5 rounded-xl border border-emerald-100/60 flex flex-col justify-center items-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-2 tracking-wider self-start">Opción 2: Subir tu propio video</span>
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full border border-dashed border-emerald-200 rounded-lg py-4 bg-white text-gray-500 hover:text-emerald-700 hover:border-emerald-400 transition h-full min-h-[90px]">
                    <Video className="h-6 w-6 mb-1 text-emerald-600" />
                    <span className="text-[11px] font-bold">Seleccionar video propio</span>
                    <span className="text-[8px] text-gray-400 font-semibold mt-0.5">Formatos .mp4, .webm (máx. 20MB)</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {videoUrl && (
                <div className="mt-2 p-2 bg-white rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-gray-500 font-bold mb-1">Vista previa del video:</p>
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-full max-h-36 object-contain bg-black rounded-lg"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-gray-400 truncate max-w-xs">
                      {videoUrl.startsWith('data:') ? '🎥 Archivo de video cargado con éxito' : videoUrl}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setVideoUrl('')} 
                      className="text-[9px] text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remover video
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs flex items-center gap-2 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Modal Footer actions */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition cursor-pointer"
              id="modal-cancel-btn"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 text-white rounded-xl text-sm font-bold transition shadow-xs cursor-pointer ${
                submitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
              id="modal-submit-btn"
            >
              {submitting ? 'Publicando...' : 'Publicar Causa'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
