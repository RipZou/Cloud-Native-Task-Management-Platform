const fakeUser = (req, res, next) => {
    req.user = {
        id: 'default-user',
        email: 'test@example.com',
    };

    next();
};

module.exports = fakeUser;