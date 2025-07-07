import { Router } from 'express'
import { NotificationController } from '../controllers/notification.controller'
import { protect, restrictTo } from '../middlewares/auth.middleware'
import { UserRole } from '../models/user.model'

const router = Router()
const notificationController = new NotificationController()

// All routes require authentication
router.use(protect)

// Get notifications with filters
router.get('/', async (req, res) => {
  await notificationController.getNotifications(req, res)
})

// Get notification statistics
router.get('/stats', async (req, res) => {
  await notificationController.getNotificationStats(req, res)
})

// Get unread count
router.get('/unread-count', async (req, res) => {
  await notificationController.getUnreadCount(req, res)
})

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  await notificationController.markAsRead(req, res)
})

// Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  await notificationController.markAllAsRead(req, res)
})

// Delete notification
router.delete('/:id', async (req, res) => {
  await notificationController.deleteNotification(req, res)
})

// Delete all read notifications
router.delete('/delete-read', async (req, res) => {
  await notificationController.deleteAllRead(req, res)
})

// Create notification (admin only)
router.post('/', restrictTo(UserRole.ADMIN), async (req, res) => {
  await notificationController.createNotification(req, res)
})

export default router 