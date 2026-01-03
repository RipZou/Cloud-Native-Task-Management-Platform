const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'task-service',
    brokers: ['localhost:9092'],
});

const createConsumer = (groupId) => {
    return kafka.consumer({ groupId });
};

module.exports = {
    createConsumer,
};
