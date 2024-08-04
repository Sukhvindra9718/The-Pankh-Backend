const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");



exports.createVolunteer = async (req, res) => {
  try {
    // Process user registration
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
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/volunteer",
      width: 1000,
      height: 1000,
      Crop: "fill",
    });
    const id = uuid.v4();
    await pool.query(
      "INSERT INTO volunteer (id,username,phonenumber,role,facebookurl,twitterurl,instagramurl,linkedinurl,fileid,fileurl,createdat) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
      [
        id,
        username,
        phonenumber,
        role,
        facebookurl === "" ? "https://facebook.com" : facebookurl,
        twitterurl === "" ? "https://twitter.com" : twitterurl,
        instagramurl === "" ? "https://instagram.com" : instagramurl,
        linkedinurl === "" ? "https://linkedin.com" : linkedinurl,
        myCloud.public_id,
        myCloud.secure_url,
        new Date(),
      ]
    );
    console.log("created");
    res.status(201).json({ success: true, msg: "Volunteer Created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await pool.query("SELECT * FROM volunteer");
    res.status(200).json({
      success: true,
      volunteers: volunteers.rows,
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
    const volunteer = await pool.query(
      "SELECT * FROM volunteer WHERE id = $1",
      [id]
    );
    if (volunteer.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Volunteer not found" });
    }
    res.status(200).json({
      success: true,
      volunteer: volunteer.rows[0],
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
    const volunteer = await pool.query(
      "SELECT * FROM volunteer WHERE id = $1",
      [id]
    );

    if (volunteer.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Volunteer not found" });
    } else {
      const fileid = volunteer.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM volunteer WHERE id = $1", [id]);
    }
    res.status(200).json({
      success: true,
      message: "Volunteer Deleted Succesfully",
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
    const {username,
      phonenumber,
      role,
      facebookurl,
      twitterurl,
      instagramurl,
      linkedinurl, file } = req.body;
    const volunteer = await pool.query(
      "SELECT * FROM Volunteer WHERE id = $1",
      [id]
    );
 
    if (volunteer.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "volunteer not found" });
    }
    if (file) {
      const fileid = volunteer.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/volunteer",
        width: 1000,
        height: 1000,
        Crop: "fill",
      });
      await pool.query(
        "UPDATE volunteer SET fileid = $1, fileurl = $2,username = $3,phonenumber = $4, role = $5,facebookurl = $6, twitterurl = $7,instagramurl = $8,linkedinurl = $9 WHERE id = $10",
        [myCloud.public_id, myCloud.secure_url,username,phonenumber,role,facebookurl,twitterurl,instagramurl,linkedinurl, id]
      );
    } else {
      await pool.query(
        "UPDATE volunteer SET username = $1,phonenumber = $2, role = $3,facebookurl = $4, twitterurl = $5,instagramurl = $6,linkedinurl = $7 WHERE id = $8",
        [
          username,
          phonenumber,
          role,
          facebookurl,
          twitterurl,
          instagramurl,
          linkedinurl, 
          id
        ]
      );
    }
    res.status(200).json({
      success: true,
      message: "Volunteer Updated Succesfully",
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
    const volunteer = await pool.query("SELECT count(*) FROM volunteer");
    res.status(200).json({
      success: true,
      tableName: "volunteer",
      count: volunteer.rows.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Volunteer fetch failed",
    });
  }
};
