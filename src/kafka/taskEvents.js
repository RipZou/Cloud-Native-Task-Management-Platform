const { producer } = require('./client');

const TOPIC = 'task-events-v2';

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
                    userId: task.userId.toString(),
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
                    userId: task.userId.toString(),
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
                    userId: task.userId.toString(),
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
const publishTaskDeleted = async ({ task, taskId, userId, requestId }) => {
    // Backward compatible: allow passing either a full task doc or explicit ids
    const resolvedTaskId = task?._id?.toString?.() ?? taskId?.toString?.();
    const resolvedUserId = task?.userId?.toString?.() ?? userId?.toString?.();

    if (!resolvedTaskId) {
        throw new Error('[Kafka] publishTaskDeleted requires taskId');
    }

    await producer.send({
        topic: TOPIC,
        messages: [
            {
                key: resolvedTaskId,
                value: JSON.stringify({
                    event: 'TASK_DELETED',
                    taskId: resolvedTaskId,
                    userId: resolvedUserId,
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
                    userId: task.userId.toString(),
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
                    userId: task.userId.toString(),
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