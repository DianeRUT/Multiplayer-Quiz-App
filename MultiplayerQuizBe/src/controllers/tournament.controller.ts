import { Request, Response } from 'express';
import { tournamentService } from '../services/tournament.service';

export const createTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const tournament = await tournamentService.createTournament(req.body);
    res.status(201).json({ status: 'success', data: { tournament } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getAllTournaments = async (req: Request, res: Response): Promise<void> => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.status(200).json({ status: 'success', data: { tournaments } });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getTournamentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tournament = await tournamentService.getTournamentById(Number(id));
    if (!tournament) {
      res.status(404).json({ status: 'error', message: 'Tournament not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { tournament } });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tournament = await tournamentService.updateTournament(Number(id), req.body);
    res.status(200).json({ status: 'success', data: { tournament } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await tournamentService.deleteTournament(Number(id));
    res.status(200).json({ status: 'success', message: 'Tournament deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const joinTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const result = await tournamentService.joinTournament(Number(id), userId);
    res.status(200).json({ status: 'success', ...result });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const startTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tournament = await tournamentService.startTournament(Number(id));
    res.status(200).json({ status: 'success', data: { tournament } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
}; 