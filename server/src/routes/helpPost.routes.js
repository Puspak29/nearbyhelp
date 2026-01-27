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

module.exports = router;