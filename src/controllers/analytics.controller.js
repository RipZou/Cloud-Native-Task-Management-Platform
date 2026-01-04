const { getStats } = require('../analytics/taskStats.store');

const getTaskStats = (req, res) => {
    res.json(getStats());
}

module.exports = {
    getTaskStats
}