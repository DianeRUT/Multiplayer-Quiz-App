// Admin dashboard types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
}

export interface AdminQuestion {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  status: 'active' | 'inactive' | 'pending';
} 