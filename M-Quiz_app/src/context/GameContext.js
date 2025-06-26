import React, { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from './AuthContext';

export const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState({
    pin: null, players: [], currentQuestion: null, status: 'idle', results: null,
  });

  useEffect(() => {
    if (!user) return;
    const handlePlayerUpdate = (players) => setGameState(p => ({ ...p, players }));
    const handleGameStart = (q) => setGameState(p => ({ ...p, status: 'in-progress', currentQuestion: q }));
    const handleNextQuestion = (q) => setGameState(p => ({ ...p, currentQuestion: q }));
    const handleGameOver = (res) => setGameState(p => ({ ...p, status: 'results', results: res }));
    const handleGameError = (msg) => { alert(`Game Error: ${msg}`); resetGame(); };

    socketService.on('update-players', handlePlayerUpdate);
    socketService.on('game-started', handleGameStart);
    socketService.on('next-question', handleNextQuestion);
    socketService.on('game-over', handleGameOver);
    socketService.on('game-error', handleGameError);

    return () => {
      socketService.off('update-players'); socketService.off('game-started');
      socketService.off('next-question'); socketService.off('game-over');
      socketService.off('game-error');
    };
  }, [user]);

  // This function correctly sets the initial lobby state.
  const hostGame = (pin) => {
    setGameState({
      pin: pin,
      status: 'lobby',
      players: user ? [user] : [], // This ensures players is an array with the host
      currentQuestion: null,
      results: null,
    });
  };

  const joinGame = (pin) => {
    socketService.emit('player-join', { pin });
    setGameState(prevState => ({ ...prevState, pin, status: 'lobby' }));
  };

  const startGame = () => socketService.emit('start-game', { pin: gameState.pin });
  const submitAnswer = (answer) => socketService.emit('submit-answer', { pin: gameState.pin, ...answer });
  const resetGame = () => {
    setGameState({ pin: null, players: [], currentQuestion: null, status: 'idle', results: null });
  };

  const contextValue = { gameState, hostGame, joinGame, startGame, submitAnswer, resetGame };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);