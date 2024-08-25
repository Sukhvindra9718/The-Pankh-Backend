const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

const createCarousalTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS carousal (
      id UUID PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'carousal' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
// Images CRUD
exports.addCarousal = async (req, res) => {
  try {
    const { title, description, file } = req.body;
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/carousal",
      Crop: "fill",
    });
    console.log(myCloud);
    await pool.query(
      "INSERT INTO carousal (id,fileid,fileurl,createdat,title,description) VALUES ($1, $2, $3,$4,$5,$6) RETURNING *",
      [
        id,
        myCloud.public_id,
        myCloud.secure_url,
        created_at,
        title,
        description,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Carousal Uploaded Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllCarousals = async (req, res) => {
  createCarousalTable();
  try {
    console.log("get all carousals");
    const carousals = await pool.query("SELECT * FROM carousal");
    res.status(200).json({
      success: true,
      carousal: carousals.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Carousals fetch failed",
    });
  }
};

exports.getCarousalByID = async (req, res) => {
  try {
    const { id } = req.params;
    const carousal = await pool.query("SELECT * FROM carousal WHERE id = $1", [
      id,
    ]);
    if (carousal.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Carousal not found" });
    }
    res.status(200).json({
      success: true,
      carousal: carousal.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Carousal fetch failed",
    });
  }
};

exports.deleteCarousal = async (req, res) => {
  try {
    const { id } = req.params;
    const carousal = await pool.query("SELECT * FROM carousal WHERE id = $1", [
      id,
    ]);
    if (carousal.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Carousal not found" });
    } else {
      const fileid = carousal.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM carousal WHERE id = $1", [id]);
    }
    res.status(200).json({
      success: true,
      message: "Carousal Deleted Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Carousal delete failed",
    });
  }
};

exports.updateCarousal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, file } = req.body;
    const carousal = await pool.query("SELECT * FROM carousal WHERE id = $1", [
      id,
    ]);

    if (carousal.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Carousal not found" });
    }
    if (file) {
      const fileid = carousal.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/carousal",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE carousal SET title = $1, description = $2, fileid = $3, fileurl = $4 WHERE id = $5",
        [title, description, myCloud.public_id, myCloud.secure_url, id]
      );
    } else {
      await pool.query(
        "UPDATE carousal SET title = $1, description = $2 WHERE id = $3",
        [title, description, id]
      );
    }

    res.status(200).json({
      success: true,
      message: "Carousal Updated Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Carousal update failed",
    });
  }
};

exports.getAllCarousalCount = async (req, res) => {
  try {
    const carousal = await pool.query("SELECT count(*) FROM carousal");
    res.status(200).json({
      success: true,
      tableName:"Carousal",
      count: carousal.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Carousal fetch failed",
    });
  }
};