const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getTaskStats, replay } = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/task-stats', asyncHandler(getTaskStats));
router.post('/replay', asyncHandler(replay));

module.exports = router;