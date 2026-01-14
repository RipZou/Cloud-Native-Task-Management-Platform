const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['TASK_REMINDER', 'TASK_OVERDUE'],
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },

    title: String,

    message: String,

    read: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema);