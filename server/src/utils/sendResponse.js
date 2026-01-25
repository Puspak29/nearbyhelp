const sendResponse = (res, statusCode, success, message, data = null) => {
    let response= {
        success,
        message
    }

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
}

module.exports = sendResponse;