// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


// Super admin middleware
router.get('/id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.getUserById);
router.get('/username', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.getUserByUsername);
router.put('/update', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.updateUser);
router.delete('/delete/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.deleteUser);
router.get('/all', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,userController.getAllUsers);
router.get('/getuser/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, userController.getAllUserCount)

// Admin middleware
router.get('/id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.getUserById);
router.get('/username', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.getUserByUsername);
router.put('/update', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.updateUser);
router.delete('/delete/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.deleteUser);
router.get('/all',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,userController.getAllUsers);
router.get('/getuser/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, userController.getAllUserCount)


module.exports = router;
