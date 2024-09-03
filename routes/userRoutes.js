// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


// Super admin middleware
router.put('/update/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.updateUser);
router.delete('/delete/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.deleteUser);
router.get('/getallusers', authMiddleware.authenticationMiddleware,userController.getAllUsers);
router.get('/user/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.getUserById);
router.get('/user/:username', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.getUserByUsername);

// Admin middleware
router.put('/update/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.updateUser);
router.delete('/delete/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.deleteUser);
router.get('/getallusers',authMiddleware.authenticationMiddleware,userController.getAllUsers);
router.get('/user/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.getUserById);
router.get('/user/:username', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.getUserByUsername);


module.exports = router;
