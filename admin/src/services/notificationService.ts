import { api } from './api'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  category: 'user' | 'game' | 'tournament' | 'system' | 'security'
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface NotificationFilters {
  read?: boolean
  category?: Notification['category']
  type?: Notification['type']
  limit?: number
  offset?: number
}

export interface NotificationStats {
  total: number
  unread: number
  byCategory: {
    user: number
    game: number
    tournament: number
    system: number
    security: number
  }
  byType: {
    info: number
    warning: number
    error: number
    success: number
  }
}

class NotificationService {
  private baseUrl = '/notifications'

  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.read !== undefined) params.append('read', filters.read.toString())
      if (filters?.category) params.append('category', filters.category)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.limit) params.append('limit', filters.limit.toString())
      if (filters?.offset) params.append('offset', filters.offset.toString())

      const response = await api.get(`${this.baseUrl}?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`)
      return response.data
    } catch (error) {
      console.error('Error fetching notification stats:', error)
      throw error
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/${notificationId}/read`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/mark-all-read`)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${notificationId}`)
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  async deleteAllRead(): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/delete-read`)
    } catch (error) {
      console.error('Error deleting read notifications:', error)
      throw error
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get(`${this.baseUrl}/unread-count`)
      return response.data.count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      throw error
    }
  }

  // Real-time notifications via WebSocket
  subscribeToNotifications(callback: (notification: Notification) => void) {
    // This would integrate with the socket service
    // For now, we'll implement this when we set up WebSocket notifications
    console.log('Subscribing to real-time notifications')
  }

  unsubscribeFromNotifications() {
    // This would clean up WebSocket listeners
    console.log('Unsubscribing from real-time notifications')
  }
}

export const notificationService = new NotificationService() 