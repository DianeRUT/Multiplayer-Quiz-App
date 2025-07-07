// src/services/game.service.ts
import { GameSession } from '../models/game.model';
import { Player } from '../models/player.model';
import { generateUniquePin } from '../utilities/pin.utils';

export const createGameSession = async (quizId: number) => {
  const pin = await generateUniquePin();
  const gameSession = await GameSession.create({ quizId, pin });
  return gameSession;
};

export const getGameSessionByPin = async (pin: string) => {
  const gameSession = await GameSession.findOne({ where: { pin } });
  return gameSession;
};

export const joinGameSession = async (pin: string, nickname: string) => {
  const gameSession = await GameSession.findOne({ where: { pin, status: 'LOBBY' } });
  if (!gameSession) {
    throw new Error('Game not found or has already started');
  }

  // Optional: Check if nickname is already taken in this session
  const existingPlayer = await Player.findOne({ where: { nickname, gameSessionId: gameSession.id } });
  if (existingPlayer) {
      throw new Error('This nickname is already taken for this game.');
  }

  const player = await Player.create({ nickname, gameSessionId: gameSession.id });
  return { player, gameSession };
};