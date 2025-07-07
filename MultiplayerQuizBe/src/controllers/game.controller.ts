// src/controllers/game.controller.ts
import { Request, Response } from 'express';
import { GameSession } from '../models/game.model';
import { Quiz } from '../models/quiz.model';
import { User } from '../models/user.model';

// Get all games
export const getAllGames = async (req: Request, res: Response) => {
  try {
    const games = await GameSession.findAll({
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
      order: [['createdAt', 'DESC']]
    });

    const formattedGames = games.map((game: any) => ({
      id: game.id,
      pin: game.pin,
      status: game.status,
      currentQuestionIndex: game.currentQuestionIndex,
      quiz: {
        id: game.quiz?.id,
        title: game.quiz?.title,
        category: game.quiz?.category?.name
      },
      players: game.players?.map((player: any) => ({
        id: player.id,
        name: player.user?.name,
        score: player.score
      })) || [],
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    }));

    res.status(200).json({
      status: 'success',
      data: {
        games: formattedGames
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch games', error });
  }
};

// Get game by ID
export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const game = await GameSession.findByPk(id, {
      include: [
        {
          model: Quiz,
          as: 'quiz',
          include: [
            { model: require('../models/category.model').Category, as: 'category' },
            { model: require('../models/question.model').Question, as: 'questions' }
          ]
        },
        {
          model: require('../models/player.model').Player,
          as: 'players',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const formattedGame = {
      id: game.id,
      pin: game.pin,
      status: game.status,
      currentQuestionIndex: game.currentQuestionIndex,
      quiz: {
        id: game.quiz?.id,
        title: game.quiz?.title,
        category: game.quiz?.category?.name,
        questions: game.quiz?.questions?.length || 0
      },
      players: game.players?.map((player: any) => ({
        id: player.id,
        name: player.user?.name,
        score: player.score,
        joinedAt: player.createdAt
      })) || [],
      createdAt: game.createdAt,
      updatedAt: game.updatedAt
    };

    res.status(200).json({
      status: 'success',
      data: {
        game: formattedGame
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game', error });
  }
};

// Create new game
export const createGame = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.body;
    
    // Generate a unique 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    
    const game = await GameSession.create({
      pin,
      quizId,
      status: 'LOBBY',
      currentQuestionIndex: -1
    });

    res.status(201).json({
      status: 'success',
      data: {
        game: {
          id: game.id,
          pin: game.pin,
          status: game.status,
          quizId: game.quizId
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create game', error });
  }
};

// Update game status
export const updateGameStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, currentQuestionIndex } = req.body;
    
    const game = await GameSession.findByPk(id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    await game.update({
      status,
      currentQuestionIndex: currentQuestionIndex !== undefined ? currentQuestionIndex : game.currentQuestionIndex
    });

    res.status(200).json({
      status: 'success',
      data: {
        game: {
          id: game.id,
          status: game.status,
          currentQuestionIndex: game.currentQuestionIndex
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update game', error });
  }
};

// Delete game
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const game = await GameSession.findByPk(id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    await game.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Game deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete game', error });
  }
};