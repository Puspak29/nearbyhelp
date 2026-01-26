const { JWT_SECRET } = require("../config/env")
const handleError = require("../utils/handleError");
const sendResponse = require("../utils/sendResponse");
const { verifyToken } = require("../utils/jwt");

exports.authenticate = handleError( async (req, res, next) => {
    if(!JWT_SECRET){
        console.error("FATAL ERROR: JWT_SECRET is not defined");
        return sendResponse(res, 500, false, 'Internal server error');
    }

    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return sendResponse(res, 401, false, 'Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        return sendResponse(res, 401, false, 'Auth token missing');
    }

    const verification = verifyToken(token);
    req.user = verification;
    next();
}, 'Error occurred during authentication');