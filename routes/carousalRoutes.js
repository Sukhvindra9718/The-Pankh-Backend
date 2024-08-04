const {addCarousal,getAllCarousals,deleteCarousal, getCarousalByID, updateCarousal,getAllCarousalCount } = require('../controllers/carousalController')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');

// Super admin middleware
router.post('/carousal/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,addCarousal);
router.get('/carousals',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllCarousals);
router.get('/carousal/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getCarousalByID)
router.delete('/carousal/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,deleteCarousal)
router.put('/carousal/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,updateCarousal);
router.get('/getcarousal/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllCarousalCount)

// Admin middleware
router.post('/carousal/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,addCarousal);
router.get('/carousals',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllCarousals);
router.get('/carousal/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getCarousalByID)
router.delete('/carousal/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,deleteCarousal)
router.put('/carousal/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,updateCarousal);
router.get('/getcarousal/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllCarousalCount)



module.exports = router