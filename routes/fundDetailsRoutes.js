const express = require("express");
const router = express.Router();
const { addFundDetails, getAllFundDetails, getFundDetailByID, deleteFundDetails, updateFundDetails, getAllFundDetailsCount } = require("../controllers/fundController.js");
const authMiddleware = require("../middleware/authMiddleware.js");


// Super admin middleware
router.post('/fundDetails/upload', authMiddleware.authenticationMiddleware, authMiddleware.superAdminMiddleware, addFundDetails)
router.get('/fundDetails/:id', authMiddleware.authenticationMiddleware, authMiddleware.superAdminMiddleware, getFundDetailByID)
router.delete('/fundDetails/:id', authMiddleware.authenticationMiddleware, authMiddleware.superAdminMiddleware, deleteFundDetails)
router.put('/fundDetails/:id', authMiddleware.authenticationMiddleware, authMiddleware.superAdminMiddleware, updateFundDetails)
router.get('/getfundDetails/count', authMiddleware.authenticationMiddleware, authMiddleware.superAdminMiddleware, getAllFundDetailsCount)

// Admin middleware
router.post('/fundDetails/upload', authMiddleware.authenticationMiddleware, authMiddleware.adminMiddleware, addFundDetails)
router.get('/fundDetails/:id', authMiddleware.authenticationMiddleware, authMiddleware.adminMiddleware, getFundDetailByID)
router.delete('/fundDetails/:id', authMiddleware.authenticationMiddleware, authMiddleware.adminMiddleware, deleteFundDetails)
router.put('/fundDetails/:id', authMiddleware.authenticationMiddleware, authMiddleware.adminMiddleware, updateFundDetails)
router.get('/getfundDetails/count', authMiddleware.authenticationMiddleware, authMiddleware.adminMiddleware, getAllFundDetailsCount)


router.get('/fundDetails', getAllFundDetails)

module.exports = router;