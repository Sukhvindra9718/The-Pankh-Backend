const { createNews, getAllNews, deleteNews, updateNews, getAllNewsCount, getTopTwoNews } = require("../controllers/newsController.js");
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
router.get("/twonews", getTopTwoNews)

router.delete(
  "/news/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  deleteNews
);

router.put(
  "/news/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  updateNews
);

router.get("/countNews/count", authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware, getAllNewsCount);
module.exports = router;
