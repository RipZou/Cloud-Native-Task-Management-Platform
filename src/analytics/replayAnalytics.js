const { createConsumer } = require("../kafka/consumer");
const { kafka } = require('../kafka/client');
const { resetAllStats, applyEvent } = require('./taskStats.store');
const {
    pauseAnalyticsWorker,
    resumeAnalyticsWorker,
    TOPIC,
    GROUP_ID,
} = require("../kafka/consumers/analyticsWorker");

let replayState = {
    running: false,
    startedAt: null,
    finishedAt: null,
    replayedMessages: 0,
    error: null,
};

const normalizeEndOffsets = (raw) => {
    // Supports kafkajs return shapes:
    // - [{ partition, offset }]
    // - [{ partition, low, high }]
    return raw.map((p) => {
        const endOffset = p.high ?? p.offset; // "next offset" (high watermark)
        return {
            partition: p.partition,
            endOffset: Number(endOffset),
        };
    });
};

const startReplayAnalytics = async () => {
    if (replayState.running) {
        const err = new Error('Replay already running');
        err.code = 'REPLAY_RUNNING';
        throw err;
    }

    replayState = {
        running: true,
        startedAt: new Date().toISOString(),
        finishedAt: null,
        replayedMessages: 0,
        error: null,
    };

    console.log('[Replay] Starting analytics replay');

    const admin = kafka.admin();
    const replayConsumer = createConsumer(`analytics-replay-${Date.now()}`);

    try {
        // 1) Pause realtime worker so we don't race updates during reset/rebuild
        pauseAnalyticsWorker();

        // 2) Capture a watermark (end offsets) at the START of replay
        await admin.connect();
        const topicOffsets = await admin.fetchTopicOffsets(TOPIC);
        const watermark = normalizeEndOffsets(topicOffsets);

        // 3) Reset all stats (system-level rebuild)
        await resetAllStats();

        // 4) Replay from beginning up to watermark
        await replayConsumer.connect();
        await replayConsumer.subscribe({ topic: TOPIC, fromBeginning: true });

        const processed = new Map(); // partition -> lastProcessedOffset (number)
        const donePartition = (partition) => {
            const end = watermark.find((w) => w.partition === partition);
            if (!end) return true;
            // If endOffset is 0, partition is empty => done
            if (end.endOffset <= 0) return true;
            const last = processed.get(partition);
            return typeof last === 'number' && last >= end.endOffset - 1;
        };

        const allDone = () => watermark.every((w) => donePartition(w.partition));

        await replayConsumer.run({
            eachMessage: async ({ partition, message }) => {
                // Stop applying once we've reached the watermark for this partition
                const end = watermark.find((w) => w.partition === partition);
                const endOffset = end ? end.endOffset : 0;
                const msgOffset = Number(message.offset);

                // message.offset is the current message offset; watermark is "next offset"
                // so the last message we want is endOffset - 1.
                if (endOffset <= 0 || msgOffset > endOffset - 1) {
                    // Just update progress and allow loop to finish; we will stop globally below.
                    processed.set(partition, Math.max(processed.get(partition) ?? -1, msgOffset));
                    return;
                }

                const event = JSON.parse(message.value.toString());
                await applyEvent(event);

                replayState.replayedMessages += 1;
                processed.set(partition, msgOffset);

                if (allDone()) {
                    // Stop the consumer run loop ASAP
                    await replayConsumer.stop();
                }
            }
        });

        // 5) Align realtime worker group offsets to watermark, so it only processes NEW events
        await admin.setOffsets({
            groupId: GROUP_ID,
            topic: TOPIC,
            partitions: watermark.map((w) => ({
                partition: w.partition,
                offset: String(w.endOffset), // next offset to consume
            })),
        });
    } catch (e) {
        replayState.error = e?.message ?? String(e);
        console.log('[Replay] failed:', e);
        throw e;
    } finally {
        try {
            await replayConsumer.disconnect();
        } catch (e) {}
        try {
            await admin.disconnect();
        } catch (e) {}

        resumeAnalyticsWorker();

        replayState.running = false;
        replayState.finishedAt = new Date().toISOString();
        console.log('[Replay] Finished analytics replay');
    }
};

const getReplayStatus = () => replayState;

module.exports = {
    startReplayAnalytics,
    getReplayStatus,
};