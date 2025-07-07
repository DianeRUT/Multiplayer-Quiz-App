// src/routes/category.routes.ts
import { Router } from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/category.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UserRole } from '../models/user.model'; // Corrected casing
import { createCategorySchema } from '../schemas/category.schema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing quiz categories
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Science Fiction
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (user is not an Admin).
 *       409:
 *         description: Category with this name already exists.
 */
router.post(
  '/',
  protect,
  restrictTo(UserRole.ADMIN),
  validate(createCategorySchema),
  createCategory
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get a list of all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of all categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (user is not an Admin).
 *       404:
 *         description: Category not found.
 *       409:
 *         description: Category with this name already exists.
 */
router.put(
  '/:id',
  protect,
  restrictTo(UserRole.ADMIN),
  validate(createCategorySchema),
  updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
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
 *         description: Category deleted successfully.
 *       400:
 *         description: Cannot delete category (being used by quizzes).
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (user is not an Admin).
 *       404:
 *         description: Category not found.
 */
router.delete(
  '/:id',
  protect,
  restrictTo(UserRole.ADMIN),
  deleteCategory
);

export default router;