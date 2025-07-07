import { Router } from 'express';
import {
  getDashboardStats,
  getActiveGames,
  getRecentActivity,
  getUserGrowth,
  getGameStats,
  getTournamentStats,
  getConnectionStatus
} from '../controllers/dashboard.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for admin dashboard statistics and data
 */

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                     totalQuizzes:
 *                       type: number
 *                     totalQuestions:
 *                       type: number
 *                     activeGames:
 *                       type: number
 *                     totalTournaments:
 *                       type: number
 *                     activeTournaments:
 *                       type: number
 *                     totalBattles:
 *                       type: number
 *                     activeBattles:
 *                       type: number
 *                     userGrowth:
 *                       type: object
 *                     gameGrowth:
 *                       type: object
 *                     questionGrowth:
 *                       type: object
 *                     engagementRate:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/stats', protect, restrictTo(UserRole.ADMIN), getDashboardStats);

/**
 * @swagger
 * /admin/dashboard/active-games:
 *   get:
 *     summary: Get active games
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active games retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/active-games', protect, restrictTo(UserRole.ADMIN), getActiveGames);

/**
 * @swagger
 * /admin/dashboard/recent-activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of activities to return
 *     responses:
 *       200:
 *         description: Recent activity retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/recent-activity', protect, restrictTo(UserRole.ADMIN), getRecentActivity);

/**
 * @swagger
 * /admin/dashboard/user-growth:
 *   get:
 *     summary: Get user growth data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: User growth data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/user-growth', protect, restrictTo(UserRole.ADMIN), getUserGrowth);

/**
 * @swagger
 * /admin/dashboard/game-stats:
 *   get:
 *     summary: Get game statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Game statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/game-stats', protect, restrictTo(UserRole.ADMIN), getGameStats);

/**
 * @swagger
 * /admin/dashboard/tournament-stats:
 *   get:
 *     summary: Get tournament statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tournament statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/tournament-stats', protect, restrictTo(UserRole.ADMIN), getTournamentStats);

/**
 * @swagger
 * /admin/dashboard/connection-status:
 *   get:
 *     summary: Get real-time connection status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connection status retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/connection-status', protect, restrictTo(UserRole.ADMIN), getConnectionStatus);

export default router; 