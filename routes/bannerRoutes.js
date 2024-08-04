const {addBanner,getAllBanners,deleteBanner, getBannerByID, updateBanner,getAllBannerCount } = require('../controllers/bannerController')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');

// Super admin middleware
router.post('/banner/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,addBanner)
router.get('/banners',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllBanners)
router.get('/banner/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getBannerByID)
router.delete('/banner/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, deleteBanner)
router.put('/banner/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, updateBanner)
router.get('/getbanner/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllBannerCount)

// Admin middleware
router.post('/banner/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,addBanner)
router.get('/banners',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllBanners)
router.get('/banner/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getBannerByID)
router.delete('/banner/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, deleteBanner)
router.put('/banner/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, updateBanner)
router.get('/getbanner/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllBannerCount)



module.exports = router