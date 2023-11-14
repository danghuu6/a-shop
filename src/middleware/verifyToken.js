const jwt = require('jsonwebtoken');

const message = require('../constant/message')

module.exports = (req, res, next) => {
    const bearerToken  = req.header('authorization');
    const token = bearerToken.split(' ')[1];

    if (!token) return res.status(401).send(message.UNAUTHORIZED);

    try {
        jwt.verify(token, process.env.TOKEN_SECRET);

        next();
    } catch (err) {
        return res.status(400).send(message.INVALID_TOKEN);
    }
};
