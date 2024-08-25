const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary");


const createVideoTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      description TEXT NOT NULL,
      url VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'videos' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
exports.addVideo = async (req, res) => {
  try {
    const { title, description, url, file } = req.body;
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/thumbnail",
      Crop: "fill",
    });

    await pool.query(
      "INSERT INTO videos (id,title,description,url,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *",
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
      message: "Video Uploaded Succesfully",
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
  createVideoTable();
  try {
    const videos = await pool.query("SELECT * FROM videos");
    res.status(200).json({
      success: true,
      videos: videos.rows,
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
    const video = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);
    if (video.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Video not found" });
    }
    res.status(200).json({
      success: true,
      video: video.rows[0],
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
    const video = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);
    if (video.rows.length === 0) {
      return res.status(200).json({ success: false, msg: "Video not found" });
    }

    const fileid = video.rows[0].fileid;
    await cloudinary.v2.uploader.destroy(fileid);
    await pool.query("DELETE FROM videos WHERE id = $1", [id]);
    res.status(200).json({
      success: true,
      message: "Video Deleted Succesfully",
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
    const { title, description, url } = req.body;
    const video = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);
    if (video.rows.length === 0) {
      return res.status(200).json({ success: false, msg: "Video not found" });
    }

    if (req.file) {
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/thumbnail",
        Crop: "fill",
      });
      await pool.query(
        "INSERT INTO videos (id,title,description,url,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *",
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
      const fileid = video.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
    } else {
      await pool.query(
        "UPDATE videos SET title = $1,description = $2, url = $3 WHERE id = $4",
        [title, description, url, id]
      );
    }

    res.status(200).json({
      success: true,
      message: "Videos Updated Succesfully",
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
    const videos = await pool.query("SELECT count(*) FROM videos");
    res.status(200).json({
      success: true,
      tableName: "Videos",
      count: videos.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Videos fetch failed",
    });
  }
};
