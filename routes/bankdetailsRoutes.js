const {
  createBankDetails,
  getAllBankDetails,
  deleteBankDetails,
  updateBankDetails,
  getAllBankDetailsCount,
} = require("../controllers/BankDetailsController.js");
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware.js");

// Super admin middleware

router.post(
  "/BankDetails/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  createBankDetails
);

// // Admin middleware
router.post(
  "/BankDetails/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.adminMiddleware,
  createBankDetails
);

router.get("/BankDetails", getAllBankDetails);
router.get("/getBankDetails/count", getAllBankDetailsCount);

router.delete(
  "/BankDetails/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  deleteBankDetails
);

router.put(
  "/BankDetails/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  updateBankDetails
);

module.exports = router;
