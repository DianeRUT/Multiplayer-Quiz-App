// src/controllers/quiz.controller.ts
import { Response, Request } from 'express';
import * as quizService from '../services/quiz.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { QuizStatus } from '../models/quiz.model';
import { User } from '../models/user.model';
import { Quiz } from '../models/quiz.model';
import { Category } from '../models/category.model';

export const createNewQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log('Quiz controller reached!');
  // --- Get categoryName from the body ---
  const { title, questions, categoryName } = req.body;
  const creatorId = req.user!.id;

  console.log('Backend: Received quiz data:', { title, categoryName, questions });
  console.log('Backend: Creator ID:', creatorId);

  try {
    console.log('Backend: About to call quizService.createQuiz...');
    // --- Pass categoryName to the service ---
    const quiz = await quizService.createQuiz(title, creatorId, categoryName, questions);
    console.log('Backend: Quiz service returned:', quiz);
    // The service now handles all the category logic
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Backend: Error creating quiz:', error);
    console.error('Backend: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Send the specific error message to the frontend
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create quiz', error: String(error) });
    }
  }
};

export const getAvailableQuizzes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const status = req.query.status as QuizStatus | undefined;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined;
    
    console.log('Backend: getAvailableQuizzes called with user:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');
    console.log('Backend: Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('Backend: All headers:', Object.keys(req.headers));
    console.log('Backend: status filter:', status);
    console.log('Backend: categoryId filter:', categoryId);
    
    // If no user is authenticated, return only public quizzes
    if (!req.user) {
      console.log('Backend: No user authenticated, returning public quizzes only');
      const whereClause: any = { status: 'PUBLIC' };
      if (categoryId) whereClause.categoryId = categoryId;
      
      const quizzes = await Quiz.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'name'] },
          { model: Category, as: 'category' } 
        ],
        order: [['createdAt', 'DESC']]
      });
      console.log('Backend: Found public quizzes:', quizzes.length);
      res.status(200).json(quizzes);
      return;
    }
    
    // If user is authenticated, use the existing logic
    console.log('Backend: User authenticated, calling quizService.findQuizzesForUser...');
    const quizzes = await quizService.findQuizzesForUser(req.user, status, categoryId);
    console.log('Backend: quizService.findQuizzesForUser returned:', quizzes.length, 'quizzes');
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Backend: Error in getAvailableQuizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes', error });
  }
};

export const requestPublic = async (req: AuthRequest, res: Response): Promise<void> => {
    const quizId = parseInt(req.params.id, 10);
    const userId = req.user!.id;
    try {
        const quiz = await quizService.requestQuizApproval(quizId, userId);
        res.status(200).json(quiz);
    } catch (error: any) {
        // FIX: Removed 'return' from res.status()
        res.status(404).json({ message: error.message });
    }
};

export const approvePublic = async (req: AuthRequest, res: Response): Promise<void> => {
    const quizId = parseInt(req.params.id, 10);
    try {
        const quiz = await quizService.approveQuiz(quizId);
        res.status(200).json(quiz);
    } catch (error: any) {
        // FIX: Removed 'return' from res.status()
        res.status(404).json({ message: error.message });
    }
};

export const getQuizDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const quizId = parseInt(req.params.id, 10);
        const quiz = await quizService.findQuizById(quizId);

        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        // Optional: Add a permission check here if needed
        // For example, only the owner or an admin can see a private quiz's details.
        const user = req.user!;
        if (quiz.status === 'PRIVATE' && quiz.creatorId !== user.id && user.role !== 'ADMIN') {
            res.status(403).json({ message: 'You do not have permission to view this quiz.' });
            return;
        }

        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch quiz details', error });
    }
};

export const updateQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
    const quizId = parseInt(req.params.id, 10);
    const { title, questions, categoryName } = req.body;
    const userId = req.user!.id;

    try {
        const quiz = await quizService.findQuizById(quizId);
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        // Check permissions: only owner or admin can update
        if (quiz.creatorId !== userId && req.user!.role !== 'ADMIN') {
            res.status(403).json({ message: 'You do not have permission to update this quiz' });
            return;
        }

        const updatedQuiz = await quizService.updateQuiz(quizId, { title, questions, categoryName });
        res.status(200).json(updatedQuiz);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update quiz', error: error.message });
    }
};

export const deleteQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
    const quizId = parseInt(req.params.id, 10);
    const userId = req.user!.id;

    try {
        const quiz = await quizService.findQuizById(quizId);
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        // Check permissions: only owner or admin can delete
        if (quiz.creatorId !== userId && req.user!.role !== 'ADMIN') {
            res.status(403).json({ message: 'You do not have permission to delete this quiz' });
            return;
        }

        await quizService.deleteQuiz(quizId);
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to delete quiz', error: error.message });
    }
};