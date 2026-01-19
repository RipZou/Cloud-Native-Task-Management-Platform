const Task = require('../models/task.model');
const {
    publishTaskCreated,
    publishTaskUpdated,
    publishTaskDeleted,
    publishTaskCompleted,
} = require('../kafka/taskEvents');

const getTasksByUser = async ( userId ) => {
    return Task.find({ userId }).sort({ createdAt: -1 });
}

const createTask = async ({ userId, title, dueAt, requestId }) => {
    const task = new Task({ userId, title, dueAt });
    await task.save();

    await publishTaskCreated({
        task,
        requestId,
    });

    return task;
}

const updateTask = async (taskId, userId, updates, requestId) => {
   const task = await Task.findOne({
       _id: taskId,
       userId,
   });

   if (!task) return null;

   const wasCompleted = task.completed;

   if (updates.title !== undefined) {
       task.title = updates.title;
   }

   if(updates.completed !== undefined) {
       task.completed = updates.completed;
   }

   await task.save();

   if(!wasCompleted && task.completed === true) {
       await publishTaskCompleted({ task, requestId });
   }

   await publishTaskUpdated({ task, requestId });


    return task;
}

const deleteTask = async (taskId, userId, requestId) => {
   const task = await Task.findOneAndDelete({
       _id: taskId,
       userId,
   });

   if (!task) return false;

   await publishTaskDeleted({
        task,
       requestId,
   })

    return true;
}

module.exports = {
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask,
}