const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

exports.generateToken = (...data) => {
    return jwt.sign(
        ...data,
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

exports.verifyToken = (token) => {
    try{
        return jwt.verify(token, JWT_SECRET);
    }
    catch(error){
        throw { text: 'Invalid or expired token', code: 401 };
    }
    
}