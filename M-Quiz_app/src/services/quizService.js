import api from './api';

// Gets quizzes created by the logged-in user (for creators)
export const getMyQuizzes = async () => {
  const { data } = await api.get('/quizzes');
  return data;
};

// Gets all quizzes available to play (for players)
export const getAvailableQuizzes = async (categoryId) => {
  const params = {
    status: 'PUBLIC', // Regular users should only see public quizzes
    ...(categoryId && { categoryId }), // Add categoryId if it exists
  };
  const { data } = await api.get('/quizzes', { params });
  return data;
};

// Creates a new quiz
export const createQuiz = async (quizData) => {
  const { data } = await api.post('/quizzes', quizData);
  return data;
};

// Fetches all categories
export const getAllCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

// AI quiz generation
export const generateQuizWithAI = async (topic, numQuestions) => {
    const { data } = await api.post('/ai/generate-quiz', { topic, numQuestions });
    return data;
}