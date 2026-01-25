const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

exports.generateToken = (id, email) => {
    return jwt.sign(
        { id, email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}