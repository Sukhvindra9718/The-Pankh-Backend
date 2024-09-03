const { addVideo, getAllVideos,getVideo,deleteVideo,updateVideo} = require('../controllers/videoController')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');

// Super admin middleware
router.post('/video/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, addVideo)
router.delete('/video/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, deleteVideo)
router.put('/video/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, updateVideo)

// Admin middleware
router.post('/video/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, addVideo)
router.delete('/video/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, deleteVideo)
router.put('/video/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, updateVideo)


// User middleware
router.get('/videos', getAllVideos)
router.get('/video/:id', getVideo)

module.exports = router