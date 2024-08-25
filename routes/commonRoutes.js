const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController.js');
const authMiddleware = require('../middleware/authMiddleware.js');


// Super admin middleware

// Contact us
router.get('/contact/all', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.getAllContactUs);
router.get('/contact/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.getContactUsById);
router.delete('/contact/delete/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.deleteContactUs);
router.get('/getcontact/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, commonController.getAllContactUsCount)

// Key contact
router.post('/keycontact/register',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.addKeyContact);
router.get('/keycontact/all', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.getAllKeyContact);
router.get('/keycontact/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.getKeyContactById);
router.delete('/keycontact/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.deleteKeyContact);
router.put('/keycontact/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.updateKeyContact);
router.get('/getkeycontact/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware, commonController.getAllkeyContactCount)

// Properties Access
router.post('/PropertiesAccess/Add',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.addPropertiesAccess);
router.get('/PropertiesAccess/all', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.getAllPropertiesAccess);
router.get('/PropertiesAccess/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.getPropertiesAccessById);
router.delete('/PropertiesAccess/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.deletePropertiesAccess);
router.put('/PropertiesAccess/:id', authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.UpdatePropertiesAccess);
router.get('/getTableRow/count',authMiddleware.authenticationMiddleware,authMiddleware.superAdminMiddleware,commonController.getAllTableRowCount)

// Admin middleware

// Contact us
router.get('/contact/all', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.getAllContactUs);
router.get('/contact/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.getContactUsById);
router.delete('/contact/delete/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.deleteContactUs);
router.get('/getcontact/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, commonController.getAllContactUsCount)

// Key contact
router.post('/keycontact/register',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.addKeyContact);
router.get('/keycontact/all', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.getAllKeyContact);
router.get('/keycontact/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.getKeyContactById);
router.delete('/keycontact/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.deleteKeyContact);
router.put('/keycontact/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.updateKeyContact);
router.get('/getkeycontact/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware, commonController.getAllkeyContactCount)

// Properties Access
router.post('/PropertiesAccess/Add',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.addPropertiesAccess);
router.get('/PropertiesAccess/all', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.getAllPropertiesAccess);
router.get('/PropertiesAccess/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.getPropertiesAccessById);
router.delete('/PropertiesAccess/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.deletePropertiesAccess);
router.put('/PropertiesAccess/:id', authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.UpdatePropertiesAccess);
router.get('/getTableRow/count',authMiddleware.authenticationMiddleware,authMiddleware.adminMiddleware,commonController.getAllTableRowCount)

// User middleware
// Contact us
router.post('/contact/register',commonController.registerContactUs);






module.exports = router;
