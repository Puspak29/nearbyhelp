const express = require('express');
const router = express.Router();
const helpPostController = require('../controllers/helpPost.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
    '/', 
    authMiddleware.authenticate, 
    authMiddleware.authorizePostType({
        requester: ['request'],
        helper: ['offer'],
        both: ['request', 'offer']
        // admin: ['*']
    }),
    helpPostController.createHelpPost);

router.get('/', authMiddleware.authenticate, helpPostController.getAllHelpPosts);

router.post(
    '/:postId/apply',
    authMiddleware.authenticate,
    authMiddleware.authorizePostType({
        requester: ['request'],
        helper: ['offer'],
        both: ['request', 'offer']
        // admin: ['*']
    }),
    helpPostController.applyToHelpPost);

module.exports = router;