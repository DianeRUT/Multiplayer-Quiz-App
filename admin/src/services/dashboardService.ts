import { api } from './api';

export interface DashboardStats {
  totalUsers: number;
  totalQuizzes: number;
  totalQuestions: number;
  activeGames: number;
  totalTournaments: number;
  activeTournaments: number;
  totalBattles: number;
  activeBattles: number;
  userGrowth: {
    period: string;
    growth: number;
  };
  gameGrowth: {
    period: string;
    growth: number;
  };
  questionGrowth: {
    period: string;
    growth: number;
  };
  engagementRate: {
    period: string;
    rate: number;
  };
}

export interface ActiveGame {
  id: number;
  name: string;
  players: number;
  status: 'WAITING' | 'ACTIVE' | 'FINISHED' | 'LOBBY';
  category: string;
  quizId: number;
  createdAt: string;
}

export interface RecentActivity {
  id: number;
  user: string;
  action: string;
  time: string;
  avatar?: string;
  type: 'USER' | 'GAME' | 'QUIZ' | 'TOURNAMENT' | 'BATTLE';
  entityId?: number;
}

export interface UserGrowthData {
  date: string;
  users: number;
  growth: number;
}

export interface GameStats {
  totalGames: number;
  activeGames: number;
  completedGames: number;
  averagePlayers: number;
}

export interface TournamentStats {
  totalTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  averageParticipants: number;
}

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if API fails
      return {
        totalUsers: 0,
        totalQuizzes: 0,
        totalQuestions: 0,
        activeGames: 0,
        totalTournaments: 0,
        activeTournaments: 0,
        totalBattles: 0,
        activeBattles: 0,
        userGrowth: { period: 'month', growth: 0 },
        gameGrowth: { period: 'month', growth: 0 },
        questionGrowth: { period: 'month', growth: 0 },
        engagementRate: { period: 'month', rate: 0 }
      };
    }
  },

  // Get active games
  getActiveGames: async (): Promise<ActiveGame[]> => {
    try {
      const response = await api.get('/admin/dashboard/active-games');
      return response.data.data.games || [];
    } catch (error) {
      console.error('Error fetching active games:', error);
      return [];
    }
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    try {
      const response = await api.get(`/admin/dashboard/recent-activity?limit=${limit}`);
      return response.data.data.activities || [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  // Get user growth data
  getUserGrowth: async (days: number = 30): Promise<UserGrowthData[]> => {
    try {
      const response = await api.get(`/admin/dashboard/user-growth?days=${days}`);
      return response.data.data.growthData || [];
    } catch (error) {
      console.error('Error fetching user growth:', error);
      return [];
    }
  },

  // Get game statistics
  getGameStats: async (): Promise<GameStats> => {
    try {
      const response = await api.get('/admin/dashboard/game-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching game stats:', error);
      return {
        totalGames: 0,
        activeGames: 0,
        completedGames: 0,
        averagePlayers: 0
      };
    }
  },

  // Get tournament statistics
  getTournamentStats: async (): Promise<TournamentStats> => {
    try {
      const response = await api.get('/admin/dashboard/tournament-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tournament stats:', error);
      return {
        totalTournaments: 0,
        activeTournaments: 0,
        completedTournaments: 0,
        averageParticipants: 0
      };
    }
  },

  // Get connection status
  getConnectionStatus: async () => {
    try {
      const response = await api.get('/admin/dashboard/connection-status');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching connection status:', error);
      return {
        connected: false,
        clients: 0
      };
    }
  }
}; 