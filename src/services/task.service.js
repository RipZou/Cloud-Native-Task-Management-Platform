const Task = require('../models/task.model');
const taskService = require("./task.service");

const getAllTasks = async () => {
    return await Task.find().sort({ createdAt: -1 });
}

const createTask = async (title) => {
    const task = new Task({ title });
    return await task.save();
}

const updateTask = async (id, updates) => {
   const task = await Task.findById(id);
   if (!task) return null;

   if (updates.title !== undefined) {
       task.title = updates.title;
   }

   if(updates.completed !== undefined) {
       task.completed = updates.completed;
   }

   return await task.save();
}

const deleteTask = async (id) => {
   const result = await Task.findByIdAndDelete(id);
   return !! result;
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
}