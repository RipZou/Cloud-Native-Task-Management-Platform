const { createConsumer } = require("../consumer");
const { applyEvent } = require("../../analytics/taskStats.store");

const startAnalyticsWorker = async () => {
    const consumer = createConsumer('analytics-worker');

    await consumer.connect();
    await consumer.subscribe({
        topic: 'task-events',
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = JSON.parse(message.value.toString());

            applyEvent(event);

            console.log(
                `[Analytics] applied ${event.event} taskId=${event.taskId}`
            );
        }
    })
}

module.exports = startAnalyticsWorker;