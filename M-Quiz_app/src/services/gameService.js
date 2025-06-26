import api from './api';

export const startGameSession = async (quizId) => {
  const { data } = await api.post(`/games/${quizId}/start`);
  return data;
};