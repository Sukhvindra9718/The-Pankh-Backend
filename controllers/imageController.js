const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Images CRUD
exports.addImage = async (req, res) => {
  try {
    const { title, description, file } = req.body;
    const id = uuid.v4();

    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/galleryimages",
      crop: "fill",
    });
    await pool.query(
      "INSERT INTO images (id, title, description, fileid, fileurl, createdat) VALUES (?, ?, ?, ?, ?, ?)",
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
      message: "Image Uploaded Successfully",
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

exports.getAllImages = async (req, res) => {
  try {
    console.log("get all images");
    const [images] = await pool.query("SELECT * FROM images");
    res.status(200).json({
      success: true,
      images: images,
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
    const [image] = await pool.query("SELECT * FROM images WHERE id = ?", [id]);
    if (image.length === 0) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }
    res.status(200).json({
      success: true,
      image: image[0],
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
    const [image] = await pool.query("SELECT * FROM images WHERE id = ?", [id]);
    if (image.length > 0) {
      const fileid = image[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM images WHERE id = ?", [id]);
    }

    res.status(200).json({
      success: true,
      message: "Image Deleted Successfully",
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
    const [image] = await pool.query("SELECT * FROM images WHERE id = ?", [id]);
    if (image.length === 0) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }
    if (file) {
      const fileid = image[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/galleryimages",
        crop: "fill",
      });
      await pool.query(
        "UPDATE images SET fileid = ?, fileurl = ?, title = ?, description = ? WHERE id = ?",
        [myCloud.public_id, myCloud.secure_url, title, description, id]
      );
    } else {
      await pool.query(
        "UPDATE images SET title = ?, description = ? WHERE id = ?",
        [title, description, id]
      );
    }
    res.status(200).json({
      success: true,
      message: "Image Updated Successfully",
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
    const [[imagesCount]] = await pool.query("SELECT COUNT(*) AS count FROM images");
    res.status(200).json({
      success: true,
      tableName: "Images",
      count: imagesCount.count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Images fetch failed",
    });
  }
};
