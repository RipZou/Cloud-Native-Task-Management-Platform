const { createConsumer } = require('../consumer');

const startTaskWorker = async () => {
    const consumer = createConsumer('task-worker');

    await consumer.connect();
    await consumer.subscribe({
        topic: 'task-events-v2',
        from: true,
    });

    const shutdown = async () => {
        console.log('[TaskWorker] shutting down...');
        await consumer.disconnect();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);


    await consumer.run({
        eachMessage: async({ topic, partition, message }) => {
            const event = JSON.parse(message.value.toString());

            console.log(
                `[TaskWorker] event=${event.event} taskId=${event.taskId} requestId=${event.requestId}`
            );
        }
    });
}

module.exports = startTaskWorker;
