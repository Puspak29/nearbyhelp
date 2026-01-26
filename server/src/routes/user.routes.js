const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/profile', authMiddleware.authenticate, userController.createProfile);
router.get('/profile', authMiddleware.authenticate, userController.getProfile);

module.exports = router;