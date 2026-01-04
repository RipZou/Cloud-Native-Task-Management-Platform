const { createConsumer } = require("../kafka/consumer");
const { resetStats, applyEvent } = require('./taskStats.store')
const startAnalyticsWorker = require("../kafka/consumers/analyticsWorker");

const replayAnalytics = async () => {
    console.log('[Replay] Starting analytics replay');

    resetStats();

    const consumer = createConsumer('analytics-replay');

    await consumer.connect();

    await consumer.subscribe({
        topic: 'task-events',
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async({ message }) => {
            const event = JSON.parse(message.value.toString());
            applyEvent(event)
        }
    });


}

module.exports = startAnalyticsWorker;