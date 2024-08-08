const {addImage,getAllImages,getImage,deleteImage,updateImage,getAllImagesCount } = require('../controllers/imageController')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');


// Super admin middleware
router.post('/image/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, addImage)
router.delete('/image/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, deleteImage)
router.put('/image/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, updateImage)
router.get('/getimage/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllImagesCount)

// Admin middleware
router.post('/image/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,addImage)
router.delete('/image/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, deleteImage)
router.put('/image/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, updateImage)
router.get('/getimage/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllImagesCount)


// User middleware
router.get('/images', getAllImages)
router.get('/image/:id', getImage)

module.exports = router