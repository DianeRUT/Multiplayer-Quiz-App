import { Request, Response } from 'express';
import { battleService } from '../services/battle.service';

export const createBattle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tournamentId, player1Id, player2Id, round } = req.body;
    const battle = await battleService.createBattle(tournamentId, player1Id, player2Id, round);
    res.status(201).json({ status: 'success', data: { battle } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getTournamentBattles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    const battles = await battleService.getTournamentBattles(Number(tournamentId));
    res.status(200).json({ status: 'success', data: { battles } });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getBattleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const battle = await battleService.getBattleById(Number(id));
    if (!battle) {
      res.status(404).json({ status: 'error', message: 'Battle not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { battle } });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const startBattle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const battle = await battleService.startBattle(Number(id));
    res.status(200).json({ status: 'success', data: { battle } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const submitAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, questionNumber, answer } = req.body;
    const result = await battleService.submitAnswer(Number(id), userId, questionNumber, answer);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const endBattle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await battleService.endBattle(Number(id));
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const generateBrackets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    const battles = await battleService.generateBrackets(Number(tournamentId));
    res.status(200).json({ status: 'success', data: { battles } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getBattleStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const stats = await battleService.getBattleStats(Number(id));
    res.status(200).json({ status: 'success', data: stats });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
}; 