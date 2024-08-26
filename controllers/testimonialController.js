const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, comment, file } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/testimonial",
      crop: "fill",
    });
    const id = uuid.v4();
    await pool.query(
      "INSERT INTO testimonial (id, name, role, comment, fileid, fileurl, createdat) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
    const [testimonial] = await pool.query("SELECT * FROM testimonial");
    res.status(200).json({
      success: true,
      testimonial: testimonial,
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
    const [testimonial] = await pool.query("SELECT * FROM testimonial WHERE id = ?", [id]);
    if (testimonial.length === 0) {
      return res.status(200).json({ success: false, msg: "Testimonial not found" });
    }
    res.status(200).json({
      success: true,
      testimonial: testimonial[0],
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
    const [testimonial] = await pool.query("SELECT * FROM testimonial WHERE id = ?", [id]);

    if (testimonial.length === 0) {
      return res.status(200).json({ success: false, msg: "Testimonial not found" });
    } else {
      const fileid = testimonial[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM testimonial WHERE id = ?", [id]);
    }
    res.status(200).json({
      success: true,
      message: "Testimonial Deleted Successfully",
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
    const { name, role, comment, file } = req.body;
    const [testimonial] = await pool.query("SELECT * FROM testimonial WHERE id = ?", [id]);
    if (testimonial.length === 0) {
      return res.status(200).json({ success: false, msg: "Testimonial not found" });
    }
    if (file) {
      const fileid = testimonial[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/testimonial",
        crop: "fill",
      });
      await pool.query(
        "UPDATE testimonial SET fileid = ?, fileurl = ?, name = ?, role = ?, comment = ? WHERE id = ?",
        [myCloud.public_id, myCloud.secure_url, name, role, comment, id]
      );
    } else {
      await pool.query("UPDATE testimonial SET name = ?, role = ?, comment = ? WHERE id = ?", [
        name, 
        role, 
        comment,
        id,
      ]);
    }
    res.status(200).json({
      success: true,
      message: "Testimonial Updated Successfully",
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
    const [[testimonialCount]] = await pool.query("SELECT COUNT(*) AS count FROM testimonial");
    res.status(200).json({
      success: true,
      tableName: "Testimonial",
      count: testimonialCount.count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Testimonial fetch failed",
    });
  }
};
