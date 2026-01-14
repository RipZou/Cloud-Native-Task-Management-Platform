const { createConsumer } = require('../consumer');
const Notification = require('../../models/Notification.model');

const startNotificationWorker = async () => {
    const consumer = createConsumer('NotificationWorker');

    await consumer.connect();
    await consumer.subscribe({
        topic: 'task-events',
        fromBeginning: false,
    })

    await consumer.run({
        eachMessage: async ( { message } ) => {
            const event = JSON.parse(message.value.toString());

            switch (event.event) {
                case 'TASK_REMINDER':
                    console.log(`[Notify] Reminder: ${event.title}`);
                    await Notification.create({
                        userId: event.userId,
                        type: 'TASK_REMINDER',
                        taskId: event.taskId,
                        title: event.title,
                        message: `Task "${event.title}" is due soon`,
                    });
                    break;

                case 'TASK_OVERDUE':
                    console.log(`[Notify] Overdue: ${event.title}`);
                    await Notification.create({
                        userId: event.userId,
                        type: 'TASK_OVERDUE',
                        taskId: event.taskId,
                        title: event.title,
                        message: `Task "${event.title}" is overdue`,
                    });
                    break;

                default:
                    break;
            }
        }
    })
}

module.exports = startNotificationWorker;