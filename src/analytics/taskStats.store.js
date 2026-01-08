const AnalyticsStats = require('../models/analyticsStats.model')

const applyEvent = async (event) => {
    switch (event.event) {
        case 'TASK_CREATED':
            await AnalyticsStats.findByIdAndUpdate(
                'task-analytics',
                { $inc: { totalTasks: 1 } },
                { upsert: true }
            );
            break;

        case 'TASK_COMPLETED':
            await AnalyticsStats.findByIdAndUpdate(
                'task-analytics',
                { $inc: { completedTasks: 1 } },
                { upsert: true }
            );
            break;

        case 'TASK_DELETED':
            await AnalyticsStats.findByIdAndUpdate(
                'task-analytics',
                { $inc: { deletedTasks: 1 } },
                { upsert: true }
            );
            break;

        default:
            break;
    }
};

const getStats = () => {
    return AnalyticsStats.findById('task-analytics').lean();
};

const resetStats = async () => {
    await AnalyticsStats.findByIdAndUpdate(
        'task-analytics',
        {
            totalTasks: 0,
            completedTasks: 0,
            deletedTasks: 0,
        },
        {
            upsert: true,
        }
    )
};

module.exports = {
    applyEvent,
    getStats,
    resetStats,
}