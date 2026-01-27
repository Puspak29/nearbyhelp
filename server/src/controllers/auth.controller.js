const User = require('../models/User');
const handleError = require('../utils/handleError');
const bcrypt = require('bcrypt');
const sendResponse = require('../utils/sendResponse');
const { generateToken } = require('../utils/jwt');

exports.signup = handleError(async (req, res) => {
    const { name, email, password, longitude, latitude } = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return sendResponse(res, 400, false, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name, email, password: hashedPassword,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
    });

    return sendResponse(res, 201, true, 'User registered successfully');
    
}, 'Error occurred during signup');

exports.login = handleError(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return sendResponse(res, 404, false, 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return sendResponse(res, 401, false, 'Invalid credentials');
    }

    const token = generateToken({ id: user._id });

    return sendResponse(res, 200, true, 'Login successful', { token });

}, 'Error occurred during login');