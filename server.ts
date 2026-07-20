import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { z } from 'zod';
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
} from './src/types'; // Import TS types cleanly for tsx and esbuild

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// ==========================================
// MOCK DATABASE & IN-MEMORY STATE
// ==========================================

let users: User[] = [
  {
    id: 'user-admin',
    email: 'admin@redsolidaria.org',
    name: 'Admin de la Red',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    bio: 'Administrador general y moderador de la comunidad de apoyo mutuo.',
    reputation: 5.0,
    skills: ['Moderación', 'Apoyo Logístico', 'Primeros Auxilios'],
    isVerified: true,
    isAdmin: true,
    reportsCount: 0,
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    age: 35,
  },
  {
    id: 'user-1',
    email: 'carlos.mendoza@gmail.com',
    name: 'Carlos Mendoza (Ejemplo)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    bio: 'PERFIL DE EJEMPLO: Electricista jubilado. Ofrezco mi tiempo libre para reparaciones eléctricas hogareñas gratis para quienes no puedan costearlo.',
    reputation: 4.8,
    skills: ['Electricidad', 'Mantenimiento', 'Fontanería básica'],
    isVerified: true,
    isAdmin: false,
    reportsCount: 0,
    joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    age: 67,
  },
  {
    id: 'user-2',
    email: 'elena.gomez@hotmail.com',
    name: 'Elena Gómez (Ejemplo)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    bio: 'PERFIL DE EJEMPLO: Estudiante de medicina. Puedo ayudar con compras, acompañamiento o explicaciones sobre salud y prevención.',
    reputation: 4.9,
    skills: ['Medicina básica', 'Acompañamiento', 'Idiomas'],
    isVerified: true,
    isAdmin: false,
    reportsCount: 0,
    joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    age: 24,
  },
  {
    id: 'user-3',
    email: 'marta.diaz@outlook.com',
    name: 'Marta Díaz (Ejemplo)',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    bio: 'PERFIL DE EJEMPLO: Madre soltera de dos pequeños. A veces necesito apoyo con alimentos o transporte escolar.',
    reputation: 4.2,
    skills: ['Costura', 'Manualidades'],
    isVerified: false,
    isAdmin: false,
    reportsCount: 1,
    joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    age: 34,
  }
];

let stories: Story[] = [
  {
    id: 'story-1',
    userId: 'user-3',
    userName: 'Marta Díaz (Ejemplo)',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    userVerified: false,
    title: 'Necesito alimentos no perecederos para mis hijos (Caso de Ejemplo)',
    description: 'Hola a todos. [CASO DE PRUEBA / EJEMPLO] Debido a una reducción de horas en mi trabajo temporal, este mes se me hace imposible completar la canasta de alimentos básicos de mis dos hijos de 4 y 7 años. Agradezco de corazón cualquier ayuda con legumbres, arroz, leche en polvo o fideos. Puedo retirar en zonas cercanas al centro.',
    category: 'alimentos',
    urgency: 'alta',
    supportType: 'pide_ayuda',
    location: 'Buenos Aires, Centro',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-hands-of-an-elderly-person-41618-large.mp4',
    votesCount: 8,
    votedUserIds: ['user-1', 'user-2', 'user-admin'],
    resolved: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'story-2',
    userId: 'user-1',
    userName: 'Carlos Mendoza (Ejemplo)',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    userVerified: true,
    title: 'Ofrezco reparaciones eléctricas y del hogar gratuitas (Caso de Ejemplo)',
    description: 'Soy electricista matriculado jubilado. [CASO DE PRUEBA / EJEMPLO] Si tienes algún cortocircuito, enchufe roto, llave térmica saltando, o necesitas cambiar luminarias y no puedes costear un profesional por tu situación económica, escríbeme. Pongo mi mano de obra y algunas herramientas, solo coordinamos.',
    category: 'tecnologia',
    urgency: 'baja',
    supportType: 'ofrece_ayuda',
    location: 'Buenos Aires, Almagro',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    votesCount: 12,
    votedUserIds: ['user-2', 'user-3'],
    resolved: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'story-3',
    userId: 'user-2',
    userName: 'Elena Gómez (Ejemplo)',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    userVerified: true,
    title: 'Apoyo escolar y lectura para adultos mayores (Caso de Ejemplo)',
    description: 'Ofrezco mi ayuda 2 veces por semana para acompañar a personas mayores, leerles libros, ayudarlos con trámites en internet o dar apoyo escolar de primaria. Soy paciente y tengo experiencia en voluntariados escolares. [CASO DE PRUEBA / EJEMPLO]',
    category: 'educacion',
    urgency: 'media',
    supportType: 'ofrece_ayuda',
    location: 'Buenos Aires, Palermo',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    votesCount: 5,
    votedUserIds: ['user-1'],
    resolved: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

let messages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    receiverId: 'user-3',
    content: 'Hola Marta, leí tu publicación. Puedo acercarte una caja con mercadería (leche, arroz, aceite, fideos) mañana por la tarde. ¿Te queda bien?',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'user-3',
    receiverId: 'user-1',
    content: '¡Hola Carlos! Sería una bendición gigante, de verdad. Sí, mañana por la tarde estaré en casa después de las 16hs. Muchísimas gracias.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60000).toISOString(),
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'user-1',
    receiverId: 'user-3',
    content: 'Perfecto Marta, coordinamos entonces. Te aviso cuando esté saliendo para allá.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45 * 60000).toISOString(),
    read: false,
  }
];

let reports: Report[] = [
  {
    id: 'report-1',
    reporterId: 'user-2',
    reporterName: 'Elena Gómez',
    storyId: 'story-1',
    storyTitle: 'Necesito alimentos no perecederos para mis hijos',
    reason: 'Comentario de prueba: No es inapropiado, solo quería probar el sistema de reportes de la comunidad.',
    status: 'resuelto',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

let notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-3',
    content: 'Carlos Mendoza te ha enviado un mensaje privado con respecto a tu publicación.',
    type: 'chat',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Helper to simulate email notification logs
function sendMockEmail(to: string, subject: string, body: string) {
  console.log(`[EMAIL DISPATCH] Hacia: ${to}`);
  console.log(`[EMAIL DISPATCH] Asunto: ${subject}`);
  console.log(`[EMAIL DISPATCH] Cuerpo:\n${body}`);
  console.log('----------------------------------------------------');
}

// ==========================================
// AUTHENTICATION MIDDLEWARE (SIMULATED)
// ==========================================
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. Falta token.' });
  }

  const token = authHeader.split(' ')[1]; // Format "Bearer user-id"
  const user = users.find(u => u.id === token);

  if (!user) {
    return res.status(403).json({ error: 'Sesión no válida o expirada.' });
  }

  (req as any).user = user;
  next();
}

// ==========================================
// ZOD VALIDATIONS
// ==========================================
const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  age: z.coerce.number().min(18, { message: 'Debes ser mayor de 18 años para unirte a la plataforma' })
});

const storySchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }),
  description: z.string().min(3, { message: 'La descripción debe tener al menos 3 caracteres' }),
  category: z.enum(['alimentos', 'salud', 'educacion', 'tecnologia', 'transporte', 'refugio', 'compania', 'otros'] as const),
  urgency: z.enum(['baja', 'media', 'alta', 'critica'] as const),
  supportType: z.enum(['ofrece_ayuda', 'pide_ayuda'] as const),
  location: z.string().min(3, { message: 'Indica una ubicación aproximada' }),
  image: z.string().optional(),
  videoUrl: z.string().optional()
});

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Auth Endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    console.log('[SERVER] Registro solicitado con datos:', { ...req.body, password: '***' });
    const data = registerSchema.parse(req.body);

    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      console.warn('[SERVER] Intento de registro con email duplicado:', data.email);
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email.toLowerCase(),
      name: data.name,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=150`,
      bio: data.bio || '¡Hola! Soy un miembro nuevo entusiasmado de ayudar y colaborar en la comunidad.',
      reputation: 5.0,
      skills: data.skills || [],
      isVerified: false,
      isAdmin: false,
      reportsCount: 0,
      joinedAt: new Date().toISOString(),
      age: data.age
    };

    users.push(newUser);
    console.log('[SERVER] Usuario registrado con éxito:', newUser.id, newUser.email);

    sendMockEmail(
      newUser.email,
      '¡Te damos la bienvenida a HAGAMOS COSAS HERMOSAS!',
      `Hola ${newUser.name},\n\nGracias por unirte a HAGAMOS COSAS HERMOSAS. Tu cuenta ha sido creada exitosamente. Esperamos que puedas encontrar apoyo o brindar ayuda a quien lo necesite.\n\nAtentamente,\nEl Equipo de HAGAMOS COSAS HERMOSAS`
    );

    res.status(201).json({ user: newUser, token: newUser.id });
  } catch (error: any) {
    console.error('[SERVER ERROR] Error en /api/auth/register:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    res.status(500).json({ error: `Error del servidor al registrarse: ${error.message || error}` });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Se requiere correo electrónico y contraseña' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(400).json({ error: 'Credenciales inválidas.' });
  }

  // Simulated login - accepting any password for prototype convenience but demonstrating structure
  res.json({ user, token: user.id });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: (req as any).user });
});

// 2. Stories Endpoints & Relevance Algorithm
app.get('/api/stories', (req, res) => {
  const { search, category, urgency, supportType, resolved } = req.query;

  let filtered = [...stories];

  // Apply filters
  if (category) {
    filtered = filtered.filter(s => s.category === category);
  }
  if (urgency) {
    filtered = filtered.filter(s => s.urgency === urgency);
  }
  if (supportType) {
    filtered = filtered.filter(s => s.supportType === supportType);
  }
  if (resolved !== undefined) {
    const isResolved = resolved === 'true';
    filtered = filtered.filter(s => s.resolved === isResolved);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  }

  // RELEVANCE ALGORITHM CALCULATION
  // Based on: Votes, Urgency, User Verification status, and Time Elapsed without resolution.
  const scoredStories = filtered.map(story => {
    let score = 100; // Base score

    // 1. Urgency Weight
    switch (story.urgency) {
      case 'critica': score += 150; break;
      case 'alta': score += 80; break;
      case 'media': score += 30; break;
      case 'baja': score += 0; break;
    }

    // 2. Votes Weight (Each vote adds +15)
    score += (story.votesCount * 15);

    // 3. Verification Bonus (+40 for verified creators)
    if (story.userVerified) {
      score += 40;
    }

    // 4. Time Elapsed Bonus for Unresolved Stories
    if (!story.resolved) {
      const hoursSinceCreation = Math.floor((Date.now() - new Date(story.createdAt).getTime()) / (1000 * 60 * 60));
      // Increase relevance up to 100 points for older unresolved requests
      score += Math.min(hoursSinceCreation * 2, 100);
    } else {
      // De-prioritize resolved posts greatly
      score -= 1000;
    }

    return {
      ...story,
      relevanceScore: score
    };
  });

  // Sort by relevance score descending
  scoredStories.sort((a, b) => b.relevanceScore - a.relevanceScore);

  res.json(scoredStories);
});

app.post('/api/stories', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user as User;
    const data = storySchema.parse(req.body);

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userVerified: user.isVerified,
      title: data.title,
      description: data.description,
      category: data.category,
      urgency: data.urgency,
      supportType: data.supportType,
      location: data.location,
      image: data.image || undefined,
      videoUrl: data.videoUrl || undefined,
      votesCount: 0,
      votedUserIds: [],
      resolved: false,
      createdAt: new Date().toISOString()
    };

    stories.unshift(newStory);

    // Send notification logs to other users in the same location (simulated)
    users.forEach(u => {
      if (u.id !== user.id) {
        notifications.push({
          id: `notif-${Date.now()}-${u.id}`,
          userId: u.id,
          content: `Nueva publicación en ${newStory.location}: "${newStory.title}"`,
          type: 'system',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    res.status(201).json(newStory);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    res.status(500).json({ error: 'Error del servidor al crear publicación' });
  }
});

// Vote / support a story
app.post('/api/stories/:id/vote', authenticateToken, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user as User;

  const story = stories.find(s => s.id === id);
  if (!story) {
    return res.status(404).json({ error: 'Publicación no encontrada.' });
  }

  const index = story.votedUserIds.indexOf(user.id);
  if (index > -1) {
    // Already voted, remove the support vote
    story.votedUserIds.splice(index, 1);
    story.votesCount = Math.max(0, story.votesCount - 1);
  } else {
    // Add support vote
    story.votedUserIds.push(user.id);
    story.votesCount += 1;

    // Send in-app notification to the post creator
    if (story.userId !== user.id) {
      notifications.push({
        id: `notif-${Date.now()}`,
        userId: story.userId,
        content: `A ${user.name} le interesa tu publicación: "${story.title}"`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  res.json(story);
});

// Resolve a story (Mark as helped)
app.post('/api/stories/:id/resolve', authenticateToken, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user as User;

  const story = stories.find(s => s.id === id);
  if (!story) {
    return res.status(404).json({ error: 'Publicación no encontrada.' });
  }

  if (story.userId !== user.id && !user.isAdmin) {
    return res.status(403).json({ error: 'Solo el creador o un administrador pueden resolver esta publicación.' });
  }

  story.resolved = true;

  // Boost creator's reputation on successful resolution
  const creator = users.find(u => u.id === story.userId);
  if (creator) {
    creator.reputation = Math.min(5.0, creator.reputation + 0.1);
  }

  // Notify voters/supporters
  story.votedUserIds.forEach(voterId => {
    notifications.push({
      id: `notif-${Date.now()}-${voterId}`,
      userId: voterId,
      content: `La causa en la que mostraste interés "${story.title}" ha sido marcada como RESUELTA. ¡Gracias por colaborar!`,
      type: 'resolve',
      read: false,
      createdAt: new Date().toISOString()
    });
  });

  res.json(story);
});

// Delete a story
app.delete('/api/stories/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user as User;

  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Publicación no encontrada.' });
  }

  const story = stories[storyIndex];
  if (story.userId !== user.id && !user.isAdmin) {
    return res.status(403).json({ error: 'No tienes permisos para eliminar esta publicación.' });
  }

  stories.splice(storyIndex, 1);
  res.json({ success: true, message: 'Publicación eliminada correctamente.' });
});

// 3. User Profile Endpoints
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  const userStories = stories.filter(s => s.userId === id);
  res.json({ user, stories: userStories });
});

app.put('/api/users/profile', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  const { name, bio, skills, avatar, age } = req.body;

  const dbUser = users.find(u => u.id === user.id);
  if (!dbUser) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  if (age !== undefined) {
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 18) {
      return res.status(400).json({ error: 'Debes ser mayor de 18 años para completar tu perfil.' });
    }
    dbUser.age = ageNum;
  }

  if (name) dbUser.name = name;
  if (bio !== undefined) dbUser.bio = bio;
  if (skills) dbUser.skills = skills;
  if (avatar) dbUser.avatar = avatar;

  // Sync avatar and name on stories
  stories.forEach(s => {
    if (s.userId === user.id) {
      s.userName = dbUser.name;
      s.userAvatar = dbUser.avatar;
    }
  });

  res.json(dbUser);
});

// Endorse reputation
app.post('/api/users/:id/reputation', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { rating } = req.body; // rating between 1 and 5
  const user = (req as any).user as User;

  if (user.id === id) {
    return res.status(400).json({ error: 'No puedes votar tu propia reputación.' });
  }

  const targetUser = users.find(u => u.id === id);
  if (!targetUser) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  const validRating = parseFloat(rating);
  if (isNaN(validRating) || validRating < 1 || validRating > 5) {
    return res.status(400).json({ error: 'Calificación inválida. Debe ser entre 1 y 5.' });
  }

  // Calculate new running average for demonstration
  targetUser.reputation = parseFloat(((targetUser.reputation * 4 + validRating) / 5).toFixed(1));

  res.json({ success: true, reputation: targetUser.reputation });
});

// 4. Chat Endpoints (SSE/Polling simulation)
app.get('/api/chat/conversations', authenticateToken, (req, res) => {
  const user = (req as any).user as User;

  // Find all distinct users who have chatted with the active user
  const chatPartners = new Set<string>();
  messages.forEach(m => {
    if (m.senderId === user.id) chatPartners.add(m.receiverId);
    if (m.receiverId === user.id) chatPartners.add(m.senderId);
  });

  const conversationList = Array.from(chatPartners).map(partnerId => {
    const partner = users.find(u => u.id === partnerId);
    const relatedMessages = messages.filter(
      m => (m.senderId === user.id && m.receiverId === partnerId) ||
           (m.senderId === partnerId && m.receiverId === user.id)
    );
    const lastMessage = relatedMessages[relatedMessages.length - 1];
    const unreadCount = relatedMessages.filter(m => m.receiverId === user.id && !m.read).length;

    return {
      partner,
      lastMessage,
      unreadCount
    };
  }).filter(c => c.partner !== undefined);

  // Sort by last message date
  conversationList.sort((a, b) => {
    const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  res.json(conversationList);
});

app.get('/api/chat/messages/:partnerId', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  const { partnerId } = req.params;

  const chatMessages = messages.filter(
    m => (m.senderId === user.id && m.receiverId === partnerId) ||
         (m.senderId === partnerId && m.receiverId === user.id)
  );

  // Mark retrieved messages as read
  chatMessages.forEach(m => {
    if (m.receiverId === user.id) m.read = true;
  });

  res.json(chatMessages);
});

app.post('/api/chat/messages', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  const { receiverId, content } = req.body;

  if (!receiverId || !content || content.trim() === '') {
    return res.status(400).json({ error: 'Destinatario y contenido requeridos.' });
  }

  const receiver = users.find(u => u.id === receiverId);
  if (!receiver) {
    return res.status(404).json({ error: 'Destinatario no encontrado.' });
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    senderId: user.id,
    receiverId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    read: false
  };

  messages.push(newMessage);

  // Add notification
  notifications.push({
    id: `notif-${Date.now()}`,
    userId: receiverId,
    content: `${user.name} te ha enviado un mensaje: "${content.length > 30 ? content.substring(0, 30) + '...' : content}"`,
    type: 'chat',
    read: false,
    createdAt: new Date().toISOString()
  });

  // Simulated email delivery of offline message
  sendMockEmail(
    receiver.email,
    `Nuevo mensaje privado de ${user.name} en HAGAMOS COSAS HERMOSAS`,
    `Hola ${receiver.name},\n\nHas recibido un nuevo mensaje de ${user.name}:\n\n"${content}"\n\nResponde ingresando a la plataforma en la sección de Chats.\n\nAtentamente,\nEl Equipo de HAGAMOS COSAS HERMOSAS`
  );

  res.status(201).json(newMessage);
});

// 5. Reports & Flagging System
app.post('/api/reports', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  const { storyId, reason } = req.body;

  if (!storyId || !reason || reason.trim() === '') {
    return res.status(400).json({ error: 'Publicación e informe requeridos.' });
  }

  const story = stories.find(s => s.id === storyId);
  if (!story) {
    return res.status(404).json({ error: 'Publicación no encontrada.' });
  }

  const newReport: Report = {
    id: `report-${Date.now()}`,
    reporterId: user.id,
    reporterName: user.name,
    storyId,
    storyTitle: story.title,
    reason,
    status: 'pendiente',
    createdAt: new Date().toISOString()
  };

  reports.unshift(newReport);

  // Increment report count of the story's creator
  const creator = users.find(u => u.id === story.userId);
  if (creator) {
    creator.reportsCount += 1;
  }

  res.status(201).json(newReport);
});

// 6. Notifications API
app.get('/api/notifications', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  const userNotifs = notifications.filter(n => n.userId === user.id);
  res.json(userNotifs);
});

app.post('/api/notifications/read-all', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  notifications.forEach(n => {
    if (n.userId === user.id) n.read = true;
  });
  res.json({ success: true });
});

// 7. Admin Endpoints
app.get('/api/admin/reports', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  if (!user.isAdmin) {
    return res.status(403).json({ error: 'Acceso exclusivo de administrador.' });
  }
  res.json(reports);
});

app.post('/api/admin/reports/:id/resolve', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  if (!user.isAdmin) {
    return res.status(403).json({ error: 'Acceso exclusivo de administrador.' });
  }

  const report = reports.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Reporte no encontrado.' });
  }

  report.status = 'resuelto';
  res.json(report);
});

app.get('/api/admin/stats', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  if (!user.isAdmin) {
    return res.status(403).json({ error: 'Acceso exclusivo de administrador.' });
  }

  const stats: SystemStats = {
    totalUsers: users.length,
    totalStories: stories.length,
    activeChats: new Set(messages.map(m => [m.senderId, m.receiverId].sort().join('-'))).size,
    resolvedStories: stories.filter(s => s.resolved).length,
    pendingReports: reports.filter(r => r.status === 'pendiente').length
  };

  res.json(stats);
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  if (!user.isAdmin) {
    return res.status(403).json({ error: 'Acceso exclusivo de administrador.' });
  }
  res.json(users);
});

app.post('/api/admin/users/:id/verify', authenticateToken, (req, res) => {
  const user = (req as any).user as User;
  if (!user.isAdmin) {
    return res.status(403).json({ error: 'Acceso exclusivo de administrador.' });
  }

  const targetUser = users.find(u => u.id === req.params.id);
  if (!targetUser) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  targetUser.isVerified = !targetUser.isVerified;

  // Sync state on their posts
  stories.forEach(s => {
    if (s.userId === targetUser.id) {
      s.userVerified = targetUser.isVerified;
    }
  });

  notifications.push({
    id: `notif-${Date.now()}`,
    userId: targetUser.id,
    content: targetUser.isVerified 
      ? '¡Felicidades! Tu cuenta ha sido VERIFICADA por el equipo administrador. Tu reputación y relevancia ahora tienen prioridad.'
      : 'Tu estado de cuenta verificada ha sido revocado por un administrador.',
    type: 'system',
    read: false,
    createdAt: new Date().toISOString()
  });

  res.json(targetUser);
});

// ==========================================
// VITE DEV SERVER & PRODUCTION INTEGRATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HAGAMOS COSAS HERMOSAS SERVER] Iniciado con éxito.`);
    console.log(`[HAGAMOS COSAS HERMOSAS SERVER] URL de pruebas: http://localhost:${PORT}`);
  });
}

startServer();
