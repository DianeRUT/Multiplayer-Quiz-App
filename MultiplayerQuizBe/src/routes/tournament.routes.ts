import { Router } from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';
import {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  joinTournament,
  startTournament
} from '../controllers/tournament.controller';

const router = Router();

router.use(protect);

// Public: List and get tournaments
router.get('/', getAllTournaments);
router.get('/:id', getTournamentById);

// Admin only: Create, update, delete
router.post('/', restrictTo(UserRole.ADMIN), createTournament);
router.put('/:id', restrictTo(UserRole.ADMIN), updateTournament);
router.delete('/:id', restrictTo(UserRole.ADMIN), deleteTournament);

// Authenticated: Join and start
router.post('/:id/join', joinTournament);
router.post('/:id/start', restrictTo(UserRole.ADMIN), startTournament);

export default router; 