const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

const createBannerTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banner (
      id UUID PRIMARY KEY NOT NULL,
      pagename VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'banner' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
exports.addBanner = async (req, res) => {
  try {
    const { pagename, file } = req.body;
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/banner",
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO banner (id,pagename,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5) RETURNING *",
      [id, pagename, myCloud.public_id, myCloud.secure_url, created_at]
    );

    res.status(200).json({
      success: true,
      message: "Banner Uploaded Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllBanners = async (req, res) => {
  createBannerTable();
  try {
    const banners = await pool.query("SELECT * FROM banner");
    res.status(200).json({
      success: true,
      banner: banners.rows,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Banners fetch failed",
    });
  }
};

exports.getBannerByName = async (req, res) => {
  try {
    const { name } = req.params;

    const banner = await pool.query(
      "SELECT * FROM banner WHERE pagename = $1",
      [name]
    );
    if (banner.rows.length === 0) {
      return res.status(200).json({ success: false, msg: "Banner not found" });
    }
    res.status(200).json({
      success: true,
      banner: banner.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Banner fetch failed",
    });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await pool.query("SELECT * FROM banner WHERE id = $1", [id]);

    if (banner.rows.length === 0) {
      return res.status(200).json({ success: false, msg: "Banner not found" });
    } else {
      const fileid = banner.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM banner WHERE id = $1", [id]);
    }
    res.status(200).json({
      success: true,
      message: "Banner Deleted Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Banner delete failed",
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { pagename, file } = req.body;
    const banner = await pool.query("SELECT * FROM banner WHERE id = $1", [id]);
    if (banner.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Banner not found" });
    }
    if (file) {
      const fileid = banner.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/banner",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE banner SET fileid = $1, fileurl = $2,pagename = $3 WHERE id = $4",
        [myCloud.public_id, myCloud.secure_url, pagename, id]
      );
    } else {
      await pool.query("UPDATE banner SET pagename = $1 WHERE id = $2", [
        pagename,
        id,
      ]);
    }
    res.status(200).json({
      success: true,
      message: "Banner Updated Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Banner update failed",
    });
  }
};

exports.getAllBannerCount = async (req, res) => {
  try {
    const banner = await pool.query("SELECT count(*) FROM banner");
    res.status(200).json({
      success: true,
      tableName: "Banner",
      count: banner.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Banner fetch failed",
    });
  }
};
