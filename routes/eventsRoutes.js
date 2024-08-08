const { createEvents, getAllEvents, deleteEvents, updateEvents } = require("../controllers/eventsController.js");
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware.js");

// Super admin middleware

router.post(
  "/events/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  createEvents
);

// Admin middleware
router.post(
  "/events/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.adminMiddleware,
  createEvents
);

router.get("/events", getAllEvents);
router.delete(
  "/events/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  deleteEvents
);

router.put(
  "/events/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  updateEvents
);

module.exports = router;
