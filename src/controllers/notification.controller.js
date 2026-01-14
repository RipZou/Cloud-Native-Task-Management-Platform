const notificationService = require('../services/notification.service');
const AppError = require("../errors/AppError");

const getNotifications = async (req, res) => {
    const userId = req.user.id;

    const {
        unreadOnly,
        limit,
        skip,
    } = req.query;

    const notifications = await notificationService.getNotificationsByUser(
        userId,
        {
            unreadOnly: unreadOnly === 'true',
            limit,
            skip,
        }
    );

    res.json(notifications);
}

const markAsRead = async (req, res) => {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationService.markNotificationAsRead(
        notificationId,
        userId
    );

    if (!notification) {
        throw new AppError('Notification not found', 404);
    }

    res.json(notification);
}

const markAllAsRead = async (req, res) => {
    const userId = req.user.id;

    const result = await notificationService.markAllNotificationsAsRead(userId);

    res.json(result);
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};