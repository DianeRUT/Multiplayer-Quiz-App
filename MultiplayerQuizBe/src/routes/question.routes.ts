import { Router } from 'express';
import { 
  getAllQuestions, 
  getQuestionById, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion 
} from '../controllers/question.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

// Test route to debug
router.get('/test', (req, res) => {
  res.json({ message: 'Questions route is working!' });
});

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: API for managing quiz questions
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     description: Retrieve all questions with their options and associated quiz/category info
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all questions
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllQuestions);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     description: Retrieve a specific question with its options and associated quiz/category info
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', protect, getQuestionById);

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     description: Create a new question with options for a specific quiz
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - quizId
 *               - options
 *             properties:
 *               text:
 *                 type: string
 *                 example: "What is the capital of France?"
 *               quizId:
 *                 type: integer
 *                 example: 1
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "Paris"
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not quiz owner or admin)
 *       404:
 *         description: Quiz not found
 */
router.post('/', protect, createQuestion);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question
 *     description: Update an existing question and its options
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "What is the capital of France?"
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "Paris"
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not quiz owner or admin)
 *       404:
 *         description: Question not found
 */
router.put('/:id', protect, updateQuestion);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     description: Delete a question and all its options
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not quiz owner or admin)
 *       404:
 *         description: Question not found
 */
router.delete('/:id', protect, deleteQuestion);

export default router; 