const sendResponse = require('./sendResponse');

const handleError = (fn, errorMessage = 'Something went wrong') => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch(error) {
            console.error('Error:', error);
            const message = error.text || errorMessage;
            const statusCode = error.code || 500;
            return sendResponse(res, statusCode, false, message);
        }
    }
}

module.exports = handleError;