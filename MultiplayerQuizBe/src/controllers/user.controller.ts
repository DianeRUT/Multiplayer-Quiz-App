import { Request, Response } from 'express';
import { userService } from '../services/user.service';

// Create user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Name, email and password are required'
      });
      return;
    }

    const user = await userService.createUser({ name, email, password, role });
    
    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to create user'
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (error: any) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(parseInt(id));
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await userService.updateUser(parseInt(id), updates);
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to update user'
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await userService.deleteUser(parseInt(id));
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to delete user'
    });
  }
};

// Ban user
export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.banUser(parseInt(id));
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    console.error('Error banning user:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to ban user'
    });
  }
};

// Unban user
export const unbanUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.unbanUser(parseInt(id));
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    console.error('Error unbanning user:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to unban user'
    });
  }
};

// Promote user to moderator
export const promoteToModerator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.promoteToModerator(parseInt(id));
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    console.error('Error promoting user to moderator:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to promote user'
    });
  }
};

// Promote user to admin
export const promoteToAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.promoteToAdmin(parseInt(id));
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error: any) {
    console.error('Error promoting user to admin:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to promote user'
    });
  }
};

// Get users stats
export const getUsersStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await userService.getUsersStats();
    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error: any) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};