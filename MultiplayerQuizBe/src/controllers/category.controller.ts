// src/controllers/category.controller.ts
import { Request, Response } from 'express';
import { Category } from '../models/category.model';
import { Op } from 'sequelize';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  try {
    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({ where: { name: { [Op.iLike]: name } } });
    if(existingCategory) {
        res.status(409).json({ message: 'Category with this name already exists.'});
        return;
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;
  
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // Check if new name already exists (case-insensitive, excluding current category)
    const existingCategory = await Category.findOne({ 
      where: { 
        name: { [Op.iLike]: name },
        id: { [Op.ne]: id }
      } 
    });
    
    if (existingCategory) {
      res.status(409).json({ message: 'Category with this name already exists.' });
      return;
    }

    await category.update({ name });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // Check if category is being used by any quizzes
    const { Quiz } = require('../models/quiz.model');
    const quizCount = await Quiz.count({ where: { categoryId: id } });
    
    if (quizCount > 0) {
      res.status(400).json({ 
        message: `Cannot delete category. It is being used by ${quizCount} quiz(zes).` 
      });
      return;
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};