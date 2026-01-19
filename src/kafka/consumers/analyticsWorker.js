const { createConsumer } = require("../consumer");
const { applyEvent } = require("../../analytics/taskStats.store");

const TOPIC = 'task-events-v2';
const GROUP_ID = 'analytics-worker';

let consumer = null;
let started = false;

const startAnalyticsWorker = async () => {
    if (started) return;

    consumer = createConsumer(GROUP_ID);

    await consumer.connect();
    await consumer.subscribe({
        topic: TOPIC,
        fromBeginning: true,
    });

    const shutdown = async () => {
        console.log('[AnalyticsWorker] shutting down...');
        if (consumer) await consumer.disconnect();
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

    started = true;
}

const pauseAnalyticsWorker = () => {
    if (!consumer) return;
    consumer.pause([{ topic: TOPIC }]);
};

const resumeAnalyticsWorker = () => {
    if (!consumer) return;
    consumer.resume([{ topic: TOPIC }]);
};

/**
 * Commit offsets for the analytics worker group.
 * Offsets must be the "next offset to consume" (high watermark), i.e. committing
 * the latest offset means the group will start from the end.
 */
const commitAnalyticsWorkerOffsets = async (offsets) => {
    if (!consumer) return;
    await consumer.commitOffsets(
        offsets.map(({ topic, partition, offset }) => ({
            topic,
            partition,
            offset: String(offset),
        }))
    );
};

const isAnalyticsWorkerStarted = () => started;

module.exports = startAnalyticsWorker;
module.exports.pauseAnalyticsWorker = pauseAnalyticsWorker;
module.exports.resumeAnalyticsWorker = resumeAnalyticsWorker;
module.exports.commitAnalyticsWorkerOffsets = commitAnalyticsWorkerOffsets;
module.exports.isAnalyticsWorkerStarted = isAnalyticsWorkerStarted;
module.exports.TOPIC = TOPIC;
module.exports.GROUP_ID = GROUP_ID;