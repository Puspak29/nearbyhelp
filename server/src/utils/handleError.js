const sendResponse = require('./sendResponse');

const handleError = (fn, errorMessage) => {
    return async (req, res) => {
        try {
            await fn(req, res);
        }
        catch(error) {
            return sendResponse(res, 500, false, errorMessage);
        }
    }
}

module.exports = handleError;