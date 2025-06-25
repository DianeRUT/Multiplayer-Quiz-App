// TypeScript type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: string[];
  correctAnswer: number;
} 