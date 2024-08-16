const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// events CRUD
exports.createEvents = async (req, res) => {
  try {
    const { title, shortdescription, file, eventsdatetime, link } = req.body;
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/events",
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO events (id,title,shortdescription,fileid,fileurl,createdat,eventsdatetime, link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        id,
        title.toLowerCase(),
        shortdescription,
        myCloud.public_id,
        myCloud.secure_url,
        created_at,
        eventsdatetime,
        link
      ]
    );

    res.status(200).json({
      success: true,
      message: "Events Uploaded Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await pool.query("SELECT * FROM events");
    res.status(200).json({
      success: true,
      events: events.rows,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Events fetch failed",
    });
  }
};

exports.deleteEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const events = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

    if (events.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "events not found" });
    } else {
      const fileid = events.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM events WHERE id = $1", [id]);
    }
    res.status(200).json({
      success: true,
      message: "events Deleted Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "events delete failed",
    });
  }
};

exports.updateEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortdescription, file, eventsdatetime, link } = req.body;

    const events = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

    if (events.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "events not found" });
    }
    if (file) {
      const fileid = events.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/events",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE events SET fileid = $1, fileurl = $2, title = $3, shortdescription = $4, eventsdatetime = $5, link = $6 WHERE id = $7",
        [myCloud.public_id, myCloud.secure_url, title, shortdescription, eventsdatetime, link, id]
      );
    } else {
      await pool.query(
        "UPDATE events SET title = $1,shortdescription = $2, eventsdatetime = $3, link = $4 WHERE id = $5",
        [title, shortdescription, eventsdatetime, link , id]
      );
    }
    res.status(200).json({
      success: true,
      message: "events Updated Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "events update failed",
    });
  }
};

exports.getAllEventsCount = async (req, res) => {
  try {
    const events = await pool.query("SELECT count(*) FROM events");
    res.status(200).json({
      success: true,
      tableName : "Events",
      count: events.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Events fetch failed",
    });
  }
};
