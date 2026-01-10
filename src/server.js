require("dotenv").config()

const app = require("./app")
const connectDB = require("./db/mongoose")
const { connectKafka } = require('./kafka/client');
const startTaskWorker = require("./kafka/consumers/taskWorker")
const startAnalyticsWorker = require("./kafka/consumers/analyticsWorker")
const startNotificationWorker = require("./kafka/consumers/notificationWorker")
const { runReminderCheck } = require('./kafka/consumers/reminderWorker');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try{
        await connectDB();
        await connectKafka();

        startTaskWorker();
        startAnalyticsWorker();
        startNotificationWorker();

        // 3️⃣ 启动 reminder worker（定时任务）
        setInterval(async () => {
            try {
                await runReminderCheck();
            } catch (err) {
                console.error('[ReminderWorker]', err);
            }
        }, 60 * 1000);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });

    } catch(err){
        console.log("Failed to start server:", err);
        process.exit(1);
    }
}

startServer()
