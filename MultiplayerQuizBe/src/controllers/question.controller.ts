import { Request, Response } from 'express';
import { Question } from '../models/question.model';
import { Option } from '../models/option.model';
import { Quiz } from '../models/quiz.model';
import { Category } from '../models/category.model';
import { sequelize } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getAllQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const questions = await Question.findAll({
      include: [
        {
          model: Option,
          as: 'options',
          attributes: ['id', 'text', 'isCorrect']
        },
        {
          model: Quiz,
          as: 'quiz',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            }
          ],
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error });
  }
};

export const getQuestionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const questionId = parseInt(req.params.id, 10);
    const question = await Question.findByPk(questionId, {
      include: [
        {
          model: Option,
          as: 'options',
          attributes: ['id', 'text', 'isCorrect']
        },
        {
          model: Quiz,
          as: 'quiz',
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            }
          ],
          attributes: ['id', 'title']
        }
      ]
    });

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch question', error });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { text, quizId, options } = req.body;
    const userId = req.user!.id;

    // Verify the quiz exists and user has permission
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    // Check if user is admin or quiz creator
    if (quiz.creatorId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ message: 'You do not have permission to add questions to this quiz' });
      return;
    }

    // Create the question
    const question = await Question.create(
      { text, quizId },
      { transaction: t }
    );

    // Create options
    if (options && Array.isArray(options)) {
      await Option.bulkCreate(
        options.map((opt: any) => ({ ...opt, questionId: question.id })),
        { transaction: t }
      );
    }

    await t.commit();

    // Return the created question with options
    const createdQuestion = await Question.findByPk(question.id, {
      include: [
        {
          model: Option,
          as: 'options',
          attributes: ['id', 'text', 'isCorrect']
        }
      ]
    });

    res.status(201).json(createdQuestion);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to create question', error });
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const questionId = parseInt(req.params.id, 10);
    const { text, options } = req.body;
    const userId = req.user!.id;

    const question = await Question.findByPk(questionId, {
      include: [{ model: Quiz, as: 'quiz' }]
    });

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    // Check permissions
    if (question.quiz.creatorId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ message: 'You do not have permission to edit this question' });
      return;
    }

    // Update question text
    if (text) {
      await question.update({ text }, { transaction: t });
    }

    // Update options if provided
    if (options && Array.isArray(options)) {
      // Delete existing options
      await Option.destroy({ where: { questionId }, transaction: t });
      
      // Create new options
      await Option.bulkCreate(
        options.map((opt: any) => ({ ...opt, questionId })),
        { transaction: t }
      );
    }

    await t.commit();

    // Return updated question
    const updatedQuestion = await Question.findByPk(questionId, {
      include: [
        {
          model: Option,
          as: 'options',
          attributes: ['id', 'text', 'isCorrect']
        }
      ]
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to update question', error });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const questionId = parseInt(req.params.id, 10);
    const userId = req.user!.id;

    const question = await Question.findByPk(questionId, {
      include: [{ model: Quiz, as: 'quiz' }]
    });

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    // Check permissions
    if (question.quiz.creatorId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ message: 'You do not have permission to delete this question' });
      return;
    }

    // Delete options first
    await Option.destroy({ where: { questionId }, transaction: t });
    
    // Delete question
    await question.destroy({ transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to delete question', error });
  }
};