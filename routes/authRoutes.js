// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/imageUpload')

router.post('/register',imageUpload.single('image'), authController.registerUser);
router.post('/login', authController.loginUser);
router.put('/update/password',authMiddleware.authenticationMiddleware, authController.updateUserPassword);
router.put('/forgot/password',authMiddleware.authenticationMiddleware,authController.forgotPassword);
router.post('/verify',authMiddleware.verifyToken);
module.exports = router;
