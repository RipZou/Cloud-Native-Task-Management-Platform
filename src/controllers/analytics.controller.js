const { getStatsByUser, resetStatsByUser } = require('../analytics/taskStats.store');
const  replayAnalytics  = require('../analytics/replayAnalytics');

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
    replayAnalytics();
    res.json({ status: 'replay started' })
}

module.exports = {
    getTaskStats,
    replay,
    reset,
}