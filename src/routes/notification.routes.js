const express = require('express');
const notificationController = require('../controllers/notification.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

/**
 * GET /notifications
 * 查询当前用户的通知
 * 支持 unreadOnly / limit / skip
 */
router.get(
    '/',
    asyncHandler(notificationController.getNotifications)
);

/**
 * PATCH /notifications/:id/read
 * 标记单条通知为已读
 */
router.patch(
    '/:id/read',
    asyncHandler(notificationController.markAsRead)
);

/**
 * PATCH /notifications/read-all
 * 标记当前用户所有通知为已读
 */
router.patch(
    '/read-all',
    asyncHandler(notificationController.markAllAsRead)
);

module.exports = router;