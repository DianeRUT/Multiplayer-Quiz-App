import { Router } from 'express';
import {
  createBattle,
  getTournamentBattles,
  getBattleById,
  startBattle,
  submitAnswer,
  endBattle,
  generateBrackets,
  getBattleStats
} from '../controllers/battle.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// All battle routes require authentication
router.use(protect);

// Battle CRUD operations
router.post('/', createBattle);
router.get('/tournament/:tournamentId', getTournamentBattles);
router.get('/:id', getBattleById);
router.get('/:id/stats', getBattleStats);

// Battle actions
router.post('/:id/start', startBattle);
router.post('/:id/answer', submitAnswer);
router.post('/:id/end', endBattle);

// Tournament bracket generation
router.post('/tournament/:tournamentId/generate-brackets', generateBrackets);

export default router; 