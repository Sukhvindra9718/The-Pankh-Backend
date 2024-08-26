const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// News CRUD
exports.createNews = async (req, res) => {
  try {
    const { title, shortdescription, newsdatetime, longdescription, file, link } = req.body;
    const userId = req.user.id;
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/news",
      crop: "fill",
    });

    await pool.query(
      "INSERT INTO news (id, title, shortdescription, longdescription, fileid, fileurl, createdat, userid, newsdatetime, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        link,
      ]
    );

    res.status(200).json({
      success: true,
      message: "News Uploaded Successfully",
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
    const [news] = await pool.query("SELECT * FROM news");
    res.status(200).json({
      success: true,
      news: news,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "News fetch failed",
    });
  }
};

// Function to get the recently created two news
exports.getTopTwoNews = async (req, res) => {
  try {
    const [news] = await pool.query("SELECT * FROM news ORDER BY createdat DESC LIMIT 2");
    res.status(200).json({
      success: true,
      news: news,
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
    const [news] = await pool.query("SELECT * FROM news WHERE id = ?", [id]);

    if (news.length === 0) {
      return res.status(404).json({ success: false, msg: "News not found" });
    } else {
      const fileid = news[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM news WHERE id = ?", [id]);
    }
    res.status(200).json({
      success: true,
      message: "News Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "News delete failed",
    });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id;
    const { title, shortdescription, longdescription, file, newsdatetime, link } = req.body;

    const [news] = await pool.query("SELECT * FROM news WHERE id = ?", [id]);

    if (news.length === 0) {
      return res.status(404).json({ success: false, msg: "News not found" });
    }
    if (file) {
      const fileid = news[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/news",
        crop: "fill",
      });
      await pool.query(
        "UPDATE news SET fileid = ?, fileurl = ?, title = ?, shortdescription = ?, newsdatetime = ?, longdescription = ?, userid = ?, link = ? WHERE id = ?",
        [myCloud.public_id, myCloud.secure_url, title, shortdescription, newsdatetime, longdescription, userID, link, id]
      );
    } else {
      await pool.query(
        "UPDATE news SET title = ?, shortdescription = ?, newsdatetime = ?, longdescription = ?, userid = ?, link = ? WHERE id = ?",
        [title, shortdescription, newsdatetime, longdescription, userID, link, id]
      );
    }
    res.status(200).json({
      success: true,
      message: "News Updated Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "News update failed",
    });
  }
};

exports.getAllNewsCount = async (req, res) => {
  try {
    const [[newsCount]] = await pool.query("SELECT COUNT(*) AS count FROM news");
    res.status(200).json({
      success: true,
      tableName: "news",
      count: newsCount.count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "News count fetch failed",
    });
  }
};
