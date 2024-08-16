const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary");
const { error } = require("console");

// Projects CRUD
exports.addProject = async (req, res) => {
  try {
    const { title, description, file } = req.body;
    const id = uuid.v4();

    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/projects",
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO projects (id,title,description,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5,$6) RETURNING *",
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
      message: "Project Uploaded Succesfully",
    });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({
        success: false,
        userError: "Server Error",
        error: error.message,
      });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await pool.query("SELECT * FROM projects");
    res.status(200).json({
      success: true,
      projects: projects.rows,
    });

  } catch (error) {
    res.status(200).json({
      success: false,
      error: error.message,
      userError: "Projects fetch failed",
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (projects.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Project not found" });
    }
    res.status(200).json({
      success: true,
      projects: projects.rows[0],
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
    const projects = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (projects) {
      const fileid = projects.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    }

    res.status(200).json({
      success: true,
      message: "Project Deleted Succesfully",
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
    const projects = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (projects.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Project not found" });
    }
    if (file) {
      const fileid = projects.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/projects",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE projects SET fileid = $1, fileurl = $2,title = $3,description=$4 WHERE id = $5",
        [myCloud.public_id, myCloud.secure_url, title, description, id]
      );
    } else {
      await pool.query(
        "UPDATE projects SET title = $1,description=$2 WHERE id = $3",
        [title, description, id]
      );
    }
    res.status(200).json({
      success: true,
      message: "Project Updated Succesfully",
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
    const projects = await pool.query("SELECT count(*) FROM projects");
    res.status(200).json({
      success: true,
      tableName:"Projects",
      count: projects.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Projects fetch failed",
    });
  }
};
