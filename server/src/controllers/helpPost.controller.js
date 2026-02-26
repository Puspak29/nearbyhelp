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
                    .populate('user', 'name username')
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

exports.viewHelpPostDetails = handleError( async(req, res) => {
    const { postId } = req.params;

    const post = await HelpPost.findById(postId)
                    .populate('user', 'name username');
    
    if(!post){
        return sendResponse(res, 404, false, 'Help post not found');
    }

    const data = {
        ...post.toObject(),
        applicationCount: post.applications.length,
    }

    return sendResponse(res, 200, true, 'Post details fetched successfully', { data });
}, 'Error occured while fetching post details');

exports.processApplication = handleError( async(req, res) => {
    const { postId, applicantId } = req.params;
    const { action } = req.body; // 'in-review', 'selected' or 'rejected'
    const user = req.user;

    if (!['in-review', 'selected', 'rejected'].includes(action)) {
        return sendResponse(res, 400, false, "Invalid action");
    }

    const post = await HelpPost.findById(postId);
    if(!post){
        return sendResponse(res, 404, false, 'Help post not found');
    }
    if(post.user.toString() !== user._id.toString()){
        return sendResponse(res, 403, false, 'Only post creator can process applications');
    }
    if(post.status !== 'open'){
        return sendResponse(res, 400, false, 'Cannot process applications for closed post');
    }

    const application = post.applications.find(app => app.user.toString() === applicantId);
    if(!application){
        return sendResponse(res, 404, false, 'Application not found');
    }

    if(application.status === 'selected' || application.status === 'rejected'){
        return sendResponse(res, 400, false, 'Application already processed');
    }

    application.status = action;
    if(post.status === 'open'){
        post.status = 'in-progress';
    }
    await post.save();

    return sendResponse(res, 200, true, `Application ${action} successfully`);

}, 'Error occurred while accepting/rejecting application');

exports.getAllApplicantsForPost = handleError( async(req, res) => {
    const { postId } = req.params;
    const user = req.user;
    const post = await HelpPost.findById(postId).populate('applications.user', 'name username');
    if(!post){
        return sendResponse(res, 404, false, 'Help post not found');
    }
    if(post.user.toString() !== user._id.toString()){
        return sendResponse(res, 403, false, 'Only post creator can view applicants');
    }

    const applicants = post.applications.map(app => ({
        user: app.user,
        status: app.status,
        appliedAt: app.createdAt
    }));

    return sendResponse(res, 200, true, 'Applicants retrieved successfully', { applicants });
}, 'Error occurred while fetching applicants for post');

exports.updateStatus = handleError( async(req, res) => {
    const { postId } = req.params;
    const { status } = req.body;
    const user = req.user;

    if(!['in-progress', 'completed', 'cancelled'].includes(status)) {
        return sendResponse(res, 400, false, "Invalid status");
    }

    const post = await HelpPost.findById(postId);
    if(!post){
        return sendResponse(res, 404, false, 'Help post not found');
    }
    if(post.user.toString() !== user._id.toString()){
        return sendResponse(res, 403, false, 'Only post creator can update status');
    }

    if(post.status === 'completed' || post.status === 'cancelled'){
        return sendResponse(res, 400, false, 'Cannot update status of completed/cancelled post');
    }
    post.status = status;
    if(status === 'completed'){
        post.completedAt = new Date();
    }
    else if(status === 'cancelled'){
        post.cancelledAt = new Date();
    }
    await post.save();

    return sendResponse(res, 200, true, 'Post status updated successfully');
}, 'Error occurred while updating post status');