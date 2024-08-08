const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// News CRUD
exports.createNews = async (req, res) => {
  try {
    const { title, shortdescription, newsdatetime, createdat, longdescription, file } = req.body;
    const userId = req.user.id;
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/news",
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO news (id, title, shortdescription, longdescription, fileid, fileurl, createdat, userid, newsdatetime ) VALUES ($1, $2, $3,$4,$5, $6, $7, $8, $9) RETURNING *",
      [
        id,
        title.toLowerCase(),
        shortdescription,
        longdescription,
        myCloud.public_id,
        myCloud.secure_url,
        created_at,
        userId,
        newsdatetime,
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

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await pool.query("SELECT * FROM news WHERE id = $1", [id]);

    if (news.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "news not found" });
    } else {
      const fileid = news.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM news WHERE id = $1", [id]);
    }
    res.status(200).json({
      success: true,
      message: "news Deleted Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "news delete failed",
    });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id;
    const { title, shortdescription, longdescription, file, newsdatetime } = req.body;

    const news = await pool.query("SELECT * FROM news WHERE id = $1", [id]);

    if (news.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "news not found" });
    }
    if (file) {
      const fileid = news.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/news",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE news SET fileid = $1, fileurl = $2, title = $3, shortdescription = $4, newsdatetime = $5, longdescription = $7, userid = $8 WHERE id = $6, ",
        [myCloud.public_id, myCloud.secure_url, title, shortdescription, newsdatetime, id, longdescription, userID]
      );
    } else {
      await pool.query(
        "UPDATE news SET title = $1,shortdescription = $2, newsdatetime = $3, longdescription = $5, userid = $6 WHERE id = $4",
        [title, shortdescription, newsdatetime, id, longdescription, userID]
      );
    }
    res.status(200).json({
      success: true,
      message: "news Updated Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "news update failed",
    });
  }
};



exports.getAllNewsCount = async (req, res) => {
  try {
    const news = await pool.query("SELECT count(*) FROM news");
    console.log(news.rows);
    res.status(200).json({
      success: true,
      tableName: "news",
      count: news.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "news fetch failed",
    });
  }
};