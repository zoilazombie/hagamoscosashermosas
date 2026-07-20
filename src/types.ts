export type Urgency = 'baja' | 'media' | 'alta' | 'critica';

export type Category = 
  | 'alimentos' 
  | 'salud' 
  | 'educacion' 
  | 'tecnologia' 
  | 'transporte' 
  | 'refugio' 
  | 'compania' 
  | 'otros';

export type SupportType = 'ofrece_ayuda' | 'pide_ayuda';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  reputation: number; // 0 to 5 stars or points
  skills: string[];
  isVerified: boolean;
  isAdmin: boolean;
  reportsCount: number;
  joinedAt: string;
  age?: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userVerified: boolean;
  title: string;
  description: string;
  category: Category;
  urgency: Urgency;
  supportType: SupportType;
  location: string;
  image?: string;
  videoUrl?: string;
  votesCount: number;
  votedUserIds: string[]; // Track who voted to prevent double voting
  resolved: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  storyId: string;
  storyTitle: string;
  reason: string;
  status: 'pendiente' | 'resuelto';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  content: string;
  type: 'chat' | 'system' | 'resolve' | 'report';
  read: boolean;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalStories: number;
  activeChats: number;
  resolvedStories: number;
  pendingReports: number;
}
