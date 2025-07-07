import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { GameSession } from '../models/game.model';
import { Tournament } from '../models/tournament.model';
import { Battle } from '../models/battle.model';

// Dashboard Statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get counts from database using Sequelize
    const [
      totalUsers,
      totalQuizzes,
      totalQuestions,
      activeGames,
      totalTournaments,
      activeTournaments,
      totalBattles,
      activeBattles
    ] = await Promise.all([
      User.count(),
      Quiz.count(),
      Question.count(),
      GameSession.count({ where: { status: ['LOBBY', 'ACTIVE'] } }),
      Tournament.count(),
      Tournament.count({ where: { status: 'ACTIVE' } }),
      Battle.count(),
      Battle.count({ where: { status: ['WAITING', 'ACTIVE'] } })
    ]);

    // Calculate growth rates (mock data for now - you can implement real calculations)
    const userGrowth = { period: 'month', growth: 5.2 };
    const gameGrowth = { period: 'month', growth: 12.8 };
    const questionGrowth = { period: 'month', growth: 8.4 };
    const engagementRate = { period: 'month', rate: 75.6 };

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalQuizzes,
        totalQuestions,
        activeGames,
        totalTournaments,
        activeTournaments,
        totalBattles,
        activeBattles,
        userGrowth,
        gameGrowth,
        questionGrowth,
        engagementRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error });
  }
};

// Active Games
export const getActiveGames = async (req: Request, res: Response) => {
  try {
    const activeGames = await GameSession.findAll({ 
      where: { status: ['LOBBY', 'ACTIVE'] },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          include: [{ model: require('../models/category.model').Category, as: 'category' }]
        },
        {
          model: require('../models/player.model').Player,
          as: 'players',
          include: [{ model: User, as: 'user' }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const formattedGames = activeGames.map((game: any) => ({
      id: game.id,
      name: game.quiz?.title || 'Unknown Quiz',
      players: game.players?.length || 0,
      status: game.status,
      category: game.quiz?.category?.name || 'General',
      quizId: game.quizId,
      createdAt: game.createdAt
    }));

    res.status(200).json({
      status: 'success',
      data: {
        games: formattedGames
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active games', error });
  }
};

// Recent Activity
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Get recent activities from various sources
    const [
      recentQuizzes,
      recentGames,
      recentUsers,
      recentTournaments
    ] = await Promise.all([
      Quiz.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: User, as: 'creator' }]
      }),
      GameSession.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: Quiz, as: 'quiz' }]
      }),
      User.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      Tournament.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: User, as: 'creator' }]
      })
    ]);

    const activities: any[] = [];

    // Add quiz activities
    recentQuizzes.forEach((quiz: any) => {
      activities.push({
        id: quiz.id,
        user: quiz.creator?.name || 'Unknown User',
        action: `created quiz "${quiz.title}"`,
        time: quiz.createdAt,
        type: 'QUIZ',
        entityId: quiz.id
      });
    });

    // Add game activities
    recentGames.forEach((game: any) => {
      activities.push({
        id: game.id,
        user: 'System',
        action: `started game "${game.quiz?.title || 'Unknown Quiz'}"`,
        time: game.createdAt,
        type: 'GAME',
        entityId: game.id
      });
    });

    // Add user activities
    recentUsers.forEach((user: any) => {
      activities.push({
        id: user.id,
        user: user.name,
        action: 'joined the platform',
        time: user.createdAt,
        type: 'USER',
        entityId: user.id
      });
    });

    // Add tournament activities
    recentTournaments.forEach((tournament: any) => {
      activities.push({
        id: tournament.id,
        user: tournament.creator?.name || 'Unknown User',
        action: `created tournament "${tournament.name}"`,
        time: tournament.createdAt,
        type: 'TOURNAMENT',
        entityId: tournament.id
      });
    });

    // Sort by time and limit
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const limitedActivities = activities.slice(0, limit);

    res.status(200).json({
      status: 'success',
      data: {
        activities: limitedActivities
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent activity', error });
  }
};

// User Growth Data
export const getUserGrowth = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    
    // Get user registration data for the last N days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const users = await User.findAll({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: startDate,
          [require('sequelize').Op.lte]: endDate
        }
      },
      attributes: ['createdAt']
    });

    // Group users by date
    const userCounts: { [key: string]: number } = {};
    const totalUsers: { [key: string]: number } = {};

    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      userCounts[dateStr] = 0;
      totalUsers[dateStr] = 0;
    }

    // Count new users per day
    users.forEach((user: any) => {
      const dateStr = user.createdAt.toISOString().split('T')[0];
      if (userCounts[dateStr] !== undefined) {
        userCounts[dateStr]++;
      }
    });

    // Calculate cumulative totals and growth
    let cumulative = 0;
    const growthData = Object.keys(userCounts).map(date => {
      cumulative += userCounts[date];
      totalUsers[date] = cumulative;
      
      // Calculate growth percentage (mock calculation)
      const growth = Math.floor(Math.random() * 20) - 10; // Random growth for demo
      
      return {
        date,
        users: cumulative,
        growth
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        growthData
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user growth', error });
  }
};

// Game Statistics
export const getGameStats = async (req: Request, res: Response) => {
  try {
    const [
      totalGames,
      activeGames,
      completedGames,
      gamesWithPlayers
    ] = await Promise.all([
      GameSession.count(),
      GameSession.count({ where: { status: 'ACTIVE' } }),
      GameSession.count({ where: { status: 'FINISHED' } }),
      GameSession.findAll({
        include: [{ model: require('../models/player.model').Player, as: 'players' }]
      })
    ]);

    // Calculate average players
    const totalPlayers = gamesWithPlayers.reduce((sum: number, game: any) => 
      sum + (game.players?.length || 0), 0
    );
    const averagePlayers = totalGames > 0 ? totalPlayers / totalGames : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalGames,
        activeGames,
        completedGames,
        averagePlayers: Math.round(averagePlayers * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game stats', error });
  }
};

// Tournament Statistics
export const getTournamentStats = async (req: Request, res: Response) => {
  try {
    const [
      totalTournaments,
      activeTournaments,
      completedTournaments,
      tournamentsWithParticipants
    ] = await Promise.all([
      Tournament.count(),
      Tournament.count({ where: { status: 'ACTIVE' } }),
      Tournament.count({ where: { status: 'FINISHED' } }),
      Tournament.findAll()
    ]);

    // Calculate average participants
    const totalParticipants = tournamentsWithParticipants.reduce((sum: number, tournament: any) => 
      sum + (tournament.currentParticipants || 0), 0
    );
    const averageParticipants = totalTournaments > 0 ? totalParticipants / totalTournaments : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalTournaments,
        activeTournaments,
        completedTournaments,
        averageParticipants: Math.round(averageParticipants * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tournament stats', error });
  }
};

// Connection Status
export const getConnectionStatus = async (req: Request, res: Response) => {
  try {
    // This would typically connect to your WebSocket server
    // For now, return mock data
    const connected = true;
    const clients = Math.floor(Math.random() * 50) + 10; // Mock client count

    res.status(200).json({
      status: 'success',
      data: {
        connected,
        clients
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch connection status', error });
  }
}; 