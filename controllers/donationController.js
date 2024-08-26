const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Donation CRUD
exports.createDonation = async (req, res) => {
    try {
        const { file, fullname, email, phonenumber, country, amount, utrnumber, remarks } = req.body;
        const created_at = new Date();
        const id = uuid.v4();
        const currentDateAndTime = new Date();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/Donation",
            crop: "fill",
        });
        await pool.query(
            "INSERT INTO donations (id, fileid, fileurl, createdat, fullname, email, phonenumber, country, amount, utrnumber, donationdatetime, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *",
            [
                id,
                myCloud.public_id,
                myCloud.secure_url,
                created_at,
                fullname,
                email,
                phonenumber,
                country,
                amount,
                utrnumber,
                currentDateAndTime,
                remarks
            ]
        );

        res.status(200).json({
            success: true,
            message: "Donation Uploaded Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            userError: "Server Error",
            error: error.message,
        });
    }
};

exports.getAllDonation = async (req, res) => {
    try {
        const [donations] = await pool.query("SELECT * FROM donations");
        res.status(200).json({
            success: true,
            donations: donations,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Donation fetch failed",
        });
    }
};

exports.deleteDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const [donation] = await pool.query("SELECT * FROM donations WHERE id = ?", [id]);

        if (donation.length === 0) {
            return res.status(404).json({ success: false, msg: "Donation not found" });
        } else {
            const fileid = donation[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM donations WHERE id = ?", [id]);
        }
        res.status(200).json({
            success: true,
            message: "Donation Deleted Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Donation delete failed",
        });
    }
};

exports.updateDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const { file, fullname, email, phonenumber, country, amount, utrnumber, remarks } = req.body;
        const currentDateAndTime = new Date();
        const [donation] = await pool.query("SELECT * FROM donations WHERE id = ?", [id]);

        if (donation.length === 0) {
            return res.status(404).json({ success: false, msg: "Donation not found" });
        }
        if (file) {
            const fileid = donation[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/Donation",
                crop: "fill",
            });

            await pool.query(
                "UPDATE donations SET fileid = ?, fileurl = ?, createdat = ?, fullname = ?, email = ?, phonenumber = ?, country = ?, amount = ?, utrnumber = ?, donationdatetime = ?, remarks = ? WHERE id = ?",
                [
                    myCloud.public_id,
                    myCloud.secure_url,
                    created_at,
                    fullname,
                    email,
                    phonenumber,
                    country,
                    amount,
                    utrnumber,
                    currentDateAndTime,
                    remarks,
                    id
                ]
            );
        } else {
            await pool.query(
                "UPDATE donations SET fullname = ?, email = ?, phonenumber = ?, country = ?, amount = ?, utrnumber = ?, donationdatetime = ?, remarks = ? WHERE id = ?",
                [
                    fullname,
                    email,
                    phonenumber,
                    country,
                    amount,
                    utrnumber,
                    currentDateAndTime,
                    remarks,
                    id
                ]
            );
        }
        res.status(200).json({
            success: true,
            message: "Donation Updated Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Donation update failed",
        });
    }
};

exports.getAllDonationCount = async (req, res) => {
    try {
        const [[donationCount]] = await pool.query("SELECT COUNT(*) AS count FROM donations");
        res.status(200).json({
            success: true,
            tableName: "Donations",
            count: donationCount.count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Donation fetch failed",
        });
    }
};
