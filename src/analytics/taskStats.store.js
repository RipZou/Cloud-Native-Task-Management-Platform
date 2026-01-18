const AnalyticsStats = require('../models/analyticsStats.model')

const applyEvent = async (event) => {
    const { event: type, userId } = event;
    if (!userId) return;

    const filter = { userId };

    switch (type) {
        case 'TASK_CREATED':
            await AnalyticsStats.findOneAndUpdate(
                filter,
                { $inc: { totalTasks: 1 } },
                { upsert: true }
            );
            break;

        case 'TASK_COMPLETED':
            await AnalyticsStats.findOneAndUpdate(
                filter,
                { $inc: { completedTasks: 1 } },
                { upsert: true }
            );
            break;

        case 'TASK_DELETED':
            await AnalyticsStats.findOneAndUpdate(
                filter,
                { $inc: { deletedTasks: 1 } },
                { upsert: true }
            );
            break;
    }
};

const getStatsByUser = async (userId) => {
    return (
        (await AnalyticsStats.findOne({ userId }).lean()) ?? {
            totalTasks: 0,
            completedTasks: 0,
            deletedTasks: 0,
        }
    );
};

const resetStatsByUser = async (userId) => {
    await AnalyticsStats.findOneAndUpdate(
        { userId },
        {
            totalTasks: 0,
            completedTasks: 0,
            deletedTasks: 0,
        },
        { upsert: true }
    );
};

const resetAllStats = async () => {
    await AnalyticsStats.deleteMany({});
};

module.exports = {
    applyEvent,
    getStatsByUser,
    resetStatsByUser,
    resetAllStats
}