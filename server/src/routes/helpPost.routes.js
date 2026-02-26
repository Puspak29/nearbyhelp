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

router.get('/:postId', authMiddleware.authenticate, helpPostController.viewHelpPostDetails);
router.get('/:postId/applications', authMiddleware.authenticate, helpPostController.getAllApplicantsForPost);
router.patch('/:postId/status', authMiddleware.authenticate, helpPostController.updateStatus);
router.patch('/:postId/applications/:applicantId', authMiddleware.authenticate, helpPostController.processApplication);

module.exports = router;