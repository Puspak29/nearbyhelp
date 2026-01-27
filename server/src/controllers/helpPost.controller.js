const HelpPost = require("../models/HelpPost");
const User = require("../models/User");
const handleError = require("../utils/handleError");
const sendResponse = require("../utils/sendResponse");

exports.createHelpPost = handleError( async(req, res) => {
    const { type, title, description, longitude, latitude, category, payment, attachment } = req.body;
    const user = req.user;

    const post = await HelpPost.create({
        user: user.id,
        type, title, description,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude]
        },
        category, payment, attachment
    });
    return sendResponse(res, 201, true, 'Help post created successfully', { post });

}, 'Error occurred while creating help post');