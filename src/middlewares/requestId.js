const { randomUUID } = require('crypto');

const requestId = (req, res, next) => {
    const id = randomUUID();

    req.requestId = id;
    res.setHeader('X-Reqeust-Id', id);

    next();
}

module.exports = requestId;