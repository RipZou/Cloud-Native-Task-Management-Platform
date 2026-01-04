const { getStats } = require('../analytics/taskStats.store');
const  replayAnalytics  = require('../analytics/replayAnalytics');

const getTaskStats = (req, res) => {
    res.json(getStats());
}

const replay = (req, res) => {
    replayAnalytics();
    res.json({ status: 'replay started' })
}

module.exports = {
    getTaskStats,
    replay
}