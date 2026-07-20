# HAGAMOS COSAS HERMOSAS - Plataforma de Apoyo Mutuo

Una aplicación full-stack construida con **TypeScript**, **React**, **Express** y **Tailwind CSS**. HAGAMOS COSAS HERMOSAS es una plataforma diseñada para conectar a personas que necesitan ayuda con colaboradores voluntarios dispuestos a donar su tiempo, habilidades o recursos.

---

## 🚀 Características Clave

1. **Autenticación Completa**: Registro e inicio de sesión de usuarios con validaciones de esquemas en tiempo real con **Zod** y manejo de sesiones.
2. **Feed de Causas Inteligente**: Buscador integrado, filtros dinámicos (categoría, urgencia, tipo de apoyo y estado de resolución) y un **Algoritmo de Relevancia Inteligente** basado en:
   * **Nivel de Urgencia**: Emergencias críticas reciben prioridad de visualización.
   * **Apoyo de la Comunidad**: Votos/Intereses incrementan la relevancia de la causa.
   * **Estado de Verificación**: Usuarios verificados obtienen mayor credibilidad y puntuación.
   * **Tiempo transcurrido**: Casos antiguos sin resolver obtienen un impulso para evitar que queden en el olvido.
3. **Perfiles con Reputación**: Biografías de colaboradores, listado de habilidades de apoyo, reputación promedio basada en estrellas (1 a 5) y listado histórico de causas creadas.
4. **Chat Privado**: Centro de mensajería con hilos de conversación, conteo de mensajes no leídos, indicación de estado leído y simulación de notificaciones.
5. **Sistema de Reportes y Moderación**: Formulario para denunciar publicaciones sospechosas, con clasificación automática en el panel de control.
6. **Panel de Administración**: Métricas del sistema en tiempo real, administración de reportes (aprobar o eliminar post ofensivo), y verificación oficial de identidades de usuarios.
7. **Notificaciones de Email (Simuladas)**: Notificaciones automáticas por correo electrónico logueadas en el servidor cuando hay nuevos registros o mensajes sin leer fuera de línea.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend**: React (v19), Vite (v6), Tailwind CSS (v4), Motion / Framer Motion para transiciones suaves, Lucide Icons.
* **Backend**: Express.js, TypeScript, tsx, esbuild para empaquetado ultra rápido en CJS de producción.
* **Validaciones**: Zod (esquemas estrictos tanto en cliente como en servidor).

---

## 📦 Estructura del Proyecto

* `/server.ts` - Servidor full-stack Express con simulación persistente, enrutamiento de API y despacho de correos en consola.
* `/src/types.ts` - Definiciones de interfaces TypeScript utilizadas a lo largo de toda la aplicación.
* `/src/App.tsx` - Controlador global del estado, autenticación, hilos de mensajes, alertas y navegación reactiva.
* `/src/components/` - Componentes modulares y reutilizables:
  * `Navbar.tsx` - Barra de navegación con un menú colapsable, menú de notificaciones dinámico y perfiles de sesión.
  * `Hero.tsx` - Banner interactivo para realizar filtrados rápidos.
  * `Feed.tsx` - Motor de búsqueda, panel lateral de filtros y tarjetas de causas.
  * `StoryModal.tsx` - Creación de publicaciones con presets de imágenes de alta calidad o convertidor automático de imágenes locales a Base64.
  * `ProfileView.tsx` - Visualización e interacción con perfiles y sistema de votos de reputación.
  * `ChatBox.tsx` - Interfaz interactiva de hilos de chat.
  * `AdminPanel.tsx` - Panel de métricas y herramientas de moderación.

---

## 💻 Ejecución del Proyecto Localmente

### Prerrequisitos
* Node.js v18 o superior instalado.

### Instalación y Lanzamiento
1. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
2. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre tu navegador e ingresa a `http://localhost:3000`.

---

## 🌐 Guía de Migración y Despliegue en Vercel + Supabase (Next.js)

Para llevar este prototipo a producción utilizando **Next.js 15 (App Router)** y **Supabase** como solicita la arquitectura final, sigue estos sencillos pasos de mapeo:

### 1. Configuración de Base de Datos (Supabase SQL)
Crea las siguientes tablas en tu consola de Supabase (Editor de SQL):

```sql
-- Tabla de Perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  reputation NUMERIC DEFAULT 5.0,
  skills TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de Historias/Causas
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  support_type TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT,
  votes_count INT DEFAULT 0,
  voted_user_ids UUID[] DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de Mensajería
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 2. Conversión a Next.js 15 App Router
* Mapea los endpoints de `/server.ts` a **Rutas de API (Route Handlers)** en Next.js dentro de la carpeta `/app/api/`:
  * `POST /api/auth/register` ➔ `/app/api/auth/signup/route.ts` usando `@supabase/ssr` para registrar en Auth.
  * `GET /api/stories` ➔ `/app/api/stories/route.ts` realizando la consulta SQL utilizando el cliente de Supabase y ordenando mediante la fórmula de relevancia.
* El archivo `/src/App.tsx` se divide en las páginas de Next.js:
  * `/app/page.tsx` para el feed y buscador.
  * `/app/chat/page.tsx` para los mensajes privados.
  * `/app/profile/[id]/page.tsx` para los perfiles.
  * `/app/admin/page.tsx` para el panel de moderación.

### 3. Autenticación y Despliegue en Vercel
1. Registra tu proyecto en **Vercel** enlazando tu repositorio de GitHub.
2. Añade las variables de entorno requeridas en la configuración de Vercel:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```
3. Vercel detectará el framework de Next.js automáticamente y realizará el despliegue con compresión y distribución de CDN globales en segundos.
