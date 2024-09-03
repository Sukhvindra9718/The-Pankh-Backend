const {createTestimonial,getAllTestimonial,updateTestimonial,deleteTestimonial,getTestimonialByID} = require('../controllers/testimonialController.js')
const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware.js');

// Super admin middleware
router.post('/testimonial/upload',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,createTestimonial)
router.get('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, getTestimonialByID)
router.delete('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, deleteTestimonial)
router.put('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, updateTestimonial)


// Admin middleware
router.post('/testimonial/upload',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,createTestimonial)
router.get('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, getTestimonialByID)
router.delete('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, deleteTestimonial)
router.put('/testimonial/:id',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, updateTestimonial)



router.get('/testimonials',getAllTestimonial)



module.exports = router