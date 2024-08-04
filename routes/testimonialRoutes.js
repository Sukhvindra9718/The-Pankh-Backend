const {createTestimonial,getAllTestimonial,updateTestimonial,deleteTestimonial,getTestimonialByID,getAllTestimonialCount} = require('../controllers/testimonialController.js')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');

// Super admin middleware
router.post('/testimonial/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,createTestimonial)
router.get('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getTestimonialByID)
router.delete('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, deleteTestimonial)
router.put('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, updateTestimonial)
router.get('/gettestimonial/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getAllTestimonialCount)

// Admin middleware
router.post('/testimonial/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,createTestimonial)
router.get('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getTestimonialByID)
router.delete('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, deleteTestimonial)
router.put('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, updateTestimonial)
router.get('/gettestimonial/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getAllTestimonialCount)


router.get('/testimonials',getAllTestimonial)



module.exports = router