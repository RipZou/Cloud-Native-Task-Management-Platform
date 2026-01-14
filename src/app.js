const express = require("express");
const healthRoutes = require("./routes/health.routes");
const taskRoutes = require("./routes/task.routes");
const notificationRoutes = require('./routes/notification.routes');
const fakeUser = require('./middlewares/fakeUser');

const errorHandler = require("./middlewares/errorhandler");
const requestId = require("./middlewares/requestId");
const logger = require("./middlewares/logger");
const analyticsRoutes = require('./routes/analytics.routes');

// 创建 express 的应用实例，这个实例就是 app
const app = express();

// app.use() 是注册中间件的意思，也就是在使用前要先经过中间件
// 可以有多个中间件，按照写的顺序依次经过所有中间件
app.use(express.json());
app.use(requestId);
app.use(logger);

// temp
app.use(fakeUser);

app.use("/health", healthRoutes)
app.use("/tasks", taskRoutes)
app.use("/analytics", analyticsRoutes)
app.use("/notifications", notificationRoutes)

app.use(errorHandler);

// app.get 代表处理一个 get 请求，然后请求的路径是 /health
// 说白了就是用人用 /health 的 get 请求，执行下面的东西
// app.get("/health", (req, res) => {
//     res.json({status: "ok"})
// })

module.exports = app;