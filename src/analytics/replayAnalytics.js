const { createConsumer } = require("../kafka/consumer");
const { resetStats, applyEvent } = require('./taskStats.store')
const startAnalyticsWorker = require("../kafka/consumers/analyticsWorker");

const replayAnalytics = async () => {
    console.log('[Replay] Starting analytics replay');

    await resetStats();

    const consumer = createConsumer(`analytics-replay-${Date.now()}`);

    await consumer.connect();

    await consumer.subscribe({
        topic: 'task-events-v2',
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async({ message }) => {
            const event = JSON.parse(message.value.toString());
            await applyEvent(event)
        }
    });


}

module.exports = replayAnalytics;