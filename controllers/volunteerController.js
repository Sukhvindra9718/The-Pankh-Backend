const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary").v2;

exports.createVolunteer = async (req, res) => {
  try {
    const {
      username,
      phonenumber,
      role,
      facebookurl,
      twitterurl,
      instagramurl,
      linkedinurl,
      file,
    } = req.body;
    
    const myCloud = await cloudinary.uploader.upload(file, {
      folder: "thepankh/volunteer",
      crop: "fill",
    });
    
    const id = uuid.v4();
    
    await pool.query(
      "INSERT INTO volunteer (id, username, phonenumber, role, facebookurl, twitterurl, instagramurl, linkedinurl, fileid, fileurl, createdat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        username,
        phonenumber,
        role,
        facebookurl || "https://facebook.com",
        twitterurl || "https://twitter.com",
        instagramurl || "https://instagram.com",
        linkedinurl || "https://linkedin.com",
        myCloud.public_id,
        myCloud.secure_url,
        new Date(),
      ]
    );

    res.status(201).json({ success: true, msg: "Volunteer Created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllVolunteers = async (req, res) => {
  try {
    const [volunteers] = await pool.query("SELECT * FROM volunteer");
    res.status(200).json({
      success: true,
      volunteers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Volunteers fetch failed",
    });
  }
};

exports.getVolunteerByID = async (req, res) => {
  try {
    const { id } = req.params;
    const [volunteer] = await pool.query(
      "SELECT * FROM volunteer WHERE id = ?",
      [id]
    );
    if (volunteer.length === 0) {
      return res.status(404).json({ success: false, msg: "Volunteer not found" });
    }
    res.status(200).json({
      success: true,
      volunteer: volunteer[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Volunteer fetch failed",
    });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const [volunteer] = await pool.query(
      "SELECT * FROM volunteer WHERE id = ?",
      [id]
    );

    if (volunteer.length === 0) {
      return res.status(404).json({ success: false, msg: "Volunteer not found" });
    }

    const fileid = volunteer[0].fileid;
    await cloudinary.uploader.destroy(fileid);
    await pool.query("DELETE FROM volunteer WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Volunteer Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Volunteer delete failed",
    });
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phonenumber, role, facebookurl, twitterurl, instagramurl, linkedinurl, file } = req.body;

    const [volunteer] = await pool.query("SELECT * FROM volunteer WHERE id = ?", [id]);

    if (volunteer.length === 0) {
      return res.status(404).json({ success: false, msg: "Volunteer not found" });
    }

    if (file) {
      const oldFileId = volunteer[0].fileid;
      await cloudinary.uploader.destroy(oldFileId);

      const myCloud = await cloudinary.uploader.upload(file, {
        folder: "thepankh/volunteer",
        crop: "fill",
      });

      await pool.query(
        "UPDATE volunteer SET fileid = ?, fileurl = ?, username = ?, phonenumber = ?, role = ?, facebookurl = ?, twitterurl = ?, instagramurl = ?, linkedinurl = ? WHERE id = ?",
        [myCloud.public_id, myCloud.secure_url, username, phonenumber, role, facebookurl, twitterurl, instagramurl, linkedinurl, id]
      );
    } else {
      await pool.query(
        "UPDATE volunteer SET username = ?, phonenumber = ?, role = ?, facebookurl = ?, twitterurl = ?, instagramurl = ?, linkedinurl = ? WHERE id = ?",
        [username, phonenumber, role, facebookurl, twitterurl, instagramurl, linkedinurl, id]
      );
    }

    res.status(200).json({
      success: true,
      message: "Volunteer Updated Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Volunteer update failed",
    });
  }
};

exports.getAllVolunteerCount = async (req, res) => {
  try {
    const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM volunteer");
    res.status(200).json({
      success: true,
      tableName: "volunteer",
      count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Volunteer fetch failed",
    });
  }
};
