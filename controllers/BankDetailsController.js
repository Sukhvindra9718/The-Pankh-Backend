const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

const createBankDetailsTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bankdetails (
      id UUID PRIMARY KEY NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ifsccode VARCHAR NOT NULL,
      accountnumber VARCHAR NOT NULL,
      branchname VARCHAR NOT NULL,
      upiid VARCHAR NOT NULL
    );
  `;
    try {
        const client = await pool.connect();
        await client.query(createTableQuery);
        console.log("Table 'bankdetails' created successfully");
    } catch (err) {
        console.error("Error creating table", err.stack);
    } finally {
    }
};
// BankDetails CRUD
exports.createBankDetails = async (req, res) => {
    try {
        const { file, ifsccode, accountnumber, branchname, upiid } = req.body;
        const id = uuid.v4();
        const created_at = new Date();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/BankDetails",
            Crop: "fill",
        });
        await pool.query(
            "INSERT INTO bankdetails (id, fileid, fileurl, createdat, ifsccode, accountnumber, branchname, upiid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
                id,
                myCloud.public_id,
                myCloud.secure_url,
                created_at,
                ifsccode,
                accountnumber,
                branchname,
                upiid,
            ]
        );

        res.status(200).json({
            success: true,
            message: "BankDetails Uploaded Succesfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            userError: "Server Error",
            error: error.message,
        });
    }
};

exports.getAllBankDetails = async (req, res) => {
    createBankDetailsTable();
    try {
        const BankDetails = await pool.query("SELECT * FROM bankdetails");
        res.status(200).json({
            success: true,
            BankDetails: BankDetails.rows,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "BankDetails fetch failed",
        });
    }
};

exports.deleteBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const BankDetails = await pool.query("SELECT * FROM bankdetails  WHERE id = $1", [id]);

        if (BankDetails.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "BankDetails not found" });
        } else {
            const fileid = BankDetails.rows[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM bankdetails WHERE id = $1", [id]);
        }
        res.status(200).json({
            success: true,
            message: "BankDetails Deleted Succesfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "BankDetails delete failed",
        });
    }
};

exports.updateBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { file, ifsccode, accountnumber, branchname, upiid } = req.body;
        const created_at = new Date();
        const BankDetails = await pool.query("SELECT * FROM bankdetails  WHERE id = $1", [id]);

        if (BankDetails.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "BankDetails not found" });
        }
        if (file) {
            const fileid = BankDetails.rows[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/BankDetails",
                Crop: "fill",
            });

            await pool.query(
                "UPDATE bankdetails SET fileid = $1, fileurl = $2, createdat = $3, ifsccode = $4, accountnumber = $5, branchname = $6, upiid = $7 WHERE id = $8",
                [
                    myCloud.public_id,
                    myCloud.secure_url,
                    created_at,
                    ifsccode,
                    accountnumber,
                    branchname,
                    upiid,
                    id
                ]
            );
        } else {
            await pool.query(
                "UPDATE bankdetails SET ifsccode = $1, accountnumber = $2, branchname = $3, upiid = $4 WHERE id = $5",
                [
                    ifsccode,
                    accountnumber,
                    branchname,
                    upiid,
                    id
                ]
            );
        }
        res.status(200).json({
            success: true,
            message: "BankDetails Updated Succesfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "BankDetails update failed",
        });
    }
};

exports.getAllBankDetailsCount = async (req, res) => {
    try {
        const BankDetails = await pool.query("SELECT count(*) FROM bankdetails");
        res.status(200).json({
            success: true,
            tableName: "BankDetails",
            count: BankDetails.rows[0].count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "BankDetails fetch failed",
        });
    }
};
