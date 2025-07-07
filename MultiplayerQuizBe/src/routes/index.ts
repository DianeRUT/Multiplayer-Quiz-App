// src/routes/index.ts
import { Router } from 'express';
import authRouter from './auth.routes';
import quizRouter from './quiz.routes';
import gameRouter from './game.routes';
import categoryRouter from './category.routes';
import aiRouter from './ai.routes';
import questionRouter from './question.routes';
import userRouter from './user.routes';
import tournamentRouter from './tournament.routes';
import battleRouter from './battle.routes';
import dashboardRouter from './dashboard.routes';
import notificationRouter from './notification.routes';

const router = Router();

console.log('🔧 Loading routes...');

console.log('📝 Loading auth routes...');
router.use('/auth', authRouter);

console.log('📝 Loading quiz routes...');
router.use('/quizzes', quizRouter);

console.log('📝 Loading game routes...');
router.use('/games', gameRouter);

console.log('📝 Loading category routes...');
router.use('/categories', categoryRouter);

console.log('📝 Loading AI routes...');
router.use('/ai', aiRouter);

console.log('📝 Loading question routes...');
router.use('/questions', questionRouter);

console.log('📝 Loading user routes...');
router.use('/users', userRouter);

console.log('📝 Loading tournament routes...');
router.use('/tournaments', tournamentRouter);

console.log('📝 Loading battle routes...');
router.use('/battles', battleRouter);

console.log('📝 Loading dashboard routes...');
router.use('/admin/dashboard', dashboardRouter);

console.log('📝 Loading notification routes...');
router.use('/notifications', notificationRouter);

console.log('✅ All routes loaded successfully!');

export default router;