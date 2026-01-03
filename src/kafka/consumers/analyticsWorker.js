const { createConsumer } = require("../consumer");

let taskCreatedCount = 0;

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

            if(event.event === 'TASK_CREATED') {
                taskCreatedCount += 1;
                console.log(`[Analytics] totalTasksCreated=${taskCreatedCount}`)
            }
        }
    })
}

module.exports = startAnalyticsWorker;