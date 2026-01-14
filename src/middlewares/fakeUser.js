const mongoose = require('mongoose')

const fakeUser = (req, res, next) => {
    req.user = {
        id: new mongoose.Types.ObjectId('000000000000000000000001'),
        email: 'test@example.com',
    };

    next();
};

module.exports = fakeUser;