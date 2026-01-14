const Notification = require('../models/Notification.model');

const getNotificationsByUser = async (userId, options = {}) => {
    const {
        unreadOnly = false,
        limit = 20,
        skip = 0,
    } = options;

    const query = { userId }

    if(unreadOnly) {
        query.read = false;
    }

    return Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

};


const markNotificationAsRead = async (notificationId, userId) => {
    return Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );
};

const markAllNotificationsAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
    );

    return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount ?? result.nModified,
    };
};

module.exports = {
    getNotificationsByUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};


