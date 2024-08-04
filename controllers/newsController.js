const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// News CRUD
exports.createNews = async (req, res) => {
  try {
    const { title, shortdesc, longdesc, file } = req.body;
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/news",
      width: 1000,
      height: 1000,
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO news (id,title,shortdesc,longdesc,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5, $6, $7) RETURNING *",
      [
        id,
        title.toLowerCase(),
        shortdesc,
        longdesc,
        myCloud.public_id,
        myCloud.secure_url,
        created_at,
      ]
    );

    res.status(200).json({
      success: true,
      message: "News Uploaded Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const news = await pool.query("SELECT * FROM news");
    res.status(200).json({
      success: true,
      news: news.rows,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "News fetch failed",
    });
  }
};
