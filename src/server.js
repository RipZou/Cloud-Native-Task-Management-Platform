require("dotenv").config()

const app = require("./app")
const connectDB = require("./db/mongoose")
const { connectKafka } = require('./kafka/client');
const startTaskWorker = require("./kafka/consumers/taskWorker")
const startAnalyticsWorker = require("./kafka/consumers/analyticsWorker")
const startNotificationWorker = require("./kafka/consumers/notificationWorker")
const { startReminderWorker, stopReminderWorker } = require('./kafka/consumers/reminderWorker');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try{
        await connectDB();
        await connectKafka();

        startTaskWorker();
        startAnalyticsWorker();
        startNotificationWorker();
        startReminderWorker();


        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });

    } catch(err){
        console.log("Failed to start server:", err);
        process.exit(1);
    }
}

const shutdown = async () => {
    console.log('Shutting down...');
    stopReminderWorker();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer()
