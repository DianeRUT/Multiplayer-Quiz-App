import { io, Socket } from 'socket.io-client';

export interface BattleUpdate {
  battleId: number;
  status: string;
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

export interface Notification {
  type: string;
  title: string;
  message: string;
  data?: any;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io('http://localhost:3000', {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🔌 Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
    });

    // Battle events
    this.socket.on('battle-update', (data: BattleUpdate) => {
      console.log('📡 Battle update received:', data);
      this.emit('battle-update', data);
    });

    this.socket.on('battle-started', (data: { battleId: number }) => {
      console.log('🚀 Battle started:', data);
      this.emit('battle-started', data);
    });

    this.socket.on('battle-ended', (data: { battleId: number; winnerId: number | null }) => {
      console.log('🏁 Battle ended:', data);
      this.emit('battle-ended', data);
    });

    this.socket.on('score-update', (data: { battleId: number; player1Score: number; player2Score: number }) => {
      console.log('📊 Score update:', data);
      this.emit('score-update', data);
    });

    this.socket.on('question-update', (data: { battleId: number; questionNumber: number; timeRemaining: number }) => {
      console.log('❓ Question update:', data);
      this.emit('question-update', data);
    });

    // Tournament events
    this.socket.on('tournament-update', (data: TournamentUpdate) => {
      console.log('🏆 Tournament update:', data);
      this.emit('tournament-update', data);
    });

    this.socket.on('bracket-update', (data: { tournamentId: number; battles: any[] }) => {
      console.log('📋 Bracket update:', data);
      this.emit('bracket-update', data);
    });

    this.socket.on('tournament-started', (data: { tournamentId: number }) => {
      console.log('🚀 Tournament started:', data);
      this.emit('tournament-started', data);
    });

    this.socket.on('tournament-ended', (data: { tournamentId: number; winnerId: number | null }) => {
      console.log('🏆 Tournament ended:', data);
      this.emit('tournament-ended', data);
    });

    // Chat events
    this.socket.on('chat-message', (data: ChatMessage) => {
      console.log('💬 Chat message:', data);
      this.emit('chat-message', data);
    });

    // Battle actions
    this.socket.on('battle-action', (data: { battleId: number; action: string; userId: number }) => {
      console.log('⚔️ Battle action:', data);
      this.emit('battle-action', data);
    });

    // Notifications
    this.socket.on('notification', (data: Notification) => {
      console.log('🔔 Notification:', data);
      this.emit('notification', data);
    });

    this.socket.on('admin-notification', (data: Notification) => {
      console.log('👑 Admin notification:', data);
      this.emit('admin-notification', data);
    });
  }

  // Connection management
  public connect() {
    if (this.socket && !this.isConnected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Room management
  public joinBattle(battleId: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-battle', battleId);
      console.log(`👥 Joined battle room: ${battleId}`);
    }
  }

  public leaveBattle(battleId: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-battle', battleId);
      console.log(`👋 Left battle room: ${battleId}`);
    }
  }

  public joinTournament(tournamentId: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-tournament', tournamentId);
      console.log(`🏆 Joined tournament room: ${tournamentId}`);
    }
  }

  public leaveTournament(tournamentId: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-tournament', tournamentId);
      console.log(`👋 Left tournament room: ${tournamentId}`);
    }
  }

  // Chat functionality
  public sendChatMessage(message: ChatMessage) {
    if (this.socket && this.isConnected) {
      this.socket.emit('chat-message', message);
    }
  }

  // Battle actions
  public sendBattleAction(battleId: number, action: string, userId: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('battle-action', { battleId, action, userId });
    }
  }

  // Event listeners
  private listeners: { [event: string]: Function[] } = {};

  public on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback?: Function) {
    if (!this.listeners[event]) return;
    
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      delete this.listeners[event];
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  public getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 