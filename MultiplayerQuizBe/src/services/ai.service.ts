// src/services/ai.service.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

// Get the API key from your environment variables.
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY is not set in the environment variables.');
}

// Initialize the Google AI client.
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Constructs a detailed prompt for the Gemini model.
 * Note: The prompt is slightly different from the OpenAI one to work better with Gemini.
 * @param topic The subject of the quiz.
 * @param numQuestions The number of questions to generate.
 * @returns A string containing the full prompt for the AI.
 */
const createQuizPrompt = (topic: string, numQuestions: number): string => {
  return `
    You are an expert quiz creator. Your task is to generate a high-quality multiple-choice quiz about the topic: "${topic}".

    Follow these rules precisely:
    1.  Generate exactly ${numQuestions} questions.
    2.  Each question must have exactly 4 options.
    3.  For each question, only one option can be correct.
    4.  The output MUST be a valid JSON object. Do not include any text, explanations, or markdown formatting like \`\`\`json\`\`\` before or after the JSON object.
    5.  The JSON object must have a single root key named "questions", which holds an array of question objects.

    Each object in the "questions" array must have:
    - A "text" property (string) for the question.
    - An "options" property (array of 4 objects).
    
    Each object in the "options" array must have:
    - A "text" property (string) for the option.
    - A "isCorrect" property (boolean).

    Here is the exact JSON structure to follow:
    {
      "questions": [
        {
          "text": "Example Question?",
          "options": [
            { "text": "Wrong Answer 1", "isCorrect": false },
            { "text": "Correct Answer", "isCorrect": true },
            { "text": "Wrong Answer 2", "isCorrect": false },
            { "text": "Wrong Answer 3", "isCorrect": false }
          ]
        }
      ]
    }
  `;
};

/**
 * Calls the Google Gemini API to generate a quiz.
 * @param topic The subject for the quiz.
 * @param numQuestions The desired number of questions.
 * @returns A promise that resolves to an array of question objects.
 */
export const generateQuizWithAI = async (topic: string, numQuestions: number = 5) => {
  try {
    // Select the generative model. 'gemini-pro' is a great general-purpose model.
     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = createQuizPrompt(topic, numQuestions);

    // Send the prompt to the model and wait for the response.
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    if (!content) {
      throw new Error('AI returned an empty response.');
    }

    // Parse the JSON string returned by Gemini.
    const jsonResponse = JSON.parse(content);
    
    // Extract the 'questions' array from the parsed JSON.
    const questions = jsonResponse.questions;

    if (!questions || !Array.isArray(questions)) {
      console.error("AI did not return the expected 'questions' array:", jsonResponse);
      throw new Error('AI response did not match the expected format.');
    }

    // Return the clean array of questions.
    return questions;

  } catch (error) {
    // Log the detailed error for debugging.
    console.error('Error calling Google AI service:', error);
    // Throw a more generic error for the controller to handle.
    throw new Error('Failed to generate quiz content from AI service.');
  }
};