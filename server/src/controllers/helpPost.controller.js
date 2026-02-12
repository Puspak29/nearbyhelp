const HelpPost = require("../models/HelpPost");
const User = require("../models/User");
const handleError = require("../utils/handleError");
const sendResponse = require("../utils/sendResponse");
const geoUtils = require("../utils/geo")

exports.createHelpPost = handleError( async(req, res) => {
    const { type, title, description, longitude, latitude, category, payment, attachment } = req.body;
    const user = req.user;

    const post = await HelpPost.create({
        user: user._id,
        type, title, description,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude]
        },
        category, payment, attachment
    });
    return sendResponse(res, 201, true, 'Help post created successfully', { post });

}, 'Error occurred while creating help post');

exports.applyToHelpPost = handleError( async(req, res) => {
    const { postId } = req.params;
    const user = req.user;

    const post = await HelpPost.findById(postId);
    if(!post){
        return sendResponse(res, 404, false, 'Help post not found');
    }

    const alreadyApplied = post.applications.some( app => 
        app.user.toString() === user._id.toString()
    )
    if(alreadyApplied){
        return sendResponse(res, 409, false, 'Already applied to this post');
    }

    post.applications.push({
        user: user._id
    });
    await post.save();

    return sendResponse(res, 200, true, 'Applied successfully');
},'Error occurred while applying to help post');

exports.getAllHelpPosts = handleError( async(req, res) => {
    const { type, category, status = 'open', page = 1, limit = 10, distance = 5, unit = 'km' } = req.query;
    const { location } = req.user;
    if(!location || !location.coordinates || location.coordinates.length !== 2){
        return sendResponse(res, 400, false, 'User location is required to fetch nearby posts');
    }

    const nearQuery = geoUtils.buildNearQuery(
        location.coordinates[0],
        location.coordinates[1],
        distance,
        unit
    );

    const filter = {
        location: nearQuery,
        status
    };
    
    if(type) filter.type = type;
    if(category) filter.category = category;

    const skip = (page - 1) * limit;
    const posts = await HelpPost.find(filter)
                    .populate('user', 'name email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit));

    const total = await HelpPost.countDocuments(filter);

    return sendResponse(res, 200, true, 'Posts retrieved successfully', {
        posts,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
        }
    });
}, 'Error occurred while fetching posts');