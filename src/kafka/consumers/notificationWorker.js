const { createConsumer } = require('../consumer');


const startNotificationWorker = async () => {
    const consumer = createConsumer('NotificationWorker');

    await consumer.connect();
    await consumer.subscribe({
        topic: 'task-events',
        fromBeginning: true,
    })

    await consumer.run({
        eachMessage: async ( { message } ) => {
            const event = JSON.parse(message.value.toString());

            switch (event.event) {
                case 'TASK_REMINDER':
                    console.log(`[Notify] Reminder: ${event.title}`);
                    break;

                case 'TASK_OVERDUE':
                    console.log(`[Notify] Overdue: ${event.title}`);
                    break;

                default:
                    break;
            }
        }
    })
}

module.exports = startNotificationWorker;