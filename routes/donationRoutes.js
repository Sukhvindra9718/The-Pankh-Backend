const { getAllDonationCount } = require("../controllers/donationController.js");
const { createDonation, getAllDonation, deleteDonation, updateDonation } = require("../controllers/donationController.js");
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware.js");

// Super admin middleware

router.post(
  "/Donation/upload",
  // authMiddleware.authenticationMiddleware,
  // authMiddleware.superAdminMiddleware,
  createDonation
);

// Admin middleware
router.post(
  "/Donation/upload",
  // authMiddleware.authenticationMiddleware,
  // authMiddleware.adminMiddleware,
  createDonation
);

router.get("/Donations", getAllDonation);
router.get("/Donations/count", getAllDonationCount);

router.delete(
  "/Donation/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  deleteDonation
);


router.put(
  "/Donation/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  updateDonation
);

module.exports = router;
