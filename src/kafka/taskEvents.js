const { producer } = require('./client');

const TOPIC = 'task-events';

/**
 * Task Created
 */
const publishTaskCreated = async ({ task, requestId }) => {
    await producer.send({
        topic: TOPIC,
        messages: [
            {
                key: task._id.toString(),
                value: JSON.stringify({
                    event: 'TASK_CREATED',
                    taskId: task._id.toString(),
                    title: task.title,
                    completed: task.completed,
                    requestId,
                    timestamp: Date.now(),
                }),
            },
        ],
    });
};

/**
 * Task Updated
 */
const publishTaskUpdated = async ({ task, requestId }) => {
    await producer.send({
        topic: TOPIC,
        messages: [
            {
                key: task._id.toString(),
                value: JSON.stringify({
                    event: 'TASK_UPDATED',
                    taskId: task._id.toString(),
                    title: task.title,
                    completed: task.completed,
                    requestId,
                    timestamp: Date.now(),
                }),
            },
        ],
    });
};

/**
 * Task Completed
 */
const publishTaskCompleted = async ({ task, requestId }) => {
    await producer.send({
        topic: TOPIC,
        messages: [
            {
                key: task._id.toString(),
                value: JSON.stringify({
                    event: 'TASK_COMPLETED',
                    taskId: task._id.toString(),
                    requestId,
                    timestamp: Date.now(),
                }),
            },
        ],
    });
};


/**
 * Task Deleted
 */
const publishTaskDeleted = async ({ taskId, requestId }) => {
    await producer.send({
        topic: TOPIC,
        messages: [
            {
                key: taskId.toString(),
                value: JSON.stringify({
                    event: 'TASK_DELETED',
                    taskId: taskId.toString(),
                    requestId,
                    timestamp: Date.now(),
                }),
            },
        ],
    });
};

/**
 *  Task Reminder
 */

const publishTaskReminder = async ({ task }) => {
    await producer.send({
        topic: TOPIC,
        messages: [
            {
                key: task._id.toString(),
                value: JSON.stringify({
                    event: 'TASK_REMINDER',
                    taskId: task._id.toString(),
                    title: task.title,
                    dueAt: task.dueAt,
                    timestamp: Date.now(),
                }),
            },
        ],
    })
}

/**
 * Task Overdue
 */
const publishTaskOverdue = async ({ task }) => {
    await producer.send({
        topic: TOPIC,
        messages: [
            {
                key: task._id.toString(),
                value: JSON.stringify({
                    event: 'TASK_OVERDUE',
                    taskId: task._id.toString(),
                    title: task.title,
                    dueAt: task.dueAt,
                    timestamp: Date.now(),
                }),
            },
        ],
    });
};



module.exports = {
    publishTaskCreated,
    publishTaskUpdated,
    publishTaskDeleted,
    publishTaskCompleted,
    publishTaskReminder,
    publishTaskOverdue
};