import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Type declaration for Vite env
declare global {
  interface ImportMeta {
    readonly env: Record<string, string>;
  }
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API: Final API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('API Interceptor: Request to:', config.url);
    console.log('API Interceptor: Token exists:', !!token);
    console.log('API Interceptor: Token value:', token ? token.substring(0, 20) + '...' : 'No token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Interceptor: Authorization header set:', config.headers.Authorization ? 'Yes' : 'No');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CREATOR';
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'CREATOR';
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface Question {
  id: number;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  options: Option[];
  correctAnswer: string;
  points: number;
}

export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  status: 'PRIVATE' | 'PENDING_APPROVAL' | 'PUBLIC';
  categoryId: number;
  category?: Category;
  creatorId: number;
  creator?: User;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizData {
  title: string;
  description?: string;
  categoryName: string;
  questions: { text: string; options: { text: string; isCorrect: boolean }[] }[];
}

export interface Game {
  id: number;
  quizId: number;
  quiz?: Quiz;
  status: 'WAITING' | 'ACTIVE' | 'FINISHED';
  players: Player[];
  createdAt: string;
}

export interface Player {
  id: number;
  userId: number;
  user?: User;
  score: number;
  joinedAt: string;
}

// Tournament interfaces
export interface Tournament {
  id: number;
  name: string;
  description?: string;
  status: 'UPCOMING' | 'REGISTRATION' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
  type: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS_SYSTEM';
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate?: string;
  quizId: number;
  creatorId: number;
  isPublic: boolean;
  settings?: {
    timeLimit?: number;
    questionsPerBattle?: number;
    allowSpectators?: boolean;
    autoStart?: boolean;
  };
  participants?: TournamentParticipant[];
  creator?: User;
  quiz?: Quiz;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentParticipant {
  id: number;
  tournamentId: number;
  userId: number;
  score: number;
  wins: number;
  losses: number;
  draws: number;
  isEliminated: boolean;
  eliminatedAt?: string;
  finalRank?: number;
  user?: User;
}

export interface CreateTournamentData {
  name: string;
  description?: string;
  type?: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS_SYSTEM';
  maxParticipants: number;
  startDate: string;
  quizId: number;
  creatorId: number;
  isPublic?: boolean;
  settings?: {
    timeLimit?: number;
    questionsPerBattle?: number;
    allowSpectators?: boolean;
    autoStart?: boolean;
  };
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    console.log('API: Login request to:', `${API_BASE_URL}/auth/login`);
    console.log('API: Credentials:', { email: credentials.email, password: '***' });
    
    try {
      const response: AxiosResponse<{ token: string; user: User }> = await api.post('/auth/login', credentials);
      console.log('API: Login response status:', response.status);
      console.log('API: Login response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Login request failed:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post('/auth/register', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response: AxiosResponse<Category[]> = await api.get('/categories');
    return response.data;
  },

  create: async (name: string): Promise<Category> => {
    const response: AxiosResponse<Category> = await api.post('/categories', { name });
    return response.data;
  },

  update: async (id: number, name: string): Promise<Category> => {
    const response: AxiosResponse<Category> = await api.put(`/categories/${id}`, { name });
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Quizzes API
export const quizzesAPI = {
  getAll: async (params?: { status?: string; categoryId?: number }): Promise<Quiz[]> => {
    console.log('API: Fetching quizzes with params:', params);
    console.log('API: Auth token exists:', !!localStorage.getItem('authToken'));
    const response: AxiosResponse<Quiz[]> = await api.get('/quizzes', { params });
    console.log('API: Quizzes response:', response.data);
    return response.data;
  },

  getById: async (id: number): Promise<Quiz> => {
    const response: AxiosResponse<Quiz> = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  create: async (data: CreateQuizData): Promise<Quiz> => {
    console.log('API: Creating quiz with data:', data);
    console.log('API: Auth token exists:', !!localStorage.getItem('authToken'));
    const response: AxiosResponse<Quiz> = await api.post('/quizzes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateQuizData>): Promise<Quiz> => {
    const response: AxiosResponse<Quiz> = await api.put(`/quizzes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  requestPublic: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.patch(`/quizzes/${id}/request-public`);
    return response.data;
  },

  approve: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.patch(`/quizzes/${id}/approve`);
    return response.data;
  },
};

// Games API
export const gamesAPI = {
  getAll: async (): Promise<Game[]> => {
    const response: AxiosResponse<Game[]> = await api.get('/games');
    return response.data;
  },

  getById: async (id: number): Promise<Game> => {
    const response: AxiosResponse<Game> = await api.get(`/games/${id}`);
    return response.data;
  },

  getActive: async (): Promise<Game[]> => {
    const response: AxiosResponse<Game[]> = await api.get('/games/active');
    return response.data;
  },
};

// AI API
export const aiAPI = {
  generateQuiz: async (prompt: string, categoryId: number): Promise<CreateQuizData> => {
    const response: AxiosResponse<CreateQuizData> = await api.post('/ai/generate-quiz', {
      prompt,
      categoryId,
    });
    return response.data;
  },

  generateQuestion: async (prompt: string, categoryId: number): Promise<Question> => {
    const response: AxiosResponse<Question> = await api.post('/ai/generate-question', {
      prompt,
      categoryId,
    });
    return response.data;
  },
};

// Questions API
export const questionsAPI = {
  getAll: async (params?: { quizId?: number }): Promise<Question[]> => {
    const response: AxiosResponse<Question[]> = await api.get('/questions', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Question> => {
    const response: AxiosResponse<Question> = await api.get(`/questions/${id}`);
    return response.data;
  },

  create: async (data: {
    text: string;
    quizId: number;
    options: { text: string; isCorrect: boolean }[];
  }): Promise<Question> => {
    const response: AxiosResponse<Question> = await api.post('/questions', data);
    return response.data;
  },

  update: async (id: number, data: {
    text?: string;
    options?: { text: string; isCorrect: boolean }[];
  }): Promise<Question> => {
    const response: AxiosResponse<Question> = await api.put(`/questions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/questions/${id}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  create: async (data: { name: string; email: string; password: string; role?: string }): Promise<User> => {
    const response: AxiosResponse<{ status: string; data: { user: User } }> = await api.post('/users', data);
    return response.data.data.user;
  },

  getAll: async (): Promise<User[]> => {
    const response: AxiosResponse<{ status: string; data: { users: User[] } }> = await api.get('/users');
    return response.data.data.users;
  },

  getById: async (id: number): Promise<User> => {
    const response: AxiosResponse<{ status: string; data: { user: User } }> = await api.get(`/users/${id}`);
    return response.data.data.user;
  },

  update: async (id: number, data: { name?: string; email?: string; role?: string }): Promise<User> => {
    const response: AxiosResponse<{ status: string; data: { user: User } }> = await api.put(`/users/${id}`, data);
    return response.data.data.user;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ status: string; message: string }> = await api.delete(`/users/${id}`);
    return response.data;
  },

  ban: async (id: number): Promise<User> => {
    const response: AxiosResponse<{ status: string; data: { user: User } }> = await api.post(`/users/${id}/ban`);
    return response.data.data.user;
  },

  unban: async (id: number): Promise<User> => {
    const response: AxiosResponse<{ status: string; data: { user: User } }> = await api.post(`/users/${id}/unban`);
    return response.data.data.user;
  },

  promoteToModerator: async (id: number): Promise<User> => {
    const response: AxiosResponse<{ status: string; data: { user: User } }> = await api.post(`/users/${id}/promote-moderator`);
    return response.data.data.user;
  },

  promoteToAdmin: async (id: number): Promise<User> => {
    const response: AxiosResponse<{ status: string; data: { user: User } }> = await api.post(`/users/${id}/promote-admin`);
    return response.data.data.user;
  },

  getStats: async (): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    adminUsers: number;
    creatorUsers: number;
    bannedUsers: number;
  }> => {
    const response: AxiosResponse<{ status: string; data: { stats: any } }> = await api.get('/users/stats');
    return response.data.data.stats;
  },
};

// Tournaments API
export const tournamentsAPI = {
  getAll: async (): Promise<Tournament[]> => {
    const response: AxiosResponse<{ status: string; data: { tournaments: Tournament[] } }> = await api.get('/tournaments');
    return response.data.data.tournaments;
  },

  getById: async (id: number): Promise<Tournament> => {
    const response: AxiosResponse<{ status: string; data: { tournament: Tournament } }> = await api.get(`/tournaments/${id}`);
    return response.data.data.tournament;
  },

  create: async (data: CreateTournamentData): Promise<Tournament> => {
    const response: AxiosResponse<{ status: string; data: { tournament: Tournament } }> = await api.post('/tournaments', data);
    return response.data.data.tournament;
  },

  update: async (id: number, data: Partial<CreateTournamentData>): Promise<Tournament> => {
    const response: AxiosResponse<{ status: string; data: { tournament: Tournament } }> = await api.put(`/tournaments/${id}`, data);
    return response.data.data.tournament;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ status: string; message: string }> = await api.delete(`/tournaments/${id}`);
    return response.data;
  },

  join: async (id: number, userId: number): Promise<{ message: string }> => {
    const response: AxiosResponse<{ status: string; message: string }> = await api.post(`/tournaments/${id}/join`, { userId });
    return response.data;
  },

  start: async (id: number): Promise<Tournament> => {
    const response: AxiosResponse<{ status: string; data: { tournament: Tournament } }> = await api.post(`/tournaments/${id}/start`);
    return response.data.data.tournament;
  },
};

// Battle interfaces
export interface Battle {
  id: number;
  name: string;
  status: 'SCHEDULED' | 'WAITING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
  type: 'TOURNAMENT' | 'FRIENDLY' | 'RANKED' | 'CUSTOM';
  quizId: number;
  tournamentId?: number;
  round?: number;
  matchNumber?: number;
  scheduledAt?: string;
  startedAt?: string;
  finishedAt?: string;
  settings?: {
    timeLimit?: number;
    questionsCount?: number;
    allowSpectators?: boolean;
    autoStart?: boolean;
  };
  results?: {
    winnerId?: number;
    loserId?: number;
    isDraw?: boolean;
    winnerScore?: number;
    loserScore?: number;
    questionsAnswered?: {
      player1: number;
      player2: number;
    };
    averageResponseTime?: {
      player1: number;
      player2: number;
    };
  };
  participants?: BattleParticipant[];
  questions?: BattleQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface BattleQuestion {
  id: number;
  battleId: number;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  correctAnswer: string;
  order: number;
  timeLimit?: number;
  askedAt?: string;
  answeredAt?: string;
  playerAnswers?: {
    playerId: number;
    answer: string;
    isCorrect: boolean;
    responseTime: number;
    answeredAt: string;
  }[];
}

export interface BattleParticipant {
  id: number;
  battleId: number;
  userId: number;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  averageResponseTime: number;
  isReady: boolean;
  joinedAt?: string;
  leftAt?: string;
  answers?: {
    questionId: number;
    answer: string;
    isCorrect: boolean;
    responseTime: number;
    answeredAt: string;
  }[];
  user?: User;
}

export interface CreateBattleData {
  tournamentId: number;
  player1Id: number;
  player2Id: number;
  round: number;
}

export interface SubmitAnswerData {
  userId: number;
  questionNumber: number;
  answer: string;
}

// Battles API
export const battlesAPI = {
  create: async (data: CreateBattleData): Promise<Battle> => {
    const response: AxiosResponse<{ status: string; data: { battle: Battle } }> = await api.post('/battles', data);
    return response.data.data.battle;
  },

  getTournamentBattles: async (tournamentId: number): Promise<Battle[]> => {
    const response: AxiosResponse<{ status: string; data: { battles: Battle[] } }> = await api.get(`/battles/tournament/${tournamentId}`);
    return response.data.data.battles;
  },

  getById: async (id: number): Promise<Battle> => {
    const response: AxiosResponse<{ status: string; data: { battle: Battle } }> = await api.get(`/battles/${id}`);
    return response.data.data.battle;
  },

  start: async (id: number): Promise<Battle> => {
    const response: AxiosResponse<{ status: string; data: { battle: Battle } }> = await api.post(`/battles/${id}/start`);
    return response.data.data.battle;
  },

  submitAnswer: async (id: number, data: SubmitAnswerData): Promise<{ isCorrect: boolean; points: number; newScore: number }> => {
    const response: AxiosResponse<{ status: string; data: any }> = await api.post(`/battles/${id}/answer`, data);
    return response.data.data;
  },

  end: async (id: number): Promise<{ battle: Battle; winnerId: number | null; result: string }> => {
    const response: AxiosResponse<{ status: string; data: any }> = await api.post(`/battles/${id}/end`);
    return response.data.data;
  },

  generateBrackets: async (tournamentId: number): Promise<Battle[]> => {
    const response: AxiosResponse<{ status: string; data: { battles: Battle[] } }> = await api.post(`/battles/tournament/${tournamentId}/generate-brackets`);
    return response.data.data.battles;
  },

  getStats: async (id: number): Promise<{
    battleId: number;
    status: string;
    totalQuestions: number;
    completedQuestions: number;
    player1Score: number;
    player2Score: number;
    winnerId: number | null;
    timeRemaining: number;
  }> => {
    const response: AxiosResponse<{ status: string; data: any }> = await api.get(`/battles/${id}/stats`);
    return response.data.data;
  },
};

export { api };
export default api; 