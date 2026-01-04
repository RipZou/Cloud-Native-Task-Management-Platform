const Task = require('../models/task.model');
const {
    publishTaskCreated,
    publishTaskUpdated,
    publishTaskDeleted,
    publishTaskCompleted,
} = require('../kafka/taskEvents');

const getAllTasks = async () => {
    return await Task.find().sort({ createdAt: -1 });
}

const createTask = async ({ title, requestId }) => {
    const task = new Task({ title });
    await task.save();

    await publishTaskCreated({
        task,
        requestId,
    });

    return task;
}

const updateTask = async (id, updates, requestId) => {
   const task = await Task.findById(id);
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

const deleteTask = async (id, requestId) => {
   const task = await Task.findByIdAndDelete(id);
   if (!task) return false;

   await publishTaskDeleted({
       taskId: id,
       requestId,
   })

    return true;
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
}