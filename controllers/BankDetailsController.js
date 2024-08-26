const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// BankDetails CRUD
exports.createBankDetails = async (req, res) => {
    try {
        const { file, ifsccode, accountnumber, branchname, upiid } = req.body;
        const id = uuid.v4();
        const created_at = new Date();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/BankDetails",
            crop: "fill",
        });
        await pool.query(
            "INSERT INTO bankdetails (id, fileid, fileurl, createdat, ifsccode, accountnumber, branchname, upiid) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *",
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
            message: "BankDetails Uploaded Successfully",
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
    try {
        const [BankDetails] = await pool.query("SELECT * FROM bankdetails");
        res.status(200).json({
            success: true,
            BankDetails: BankDetails,
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
        const [BankDetails] = await pool.query("SELECT * FROM bankdetails WHERE id = ?", [id]);

        if (BankDetails.length === 0) {
            return res.status(404).json({ success: false, msg: "BankDetails not found" });
        } else {
            const fileid = BankDetails[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM bankdetails WHERE id = ?", [id]);
        }
        res.status(200).json({
            success: true,
            message: "BankDetails Deleted Successfully",
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
        const [BankDetails] = await pool.query("SELECT * FROM bankdetails WHERE id = ?", [id]);

        if (BankDetails.length === 0) {
            return res.status(404).json({ success: false, msg: "BankDetails not found" });
        }
        if (file) {
            const fileid = BankDetails[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/BankDetails",
                crop: "fill",
            });

            await pool.query(
                "UPDATE bankdetails SET fileid = ?, fileurl = ?, createdat = ?, ifsccode = ?, accountnumber = ?, branchname = ?, upiid = ? WHERE id = ?",
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
                "UPDATE bankdetails SET ifsccode = ?, accountnumber = ?, branchname = ?, upiid = ? WHERE id = ?",
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
            message: "BankDetails Updated Successfully",
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
        const [[BankDetails]] = await pool.query("SELECT COUNT(*) AS count FROM bankdetails");
        res.status(200).json({
            success: true,
            tableName: "BankDetails",
            count: BankDetails.count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "BankDetails fetch failed",
        });
    }
};
