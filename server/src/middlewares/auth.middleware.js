const { JWT_SECRET } = require("../config/env")
const handleError = require("../utils/handleError");
const sendResponse = require("../utils/sendResponse");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

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
    const userId = verification.id;
    const user = await User.findById(userId).select('-password');
    if(!user){
        return sendResponse(res, 404, false, 'User not found');
    }
    req.user = user;
    next();
}, 'Error occurred during authentication');


/**
 * @param {Object} policy
 * Example:
 * {
 *   requester: ['request'],
 *   helper: ['offer'],
 *   both: ['request', 'offer'],
 *   admin: ['*']
 * }
 */
exports.authorizePostType = (rule = {}) => {
    return (req, res, next) => {
        const role = req.user?.role;
        const type = req.body.type;

        if(!role || !type){
            return sendResponse(res, 400, false, 'Role or Post type missing');
        }

        const allowedTypes = rule[role];
        if(!allowedTypes){
            return sendResponse(res, 403, false, 'Role not authorized');
        }

        if(!allowedTypes.includes(type) && !allowedTypes.includes('*')){
            return sendResponse(res, 403, false, 'Action not permitted for this role');
        }

        next();
    };
}