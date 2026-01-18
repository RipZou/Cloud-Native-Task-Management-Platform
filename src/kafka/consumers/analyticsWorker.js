const { createConsumer } = require("../consumer");
const { applyEvent } = require("../../analytics/taskStats.store");

const startAnalyticsWorker = async () => {
    const consumer = createConsumer('analytics-worker');

    await consumer.connect();
    await consumer.subscribe({
        topic: 'task-events-v2',
        fromBeginning: true,
    });

    const shutdown = async () => {
        console.log('[AnalyticsWorker] shutting down...');
        await consumer.disconnect();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);


    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = JSON.parse(message.value.toString());

            await applyEvent(event);

            console.log(
                `[Analytics] applied ${event.event} taskId=${event.taskId}`
            );
        }
    })
}

module.exports = startAnalyticsWorker;