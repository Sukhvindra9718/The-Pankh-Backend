const { addVideo, getAllVideos,getVideo,deleteVideo,getAllVideosCount } = require('../controllers/videoController')
const { videoUpload } = require('../middleware/videoUpload')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');

// Super admin middleware
router.post('/video/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, videoUpload.single('video'), addVideo)
router.delete('/video/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, deleteVideo)
router.get('/getvideo/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllVideosCount)

// Admin middleware
router.post('/video/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, videoUpload.single('video'), addVideo)
router.delete('/video/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, deleteVideo)
router.get('/getvideo/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllVideosCount)

// User middleware
router.get('/videos', getAllVideos)
router.get('/video/:id', getVideo)

module.exports = router