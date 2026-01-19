const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getTaskStats, replay, reset, replayStatus } = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/task-stats', asyncHandler(getTaskStats));
router.post('/replay', asyncHandler(replay));
router.get('/replay/status', asyncHandler(replayStatus));
router.post('/reset', asyncHandler(reset));

module.exports = router;