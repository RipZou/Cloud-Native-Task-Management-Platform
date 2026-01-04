const express = require('express');
const { getTaskStats } = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/task-stats', getTaskStats);

module.exports = router;