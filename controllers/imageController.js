const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Images CRUD
exports.addImage = async (req, res) => {
  try {
    const { title, description, file } = req.body;
    const id = uuid.v4();
    console.log(req.body)

    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/galleryimages",
      width: 1000,
      height: 1000,
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO images (id,title,description,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5,$6) RETURNING *",
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
      message: "Image Uploaded Succesfully",
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

exports.getAllImages = async (req, res) => {
  try {
    console.log("get all images");
    const images = await pool.query("SELECT * FROM images");
    res.status(200).json({
      success: true,
      images: images.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Images fetch failed",
    });
  }
};

exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
    if (image.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }
    res.status(200).json({
      success: true,
      image: image.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Image fetch failed",
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
    if (image) {
      const fileid = image.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM images WHERE id = $1", [id]);
    }

    res.status(200).json({
      success: true,
      message: "Image Deleted Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Image delete failed",
    });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, file } = req.body;
    const image = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
    if (image.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }
    if (file) {
      const fileid = image.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/galleryimages",
        width: 1000,
        height: 1000,
        Crop: "fill",
      });
      await pool.query(
        "UPDATE images SET fileid = $1, fileurl = $2,title = $3,description=$4 WHERE id = $5",
        [myCloud.public_id, myCloud.secure_url, title, description, id]
      );
    } else {
      await pool.query(
        "UPDATE images SET title = $1,description=$2 WHERE id = $3",
        [title, description, id]
      );
    }
    res.status(200).json({
      success: true,
      message: "Image Updated Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Image update failed",
    });
  }
};

exports.getAllImagesCount = async (req, res) => {
  try {
    const images = await pool.query("SELECT count(*) FROM images");
    res.status(200).json({
      success: true,
      tableName:"Images",
      count: images.rows.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Images fetch failed",
    });
  }
};
