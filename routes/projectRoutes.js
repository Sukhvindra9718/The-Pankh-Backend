const {addProject,getAllProjects,updateProject,deleteProject  } = require("../controllers/projectController.js");
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware.js");

// Super admin middleware

router.post(
  "/project/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  addProject
);

// Admin middleware
router.post(
  "/project/upload",
  authMiddleware.authenticationMiddleware,
  authMiddleware.adminMiddleware,
  addProject
);

router.get("/projects", getAllProjects);

router.delete(
  "/project/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  deleteProject
);

router.put(
  "/project/:id",
  authMiddleware.authenticationMiddleware,
  authMiddleware.superAdminMiddleware,
  updateProject
);

module.exports = router;
