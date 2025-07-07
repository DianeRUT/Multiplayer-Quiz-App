// src/controllers/ai.controller.ts

import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as aiService from '../services/ai.service';

/**
 * Handles the request to generate a quiz using AI.
 * It takes a topic and an optional number of questions from the request body.
 */
export const generateQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  const { topic, numQuestions } = req.body;

  // Basic validation to ensure a topic is provided.
  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    res.status(400).json({ message: 'A non-empty topic string is required.' });
    return;
  }

  // Optional: Validate numQuestions if it exists
  const questionCount = numQuestions ? parseInt(numQuestions, 10) : 5; // Default to 5 questions
  if (isNaN(questionCount) || questionCount < 1 || questionCount > 10) {
    res.status(400).json({ message: 'Number of questions must be between 1 and 10.' });
    return;
  }
  
  try {
    console.log(`Generating AI quiz for topic: "${topic}" with ${questionCount} questions.`);
    const questions = await aiService.generateQuizWithAI(topic, questionCount);
    
    // The response is an object containing the array of questions,
    // which the frontend can then use to pre-fill the quiz creation form.
    res.status(200).json({ questions });

  } catch (error: any) {
    console.error('Error in AI controller:', error);
    // Send back a generic error message to the user.
    res.status(500).json({ message: 'An error occurred while generating the quiz with AI.' });
  }
};