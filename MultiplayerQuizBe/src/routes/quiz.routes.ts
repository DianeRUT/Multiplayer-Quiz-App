// src/routes/quiz.routes.ts
import { Router } from 'express';
import {
  createNewQuiz,
  getAvailableQuizzes,
  requestPublic,
  approvePublic,
  getQuizDetails,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quiz.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model'; // Corrected casing
import { validate } from '../middlewares/validate.middleware';
import { createQuizSchema } from '../schemas/quiz.schema';

const router = Router();

// Test route to debug
router.get('/test', (req, res) => {
  res.json({ message: 'Quizzes route is working!' });
});

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: API for creating and managing quizzes
 */

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Get a list of available quizzes
 *     description: Admins see all quizzes and can filter by status. Creators see their own quizzes plus all public ones.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRIVATE, PENDING_APPROVAL, PUBLIC]
 *         description: Filter quizzes by status (Admin only).
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter quizzes by a specific category ID.
 *     responses:
 *       200:
 *         description: A list of quizzes.
 *       401:
 *         description: Unauthorized.
 */
router.get(
    '/',
    protect,
    getAvailableQuizzes
);

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     description: Quizzes are created with a 'PRIVATE' status by default.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully.
 *       401:
 *         description: Unauthorized.
 */
router.post(
  '/',
  protect,
  restrictTo(UserRole.ADMIN, UserRole.CREATOR),
  validate(createQuizSchema),
  createNewQuiz
);

/**
 * @swagger
 * /quizzes/{id}/request-public:
 *   patch:
 *     summary: Request a private quiz to be made public
 *     description: Changes the quiz status from PRIVATE to PENDING_APPROVAL. Only the quiz owner can do this.
 *     tags: [Quizzes]
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
 *         description: Approval request sent successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Quiz not found or you do not have permission.
 */
router.patch(
    '/:id/request-public',
    protect,
    restrictTo(UserRole.CREATOR, UserRole.ADMIN),
    requestPublic
);

/**
 * @swagger
 * /quizzes/{id}/approve:
 *   patch:
 *     summary: Approve a quiz to make it public (Admin only)
 *     description: Changes the quiz status to PUBLIC.
 *     tags: [Quizzes]
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
 *         description: Quiz approved and is now public.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (user is not an Admin).
 *       404:
 *         description: Quiz not found.
 */
router.patch(
    '/:id/approve',
    protect,
    restrictTo(UserRole.ADMIN),
    approvePublic
);
/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get full details of a single quiz
 *     description: Retrieves a single quiz by its ID, including all of its questions and their options. A user can view any public quiz, but only the owner or an admin can view a private quiz.
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The numeric ID of the quiz to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the quiz details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "World Capitals"
 *                 status:
 *                   type: string
 *                   enum: [PRIVATE, PENDING_APPROVAL, PUBLIC]
 *                   example: "PUBLIC"
 *                 creator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Test Creator"
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Geography"
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       text:
 *                         type: string
 *                         example: "What is the capital of Canada?"
 *                       quizId:
 *                         type: integer
 *                         example: 1
 *                       options:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             text:
 *                               type: string
 *                               example: "Ottawa"
 *                             isCorrect:
 *                               type: boolean
 *                               example: true
 *                             questionId:
 *                               type: integer
 *                               example: 1
 *       403:
 *         description: Forbidden. User does not have permission to view this quiz.
 *       404:
 *         description: Quiz not found.
 */
router.get(
    '/:id',
    protect,
    restrictTo(UserRole.ADMIN, UserRole.CREATOR),
    getQuizDetails
);

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     summary: Update a quiz
 *     description: Update quiz details. Only the owner or admin can update.
 *     tags: [Quizzes]
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
 *             $ref: '#/components/schemas/CreateQuiz'
 *     responses:
 *       200:
 *         description: Quiz updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (not the owner or admin).
 *       404:
 *         description: Quiz not found.
 */
router.put(
    '/:id',
    protect,
    restrictTo(UserRole.ADMIN, UserRole.CREATOR),
    validate(createQuizSchema),
    updateQuiz
);

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     description: Delete a quiz and all its questions. Only the owner or admin can delete.
 *     tags: [Quizzes]
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
 *         description: Quiz deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (not the owner or admin).
 *       404:
 *         description: Quiz not found.
 */
router.delete(
    '/:id',
    protect,
    restrictTo(UserRole.ADMIN, UserRole.CREATOR),
    deleteQuiz
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateQuiz:
 *       type: object
 *       required:
 *         - title
 *         - categoryName
 *         - questions
 *       properties:
 *         title:
 *           type: string
 *           example: "World Capitals"
 *         categoryName:
 *           type: string
 *           example: "Geography"
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - text
 *               - options
 *             properties:
 *               text:
 *                 type: string
 *                 example: "What is the capital of Canada?"
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - text
 *                     - isCorrect
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "Ottawa"
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 */