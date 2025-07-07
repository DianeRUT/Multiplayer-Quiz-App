import { Request, Response } from 'express'
import { Op, fn, col } from 'sequelize'
import { Notification } from '../models/notification.model'
import { NotificationAttributes } from '../models/notification.model'

export class NotificationController {
  // Get notifications with filters
  async getNotifications(req: Request, res: Response) {
    try {
      const {
        read,
        category,
        type,
        limit = 50,
        offset = 0,
        userId
      } = req.query

      const where: any = {}
      
      if (read !== undefined) {
        where.read = read === 'true'
      }
      
      if (category) {
        where.category = category
      }
      
      if (type) {
        where.type = type
      }
      
      if (userId) {
        where.userId = userId
      }

      const notifications = await Notification.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        order: [['createdAt', 'DESC']],
      })

      res.json(notifications.rows)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Get notification statistics
  async getNotificationStats(req: Request, res: Response) {
    try {
      const total = await Notification.count()
      const unread = await Notification.count({ where: { read: false } })
      
      const byCategory = await Notification.findAll({
        attributes: [
          'category',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      }) as unknown as Array<{ category: string; count: string | number }>
      
      const byType = await Notification.findAll({
        attributes: [
          'type',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      }) as unknown as Array<{ type: string; count: string | number }>

      const stats = {
        total,
        unread,
        byCategory: {
          user: 0,
          game: 0,
          tournament: 0,
          system: 0,
          security: 0
        },
        byType: {
          info: 0,
          warning: 0,
          error: 0,
          success: 0
        }
      }

      byCategory.forEach(item => {
        stats.byCategory[item.category as keyof typeof stats.byCategory] = Number(item.count)
      })

      byType.forEach(item => {
        stats.byType[item.type as keyof typeof stats.byType] = Number(item.count)
      })

      res.json(stats)
    } catch (error) {
      console.error('Error fetching notification stats:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Get unread count
  async getUnreadCount(req: Request, res: Response) {
    try {
      const count = await Notification.count({ where: { read: false } })
      res.json({ count })
    } catch (error) {
      console.error('Error fetching unread count:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Mark notification as read
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      const notification = await Notification.findByPk(id)
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' })
      }

      await notification.update({ read: true })
      res.json({ message: 'Notification marked as read' })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Mark all notifications as read
  async markAllAsRead(req: Request, res: Response) {
    try {
      await Notification.update(
        { read: true },
        { where: { read: false } }
      )
      
      res.json({ message: 'All notifications marked as read' })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Delete notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      const notification = await Notification.findByPk(id)
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' })
      }

      await notification.destroy()
      res.json({ message: 'Notification deleted' })
    } catch (error) {
      console.error('Error deleting notification:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Delete all read notifications
  async deleteAllRead(req: Request, res: Response) {
    try {
      const deletedCount = await Notification.destroy({
        where: { read: true }
      })
      
      res.json({ 
        message: 'Read notifications deleted',
        deletedCount 
      })
    } catch (error) {
      console.error('Error deleting read notifications:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Create notification (admin only)
  async createNotification(req: Request, res: Response) {
    try {
      const { title, message, userId, actionUrl } = req.body
      let { type, category } = req.body

      // Ensure type and category are always valid
      type = (type as 'info' | 'warning' | 'error' | 'success') || 'info'
      category = (category as 'user' | 'game' | 'tournament' | 'system' | 'security') || 'system'

      if (!title || !message) {
        return res.status(400).json({ message: 'Title and message are required' })
      }

      const notification = await Notification.create({
        title,
        message,
        type,
        category,
        userId,
        actionUrl,
        read: false
      })

      res.status(201).json(notification)
    } catch (error) {
      console.error('Error creating notification:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
} 