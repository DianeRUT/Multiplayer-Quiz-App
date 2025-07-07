// src/services/socket.service.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import * as gameService from './game.service';
import { Player } from '../models/player.model';
import { GameSession, GameStatus } from '../models/game.model';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { Option } from '../models/option.model';
import { Battle, BattleStatus } from '../models/battle.model';
import { Tournament } from '../models/tournament.model';
import { User } from '../models/user.model';

// Store server-side timers to manage them properly
const gameTimers: { [pin: string]: NodeJS.Timeout } = {};

export interface BattleUpdate {
  battleId: number;
  status: BattleStatus;
  player1Score?: number;
  player2Score?: number;
  currentQuestion?: number;
  timeRemaining?: number;
  winnerId?: number;
}

export interface TournamentUpdate {
  tournamentId: number;
  status: string;
  currentRound?: number;
  battlesCompleted?: number;
  totalBattles?: number;
}

export interface ChatMessage {
  battleId: number;
  userId: number;
  userName: string;
  message: string;
  timestamp: Date;
}

export class SocketService {
  private io: SocketIOServer;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      // Player joins a game lobby
      socket.on('join_game_lobby', async (data: { pin: string; playerName: string; playerId: number }) => {
        const { pin, playerName, playerId } = data;
        socket.join(pin);
        
        try {
          const gameSession = await gameService.getGameSessionByPin(pin);
          if (gameSession) {
            const players = await Player.findAll({ where: { gameSessionId: gameSession.id } });
            this.io.to(pin).emit('update_player_list', players);
          }
        } catch (error) {
          console.error('Error joining game lobby:', error);
        }
      });

      // Start game
      socket.on('start_game', async (pin: string) => {
        try {
          const game = await gameService.getGameSessionByPin(pin);
          if (game) {
            game.status = GameStatus.ACTIVE;
            await game.save();
            this.io.to(pin).emit('game_started');
            sendNextQuestion(this.io, pin);
          }
        } catch (error) {
          console.error('Error starting game:', error);
        }
      });

      // Join battle room
      socket.on('join-battle', (battleId: number) => {
        socket.join(`battle-${battleId}`);
        console.log(`👥 User ${socket.id} joined battle ${battleId}`);
      });

      // Leave battle room
      socket.on('leave-battle', (battleId: number) => {
        socket.leave(`battle-${battleId}`);
        console.log(`👋 User ${socket.id} left battle ${battleId}`);
      });

      // Join tournament room
      socket.on('join-tournament', (tournamentId: number) => {
        socket.join(`tournament-${tournamentId}`);
        console.log(`🏆 User ${socket.id} joined tournament ${tournamentId}`);
      });

      // Leave tournament room
      socket.on('leave-tournament', (tournamentId: number) => {
        socket.leave(`tournament-${tournamentId}`);
        console.log(`👋 User ${socket.id} left tournament ${tournamentId}`);
      });

      // Handle chat messages
      socket.on('chat-message', (data: ChatMessage) => {
        this.broadcastChatMessage(data);
      });

      // Handle battle actions
      socket.on('battle-action', (data: { battleId: number; action: string; userId: number }) => {
        console.log(`⚔️ Battle action: ${data.action} for battle ${data.battleId}`);
        this.broadcastBattleAction(data);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
      });
    });
  }

  // Battle Updates
  public broadcastBattleUpdate(battleUpdate: BattleUpdate) {
    console.log('📡 Broadcasting battle update:', battleUpdate);
    this.io.to(`battle-${battleUpdate.battleId}`).emit('battle-update', battleUpdate);
  }

  public broadcastBattleStarted(battleId: number) {
    console.log('🚀 Broadcasting battle started:', battleId);
    this.io.to(`battle-${battleId}`).emit('battle-started', { battleId });
  }

  public broadcastBattleEnded(battleId: number, winnerId: number | null) {
    console.log('🏁 Broadcasting battle ended:', battleId, winnerId);
    this.io.to(`battle-${battleId}`).emit('battle-ended', { battleId, winnerId });
  }

  public broadcastScoreUpdate(battleId: number, player1Score: number, player2Score: number) {
    console.log('📊 Broadcasting score update:', battleId, player1Score, player2Score);
    this.io.to(`battle-${battleId}`).emit('score-update', {
      battleId,
      player1Score,
      player2Score
    });
  }

  public broadcastQuestionUpdate(battleId: number, questionNumber: number, timeRemaining: number) {
    console.log('❓ Broadcasting question update:', battleId, questionNumber, timeRemaining);
    this.io.to(`battle-${battleId}`).emit('question-update', {
      battleId,
      questionNumber,
      timeRemaining
    });
  }

  // Tournament Updates
  public broadcastTournamentUpdate(tournamentUpdate: TournamentUpdate) {
    console.log('🏆 Broadcasting tournament update:', tournamentUpdate);
    this.io.to(`tournament-${tournamentUpdate.tournamentId}`).emit('tournament-update', tournamentUpdate);
  }

  public broadcastBracketUpdate(tournamentId: number, battles: Battle[]) {
    console.log('📋 Broadcasting bracket update:', tournamentId);
    this.io.to(`tournament-${tournamentId}`).emit('bracket-update', {
      tournamentId,
      battles
    });
  }

  public broadcastTournamentStarted(tournamentId: number) {
    console.log('🚀 Broadcasting tournament started:', tournamentId);
    this.io.to(`tournament-${tournamentId}`).emit('tournament-started', { tournamentId });
  }

  public broadcastTournamentEnded(tournamentId: number, winnerId: number | null) {
    console.log('🏆 Broadcasting tournament ended:', tournamentId, winnerId);
    this.io.to(`tournament-${tournamentId}`).emit('tournament-ended', { tournamentId, winnerId });
  }

  // Chat System
  public broadcastChatMessage(message: ChatMessage) {
    console.log('💬 Broadcasting chat message:', message);
    this.io.to(`battle-${message.battleId}`).emit('chat-message', message);
  }

  // Battle Actions
  public broadcastBattleAction(data: { battleId: number; action: string; userId: number }) {
    console.log('⚔️ Broadcasting battle action:', data);
    this.io.to(`battle-${data.battleId}`).emit('battle-action', data);
  }

  // Notifications
  public broadcastNotification(userId: number, notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    console.log('🔔 Broadcasting notification to user:', userId, notification);
    this.io.to(`user-${userId}`).emit('notification', notification);
  }

  // Admin Notifications
  public broadcastAdminNotification(notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    console.log('👑 Broadcasting admin notification:', notification);
    this.io.to('admin').emit('admin-notification', notification);
  }

  // Get connected clients count
  public getConnectedClients(): number {
    return this.io.engine.clientsCount;
  }

  // Get room members count
  public getRoomMembers(room: string): number {
    const roomMembers = this.io.sockets.adapter.rooms.get(room);
    return roomMembers ? roomMembers.size : 0;
  }
}

// Helper function for sending next question
const sendNextQuestion = async (io: SocketIOServer, pin: string) => {
  // Clear any previous timer for this game
  if (gameTimers[pin]) clearTimeout(gameTimers[pin]);

  try {
    const gameSession = await gameService.getGameSessionByPin(pin);
    if (!gameSession || gameSession.status !== GameStatus.ACTIVE) return;

    const questions = await Question.findAll({
      where: { quizId: gameSession.quizId },
      include: [{ model: Option }],
      order: [['createdAt', 'ASC']]
    });

    if (questions.length === 0) {
      // No questions available
      io.to(pin).emit('game_error', { message: 'No questions available for this quiz' });
      return;
    }

    const currentQuestionIndex = gameSession.currentQuestionIndex || 0;
    
    if (currentQuestionIndex >= questions.length) {
      // Game finished
      gameSession.status = GameStatus.FINISHED;
      await gameSession.save();
      
      const players = await Player.findAll({
        where: { gameSessionId: gameSession.id },
        order: [['score', 'DESC']]
      });
      
      io.to(pin).emit('game_finished', { players });
      return;
    }

    const question = questions[currentQuestionIndex];
    
    // Send question to all players
    io.to(pin).emit('new_question', {
      question: {
        id: question.id,
        text: question.text,
        options: question.options.map(opt => ({
          id: opt.id,
          text: opt.text
        }))
      },
      questionNumber: currentQuestionIndex + 1,
      totalQuestions: questions.length
    });

    // Update game session
    gameSession.currentQuestionIndex = currentQuestionIndex + 1;
    await gameSession.save();

    // Set timer for question
    gameTimers[pin] = setTimeout(async () => {
      // Time's up - show correct answer
      const correctOption = question.options.find(opt => opt.isCorrect);
      io.to(pin).emit('question_timeout', {
        correctAnswer: correctOption?.text,
        questionId: question.id
      });

      // Show leaderboard for 15 seconds
      setTimeout(() => {
        const players = Player.findAll({
          where: { gameSessionId: gameSession.id },
          order: [['score', 'DESC']]
        });
        io.to(pin).emit('show_leaderboard', { players });

        // Wait 5 seconds on the leaderboard screen before the next question
        setTimeout(() => {
          sendNextQuestion(io, pin);
        }, 5000);

      }, 15000); // 15 seconds to answer
    }, 15000); // 15 seconds to answer
  } catch (error) {
    console.error('Error sending next question:', error);
  }
};

export let socketService: SocketService;

export const initializeSocketService = (server: HTTPServer) => {
  socketService = new SocketService(server);
  return socketService;
};