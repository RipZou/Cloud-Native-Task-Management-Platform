const mongoose = require('mongoose');

const analyticsStatsSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: 'task-analytics',
        },
        totalTasks: {
            type: Number,
            default: 0,
        },
        completedTasks: {
            type: Number,
            default: 0,
        },
        deletedTasks: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('AnalyticsStats', analyticsStatsSchema);