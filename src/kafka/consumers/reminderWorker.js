const Task = require('../../models/task.model');

const runReminderCheck = async () => {
    const now = new Date();
    const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);



    console.log('[ReminderWorker] tick', new Date().toISOString());

    const allTasks = await Task.find({});

    console.log('[ReminderWorker] total tasks =', allTasks.length);

    allTasks.forEach(t => {
        console.log('[Task]', {
            id: t._id.toString(),
            title: t.title,
            dueAt: t.dueAt,
            dueAtType: typeof t.dueAt,
            completed: t.completed,
            reminderSent: t.reminderSent,
            overdueSent: t.overdueSent,
        });
    });



    const reminderTasks = await Task.find({
        dueAt: { $gt: now, $lte: reminderWindow },
        reminderSent: false,
        completed: false,
    });

    for( const task of reminderTasks) {
        console.log(`[Reminder] Task ${task.title} is due soon`);

        task.reminderSent = true;
        await task.save();
    }

    const overdueTasks = await Task.find({
        dueAt: { $lte: now },
        overdueSent: false,
        completed: false,
    });

    for(const task of overdueTasks) {
        console.log(`[Reminder] Task ${task.title} is overdue`);

        task.overdueSent = true;
        await task.save();
    }
}

module.exports = {
    runReminderCheck,
};
