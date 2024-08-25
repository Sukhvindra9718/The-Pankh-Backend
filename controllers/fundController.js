const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

const createFundTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS fund (
      id UUID PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      raisedprice INT NOT NULL,
      goalprice INT NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'fund' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
// Images CRUD
exports.addfundDetails = async (req, res) => {
  try {
    const { title, description, raisedprice, goalprice, file } = req.body;
    console.log(title, description, raisedprice, goalprice,)
    const created_at = new Date();
    const id = uuid.v4();
    const myCloud = await cloudinary.v2.uploader.upload(file, {
      folder: "thepankh/fund",
      Crop: "fill",
    });
    await pool.query(
      "INSERT INTO fund (id,title, raisedprice, goalprice, description, createdat, fileurl, fileid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        id,
        title,
        raisedprice,
        goalprice,
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
  createFundTable();
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
    console.log(req.params);
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
    const { title, description, raisedprice, goalprice, file } = req.body;
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
        "UPDATE fund SET fileId = $1, fileUrl = $2,title = $3, description = $4, raisedprice = $5, goalprice = $6 WHERE id = $7",
        [myCloud.public_id, myCloud.secure_url, title, description, raisedprice, goalprice, id]
      );
    } else {
      await pool.query("UPDATE fund SET title = $1, description = $2, raisedprice = $3, goalprice = $4 WHERE id = $5", [
        title,
        description,
        raisedprice,
        goalprice,
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
    console.log(fund.rows[0].count);
    res.status(200).json({
      success: true,
      tableName: "fund",
      count: fund.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Fund Details count fetch failed",
    });
  }
};
