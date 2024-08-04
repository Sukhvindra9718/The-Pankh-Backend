const {createVolunteer,getAllVolunteers,getVolunteerByID,deleteVolunteer,updateVolunteer,getAllVolunteerCount} = require('../controllers/volunteerController.js')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');

// Super admin middleware
router.post('/volunteer/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,createVolunteer)
router.get('/volunteer/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getVolunteerByID)
router.delete('/volunteer/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, deleteVolunteer)
router.put('/volunteer/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, updateVolunteer)
router.get('/getvolunteer/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllVolunteerCount)

// Admin middleware
router.post('/volunteer/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,createVolunteer)
router.get('/volunteer/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getVolunteerByID)
router.delete('/volunteer/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, deleteVolunteer)
router.put('/volunteer/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, updateVolunteer)
router.get('/getvolunteer/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllVolunteerCount)


router.get('/volunteers',getAllVolunteers)



module.exports = router