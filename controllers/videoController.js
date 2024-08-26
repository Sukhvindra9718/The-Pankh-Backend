const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary").v2;

exports.addVideo = async (req, res) => {
  try {
    const { title, description, url, file } = req.body;
    const id = uuid.v4();
    const myCloud = await cloudinary.uploader.upload(file, {
      folder: "thepankh/thumbnail",
      Crop: "fill",
    });

    await pool.query(
      "INSERT INTO videos (id, title, description, url, fileid, fileurl, createdat) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        title,
        description,
        url,
        myCloud.public_id,
        myCloud.secure_url,
        new Date(),
      ]
    );

    res.status(200).json({
      success: true,
      message: "Video Uploaded Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const [videos] = await pool.query("SELECT * FROM videos");
    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Videos fetch failed",
    });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [video] = await pool.query("SELECT * FROM videos WHERE id = ?", [id]);
    if (video.length === 0) {
      return res.status(404).json({ success: false, msg: "Video not found" });
    }
    res.status(200).json({
      success: true,
      video: video[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Video fetch failed",
    });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [video] = await pool.query("SELECT * FROM videos WHERE id = ?", [id]);
    if (video.length === 0) {
      return res.status(404).json({ success: false, msg: "Video not found" });
    }

    const fileid = video[0].fileid;
    await cloudinary.uploader.destroy(fileid);
    await pool.query("DELETE FROM videos WHERE id = ?", [id]);
    res.status(200).json({
      success: true,
      message: "Video Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Video delete failed",
    });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, file } = req.body;
    const [video] = await pool.query("SELECT * FROM videos WHERE id = ?", [id]);
    if (video.length === 0) {
      return res.status(404).json({ success: false, msg: "Video not found" });
    }

    if (file) {
      const myCloud = await cloudinary.uploader.upload(file, {
        folder: "thepankh/thumbnail",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE videos SET title = ?, description = ?, url = ?, fileid = ?, fileurl = ? WHERE id = ?",
        [
          title,
          description,
          url,
          myCloud.public_id,
          myCloud.secure_url,
          id,
        ]
      );
      const oldFileId = video[0].fileid;
      await cloudinary.uploader.destroy(oldFileId);
    } else {
      await pool.query(
        "UPDATE videos SET title = ?, description = ?, url = ? WHERE id = ?",
        [title, description, url, id]
      );
    }

    res.status(200).json({
      success: true,
      message: "Video Updated Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Video update failed",
    });
  }
};

exports.getAllVideosCount = async (req, res) => {
  try {
    const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM videos");
    res.status(200).json({
      success: true,
      tableName: "Videos",
      count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Videos fetch failed",
    });
  }
};
