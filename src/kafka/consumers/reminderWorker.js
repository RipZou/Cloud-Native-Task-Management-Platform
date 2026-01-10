const Task = require('../../models/task.model');
const { publishTaskReminder, publishTaskOverdue } = require('../taskEvents')

const runReminderCheck = async () => {
    const now = new Date();
    const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const reminderTasks = await Task.find({
        dueAt: { $gt: now, $lte: reminderWindow },
        reminderSent: false,
        completed: false,
    });

    for( const task of reminderTasks) {
        await publishTaskReminder({ task });

        task.reminderSent = true;
        await task.save();
    }

    const overdueTasks = await Task.find({
        dueAt: { $lte: now },
        overdueSent: false,
        completed: false,
    });

    for(const task of overdueTasks) {
        await publishTaskOverdue({ task} );

        task.overdueSent = true;
        await task.save();
    }
}

module.exports = {
    runReminderCheck,
};
