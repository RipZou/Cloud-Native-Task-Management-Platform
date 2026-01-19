const { getStatsByUser, resetStatsByUser } = require('../analytics/taskStats.store');
const { startReplayAnalytics, getReplayStatus } = require('../analytics/replayAnalytics');

const getTaskStats = async (req, res) => {
    const userId = req.user.id;
    const stats = await getStatsByUser(userId);
    res.json(stats);
}

const reset = async (req, res) => {
    const userId = req.user.id;
    await resetStatsByUser(userId);
    res.json({ status: 'reset done' })
}

const replay = async (req, res) => {
    const status = getReplayStatus();
    if (status.running) {
        return res.status(409).json({ status: 'replay already running' });
    }

    // System-level operation: rebuild stats for ALL users from Kafka history.
    // Trigger async and return immediately.
    startReplayAnalytics().catch(() => {});
    res.json({ status: 'replay started' })
}

const replayStatus = async (req, res) => {
    res.json(getReplayStatus());
}

module.exports = {
    getTaskStats,
    replay,
    reset,
    replayStatus,
}