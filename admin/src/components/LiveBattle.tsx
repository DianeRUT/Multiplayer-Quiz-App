import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from './ui/separator';
import socketService from '../services/socketService';
import { BattleUpdate, ChatMessage } from '../services/socketService';

interface LiveBattleProps {
  battleId: number;
  onClose: () => void;
}

interface BattleState {
  status: string;
  player1Score: number;
  player2Score: number;
  currentQuestion: number;
  timeRemaining: number;
  winnerId?: number;
}

const LiveBattle: React.FC<LiveBattleProps> = ({ battleId, onClose }) => {
  const [battleState, setBattleState] = useState<BattleState>({
    status: 'WAITING',
    player1Score: 0,
    player2Score: 0,
    currentQuestion: 0,
    timeRemaining: 30
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Join battle room
    socketService.joinBattle(battleId);

    // Listen for battle updates
    const handleBattleUpdate = (data: BattleUpdate) => {
      if (data.battleId === battleId) {
        setBattleState(prev => ({
          ...prev,
          status: data.status,
          player1Score: data.player1Score || prev.player1Score,
          player2Score: data.player2Score || prev.player2Score,
          currentQuestion: data.currentQuestion || prev.currentQuestion,
          timeRemaining: data.timeRemaining || prev.timeRemaining,
          winnerId: data.winnerId
        }));
      }
    };

    const handleBattleStarted = (data: { battleId: number }) => {
      if (data.battleId === battleId) {
        setBattleState(prev => ({ ...prev, status: 'ACTIVE' }));
      }
    };

    const handleBattleEnded = (data: { battleId: number; winnerId: number | null }) => {
      if (data.battleId === battleId) {
        setBattleState(prev => ({ 
          ...prev, 
          status: 'FINISHED',
          winnerId: data.winnerId || undefined
        }));
      }
    };

    const handleScoreUpdate = (data: { battleId: number; player1Score: number; player2Score: number }) => {
      if (data.battleId === battleId) {
        setBattleState(prev => ({
          ...prev,
          player1Score: data.player1Score,
          player2Score: data.player2Score
        }));
      }
    };

    const handleQuestionUpdate = (data: { battleId: number; questionNumber: number; timeRemaining: number }) => {
      if (data.battleId === battleId) {
        setBattleState(prev => ({
          ...prev,
          currentQuestion: data.questionNumber,
          timeRemaining: data.timeRemaining
        }));
      }
    };

    const handleChatMessage = (data: ChatMessage) => {
      if (data.battleId === battleId) {
        setChatMessages(prev => [...prev, data]);
      }
    };

    const handleConnectionStatus = () => {
      setIsConnected(socketService.isSocketConnected());
    };

    // Subscribe to events
    socketService.on('battle-update', handleBattleUpdate);
    socketService.on('battle-started', handleBattleStarted);
    socketService.on('battle-ended', handleBattleEnded);
    socketService.on('score-update', handleScoreUpdate);
    socketService.on('question-update', handleQuestionUpdate);
    socketService.on('chat-message', handleChatMessage);

    // Check connection status
    handleConnectionStatus();

    // Cleanup
    return () => {
      socketService.off('battle-update', handleBattleUpdate);
      socketService.off('battle-started', handleBattleStarted);
      socketService.off('battle-ended', handleBattleEnded);
      socketService.off('score-update', handleScoreUpdate);
      socketService.off('question-update', handleQuestionUpdate);
      socketService.off('chat-message', handleChatMessage);
      socketService.leaveBattle(battleId);
    };
  }, [battleId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        battleId,
        userId: 1, // Admin user ID
        userName: 'Admin',
        message: newMessage.trim(),
        timestamp: new Date()
      };
      socketService.sendChatMessage(message);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'FINISHED': return 'bg-blue-500';
      case 'WAITING': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'In Progress';
      case 'FINISHED': return 'Finished';
      case 'WAITING': return 'Waiting';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Live Battle #{battleId}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(90vh-120px)]">
          {/* Battle Status */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Battle Status
                  <Badge className={getStatusColor(battleState.status)}>
                    {getStatusText(battleState.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{battleState.player1Score}</div>
                    <div className="text-sm text-gray-600">Player 1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{battleState.player2Score}</div>
                    <div className="text-sm text-gray-600">Player 2</div>
                  </div>
                </div>
                
                {battleState.status === 'ACTIVE' && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Question {battleState.currentQuestion}</span>
                      <span>{battleState.timeRemaining}s</span>
                    </div>
                    <Progress 
                      value={(battleState.timeRemaining / 30) * 100} 
                      className="h-2"
                    />
                  </div>
                )}

                {battleState.status === 'FINISHED' && battleState.winnerId && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-lg font-semibold text-green-800">
                      Winner: Player {battleState.winnerId}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Battle Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Battle Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => socketService.sendBattleAction(battleId, 'start', 1)}
                    disabled={battleState.status !== 'WAITING'}
                  >
                    Start Battle
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => socketService.sendBattleAction(battleId, 'pause', 1)}
                    disabled={battleState.status !== 'ACTIVE'}
                  >
                    Pause
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => socketService.sendBattleAction(battleId, 'end', 1)}
                    disabled={battleState.status === 'FINISHED'}
                  >
                    End Battle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-semibold text-blue-600">{message.userName}:</span>
                    <span className="ml-2">{message.message}</span>
                    <div className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button onClick={sendMessage} size="sm">Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveBattle; 