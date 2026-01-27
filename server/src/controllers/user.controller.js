const User = require("../models/User");
const handleError = require("../utils/handleError");
const sendResponse = require("../utils/sendResponse");

exports.createProfile = handleError( async (req, res) => {
    const user=req.user;
    const { skills, role, avatarUrl, about } = req.body;
    user.skills = skills || user.skills;
    user.role = role || user.role;
    user.avatarUrl = avatarUrl || user.avatarUrl;
    user.about = about || user.about;

    await user.save();

    return sendResponse(res, 200, true, 'Profile updated successfully', { 
        skills: user.skills,
        role: user.role,
        avatarUrl: user.avatarUrl,
        about: user.about
    });
}, 'Error occurred while creating profile');

exports.getProfile = handleError(async (req, res) => {
    const user = req.user;
    return sendResponse(res, 200, true, 'Profile fetched successfully', { user });
}, 'Error occurred while fetching profile');