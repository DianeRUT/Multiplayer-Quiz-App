import { User, UserRole } from '../models/user.model';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

export class UserService {
  async createUser(userData: { name: string; email: string; password: string; role?: UserRole }) {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create the user (automatically verified since admin is creating it)
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || UserRole.CREATOR,
      isVerified: true, // Admin-created users are automatically verified
      emailToken: null
    });

    // Return user without password
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    delete userWithoutPassword.emailToken;
    
    return userWithoutPassword;
  }

  async getAllUsers() {
    return User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
  }

  async getUserById(id: number) {
    return User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt', 'updatedAt']
    });
  }

  async updateUser(id: number, updates: Partial<User>) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow updating email to an existing one
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: updates.email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    await user.update(updates);
    return user;
  }

  async deleteUser(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow deleting admin users
    if (user.role === UserRole.ADMIN) {
      throw new Error('Cannot delete admin users');
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  async banUser(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow banning admin users
    if (user.role === UserRole.ADMIN) {
      throw new Error('Cannot ban admin users');
    }

    await user.update({ isVerified: false });
    return user;
  }

  async unbanUser(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ isVerified: true });
    return user;
  }

  async promoteToModerator(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ role: UserRole.CREATOR });
    return user;
  }

  async promoteToAdmin(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ role: UserRole.ADMIN });
    return user;
  }

  async getUsersStats() {
    const totalUsers = await User.count();
    const verifiedUsers = await User.count({ where: { isVerified: true } });
    const adminUsers = await User.count({ where: { role: UserRole.ADMIN } });
    const creatorUsers = await User.count({ where: { role: UserRole.CREATOR } });

    return {
      totalUsers,
      verifiedUsers,
      adminUsers,
      creatorUsers,
      bannedUsers: totalUsers - verifiedUsers
    };
  }
}

export const userService = new UserService();