const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

exports.createTestimonial = async (req, res) => {
  try {
    // Process user registration
    const { name, role, comment, file } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/testimonial",
      Crop: "fill",
    });
    const id = uuid.v4();
    await pool.query(
      "INSERT INTO testimonial (id,name,role,comment,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *",
      [
        id,
        name,
        role,
        comment,
        myCloud.public_id,
        myCloud.secure_url,
        new Date(),
      ]
    );
    res.status(201).json({ success: true, msg: "Testimonial Created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllTestimonial = async (req, res) => {
  try {
    const testimonial = await pool.query("SELECT * FROM testimonial");
    res.status(200).json({
      success: true,
      testimonial: testimonial.rows,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Testimonial fetch failed",
    });
  }
};

exports.getTestimonialByID = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await pool.query("SELECT * FROM testimonial WHERE id = $1", [id]);
    if (testimonial.rows.length === 0) {
      return res
        .status(200)
        .json({ success: false, msg: "Testimonial not found" });
    }
    res.status(200).json({
      success: true,
      testimonial: testimonial.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Testimonial fetch failed",
    });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await pool.query("SELECT * FROM testimonial WHERE id = $1", [id]);

    if (testimonial.rows.length === 0) {
      return res
        .status(200)
        .json({ success: false, msg: "Testimonial not found" });
    } else {
      const fileid = testimonial.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM testimonial WHERE id = $1", [id]);
    }
    res.status(200).json({
      success: true,
      message: "Testimonial Deleted Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Testimonial delete failed",
    });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const {name, role, comment, file } = req.body;
    const testimonial = await pool.query("SELECT * FROM testimonial WHERE id = $1", [id]);
    if (testimonial.rows.length === 0) {
      return res
        .status(200)
        .json({ success: false, msg: "Testimonial not found" });
    }
    if (file) {
      const fileid = testimonial.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/testimonial",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE testimonial SET fileid = $1, fileurl = $2,name = $3, role = $4, comment = $5 WHERE id = $6",
        [myCloud.public_id, myCloud.secure_url,name,role,comment, id]
      );
    } else {
      await pool.query("UPDATE testimonial SET name = $1,role = $2, comment = $3 WHERE id = $4", [
        name, 
        role, 
        comment,
        id,
      ]);
    }
    res.status(200).json({
      success: true,
      message: "Testimonial Updated Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Testimonial update failed",
    });
  }
};

exports.getAllTestimonialCount = async (req, res) => {
  try {
    const testimonial = await pool.query("SELECT count(*) FROM testimonial");
    res.status(200).json({
      success: true,
      tableName: "Testimonial",
      count: testimonial.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Testimonial fetch failed",
    });
  }
};
