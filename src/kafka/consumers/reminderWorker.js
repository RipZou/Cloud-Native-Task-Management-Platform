const Task = require('../../models/task.model');
const { publishTaskReminder, publishTaskOverdue } = require('../taskEvents');

let timer = null;

const runReminderCheck = async () => {
    const now = new Date();
    const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 即将到期
    const reminderTasks = await Task.find({
        dueAt: { $gt: now, $lte: reminderWindow },
        reminderSent: false,
        completed: false,
    });

    for (const task of reminderTasks) {
        await publishTaskReminder({ task });
        task.reminderSent = true;
        await task.save();
    }

    // 已逾期
    const overdueTasks = await Task.find({
        dueAt: { $lte: now },
        overdueSent: false,
        completed: false,
    });

    for (const task of overdueTasks) {
        await publishTaskOverdue({ task });
        task.overdueSent = true;
        await task.save();
    }
};

const startReminderWorker = () => {
    console.log('[ReminderWorker] started');

    timer = setInterval(async () => {
        try {
            await runReminderCheck();
        } catch (err) {
            console.error('[ReminderWorker]', err);
        }
    }, 60 * 1000);
};

const stopReminderWorker = () => {
    if (timer) {
        console.log('[ReminderWorker] stopping');
        clearInterval(timer);
        timer = null;
    }
};

module.exports = {
    startReminderWorker,
    stopReminderWorker,
};