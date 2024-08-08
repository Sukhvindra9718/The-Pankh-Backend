const pool = require("../db");
const fs = require("fs");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Images CRUD
exports.addfundDetails = async (req, res) => {
  try {
    const { title,description,raisedPrice,goalPrice, file } = req.body;
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/fund",
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO fund (id,title,raisedPrice,goalPrice,description,createdat,fileUrl,fileId) VALUES ($1, $2, $3,$4,$5, $6, $7, $8) RETURNING *",
      [
        id,
        title,
        raisedPrice,
        goalPrice,
        description,
        created_at,
        myCloud.secure_url,
        myCloud.public_id,
        
      ]
    );

    res.status(200).json({
      success: true,
      message: "Fund details added successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllfundDetails = async (req, res) => {
  try {
    const funds = await pool.query("SELECT * FROM fund");
    res.status(200).json({
      success: true,
      fund: funds.rows,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Funds fetch failed",
    });
  }
};

exports.getFundDetailByID = async (req, res) => {
  try {
    const { id } = req.params;
    const fund = await pool.query("SELECT * FROM fund WHERE id = $1", [id]);
    if (fund.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "fund not found" });
    }
    res.status(200).json({
      success: true,
      banner: fund.rows[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Fund Details fetch failed",
    });
  }
};

exports.deleteFundDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const fund = await pool.query("SELECT * FROM fund WHERE id = $1", [id]);

    if (fund.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Fund Details not found" });
    } else {
      const fileid = fund.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      await pool.query("DELETE FROM fund WHERE id = $1", [id]);
    }
    res.status(200).json({
      success: true,
      message: "Fund Details Deleted Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Fund Details delete failed",
    });
  }
};

exports.updateFundDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { title,description,raisedPrice,goalPrice, file } = req.body;
    const fund = await pool.query("SELECT * FROM fund WHERE id = $1", [id]);
    if (fund.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Fund Details not found" });
    }
    if (file) {
      const fileid = fund.rows[0].fileid;
      await cloudinary.v2.uploader.destroy(fileid);
      const myCloud = await cloudinary.v2.uploader.upload(file, {
        folder: "thepankh/fund",
        Crop: "fill",
      });
      await pool.query(
        "UPDATE fund SET fileId = $1, fileUrl = $2,title = $3, description = $4, raisedPrice = $5, goalPrice = $6 WHERE id = $7",
        [myCloud.public_id, myCloud.secure_url, title, description, raisedPrice, goalPrice, id]
      );
    } else {
      await pool.query("UPDATE fund SET title = $1, description = $2, raisedPrice = $3, goalPrice = $4 WHERE id = $5", [
        title,
        description,
        raisedPrice,
        goalPrice,
        id,
      ]);
    }
    res.status(200).json({
      success: true,
      message: "Fund Details Updated Succesfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Fund Details update failed",
    });
  }
};

exports.getAllFundDetailsCount = async (req, res) => {
  try {
    const fund = await pool.query("SELECT count(*) FROM fund");
    res.status(200).json({
      success: true,
      tableName: "fund",
      count: fund.rows.length,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Fund Details count fetch failed",
    });
  }
};
