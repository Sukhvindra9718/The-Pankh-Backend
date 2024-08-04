const { createNews, getAllNews } = require("../controllers/newsController.js");
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware.js");

// Super admin middleware

router.post(
  "/news/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  createNews
);

// Admin middleware
router.post(
  "/news/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.adminMiddleware,
  createNews
);

router.get("/news", getAllNews);

module.exports = router;
