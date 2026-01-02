const taskService = require('../services/task.service');
const AppError = require("../errors/AppError");

const getTasks = async (req, res) => {
    const tasks = await taskService.getAllTasks()
    res.json(tasks)
}

const createTask = async (req, res) => {
    const { title } = req.body

    if(!title) {
        throw new AppError('Title is required', 400);
    }

    const task = await taskService.createTask(title)
    res.status(201).json(task)
}

const updateTask = async (req, res) => {
    const  id  = req.params.id;
    const {title, completed } = req.body;

    const task = await taskService.updateTask(id, {title, completed})

    if(!task) {
        throw new AppError('Task not found', 404);
    }

    res.json(task)

}

const deleteTask = async (req, res) => {
    const id = req.params.id;

    const success = await taskService.deleteTask(id)

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