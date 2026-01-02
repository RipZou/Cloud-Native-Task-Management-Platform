const express = require('express');
const taskController = require('../controllers/task.controller');
const validateObjectId = require('../middlewares/validateObjectId');
const asyncMiddleware = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncMiddleware(taskController.getTasks));
router.post('/', asyncMiddleware(taskController.createTask));
router.delete('/:id', validateObjectId, asyncMiddleware(taskController.deleteTask));
router.put('/:id', validateObjectId, asyncMiddleware(taskController.updateTask));

module.exports = router;