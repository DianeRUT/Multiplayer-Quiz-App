// src/schemas/quiz.schema.ts
import { z } from 'zod';

const optionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().min(1),
  options: z.array(optionSchema).min(2).max(4),
});

export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    categoryName: z.string().min(2, 'Category name is required'),
    questions: z.array(questionSchema).min(0, 'Questions array can be empty'),
  }),
});