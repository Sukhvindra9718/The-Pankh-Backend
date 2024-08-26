const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Projects CRUD
exports.addProject = async (req, res) => {
  try {
    const { title, description, file } = req.body;
    const id = uuid.v4();

    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/projects",
      crop: "fill",
    });

    await pool.query(
      "INSERT INTO projects (id, title, description, fileid, fileurl, createdat) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id,
        title,
        description,
        myCloud.public_id,
        myCloud.secure_url,
        new Date(),
      ]
    );

    res.status(200).json({
      success: true,
      message: "Project Uploaded Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await pool.query("SELECT * FROM projects");
    res.status(200).json({
      success: true,
      projects: projects,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Projects fetch failed",
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (projects.length === 0) {
      return res.status(404).json({ success: false, msg: "Project not found" });
    }
    res.status(200).json({
      success: true,
      projects: projects[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Project fetch failed",
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (projects.length > 0) {
      const fileid = projects[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM projects WHERE id = ?", [id]);
    }

    res.status(200).json({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Project delete failed",
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, file } = req.body;
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (projects.length === 0) {
      return res.status(404).json({ success: false, msg: "Project not found" });
    }
    if (file) {
      const fileid = projects[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/projects",
        crop: "fill",
      });
      await pool.query(
        "UPDATE projects SET fileid = ?, fileurl = ?, title = ?, description = ? WHERE id = ?",
        [myCloud.public_id, myCloud.secure_url, title, description, id]
      );
    } else {
      await pool.query(
        "UPDATE projects SET title = ?, description = ? WHERE id = ?",
        [title, description, id]
      );
    }
    res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Project update failed",
    });
  }
};

exports.getAllProjectsCount = async (req, res) => {
  try {
    const [[projectsCount]] = await pool.query("SELECT COUNT(*) AS count FROM projects");
    res.status(200).json({
      success: true,
      tableName: "Projects",
      count: projectsCount.count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Projects fetch failed",
    });
  }
};
