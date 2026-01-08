const { getStats, resetStats } = require('../analytics/taskStats.store');
const  replayAnalytics  = require('../analytics/replayAnalytics');

const getTaskStats = async (req, res) => {
    const stats = await getStats();
    res.json(stats);
}

const replay = (req, res) => {
    replayAnalytics();
    res.json({ status: 'replay started' })
}

const reset = (req, res) => {
    resetStats();
    res.json({ status: 'reset done' })
}

module.exports = {
    getTaskStats,
    replay,
    reset,
}