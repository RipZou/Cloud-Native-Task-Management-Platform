const taskService = require('../services/task.service');
const AppError = require("../errors/AppError");

const getTasks = async (req, res) => {
    const userId = req.user.id;

    const tasks = await taskService.getTasksByUser(userId);

    res.json(tasks)
}

const createTask = async (req, res) => {
    const userId = req.user.id;
    const { title, dueAt } = req.body

    if(!title) {
        throw new AppError('Title is required', 400);
    }

    const task = await taskService.createTask({
        userId,
        title,
        dueAt,
        requestId: req.requestId,
    })

    res.status(201).json(task)
}

const updateTask = async (req, res) => {
    const userId = req.user.id;
    const  taskId  = req.params.id;
    const {title, completed } = req.body;

    const task = await taskService.updateTask(taskId, userId, {title, completed}, req.requestId)

    if(!task) {
        throw new AppError('Task not found', 404);
    }

    res.json(task)

}

const deleteTask = async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    const success = await taskService.deleteTask(taskId, userId, req.requestId)

    if(!success)  {
        throw new AppError('Task not found', 404);
    }

    res.json(success)
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
}