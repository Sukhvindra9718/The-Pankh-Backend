const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

const createDonationTable = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY NOT NULL,
        fileid VARCHAR NOT NULL,
        fileurl VARCHAR NOT NULL,
        createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        fullname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phonenumber VARCHAR NOT NULL,
        country VARCHAR NOT NULL,
        amount VARCHAR NOT NULL,
        utrnumber VARCHAR NOT NULL,
        donationdatetime TIMESTAMP WITHOUT TIME ZONE,
        remarks TEXT
    )`;
    try {
        const client = await pool.connect();
        await client.query(createTableQuery);
        console.log("Table 'donations' created successfully");
    } catch (err) {
        console.error("Error creating table", err.stack);
    } finally {
    }
};
// Donation CRUD
exports.createDonation = async (req, res) => {
    try {
        const { file, fullname, email, phonenumber, country, amount, utrnumber, remarks } = req.body;
        const created_at = new Date();
        const id = uuid.v4();
        const currentDateAndTime = new Date();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/Donation",
            Crop: "fill",
        });
        await pool.query(
            "INSERT INTO donations (id, fileid, fileurl, createdat, fullname, email, phonenumber, country, amount, utrnumber, donationdatetime, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) RETURNING *",
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
            message: "Donation Uploaded Succesfully",
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
    createDonationTable();
    try {
        const Donations = await pool.query("SELECT * FROM donations");
        res.status(200).json({
            success: true,
            Donations: Donations.rows,
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
        const Donation = await pool.query("SELECT * FROM donations WHERE id = $1", [id]);

        if (Donation.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Donation not found" });
        } else {
            const fileid = Donation.rows[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM donations WHERE id = $1", [id]);
        }
        res.status(200).json({
            success: true,
            message: "Donation Deleted Succesfully",
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
        const Donation = await pool.query("SELECT * FROM donations WHERE id = $1", [id]);

        if (Donation.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Donation not found" });
        }
        if (file) {
            const fileid = Donation.rows[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/Donation",
                Crop: "fill",
            });
            
            await pool.query(
                "UPDATE donations SET fileid = $1, fileurl = $2, createdat = $3, fullname = $4, email = $5, phonenumber = $6, country = $7, amount = $8, utrnumber = $9, donationdatetime = $10, remarks = $11  WHERE id = $12",
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
                "UPDATE donations SET fullname = $1, email = $2, phonenumber = $3, country = $4, amount = $5, utrnumber = $6, donationdatetime = $7, remarks = $8  WHERE id = $9",
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
            message: "Donation Updated Succesfully",
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
        const Donation = await pool.query("SELECT count(*) FROM donations");
        console.log(Donation.rows[0].count);
        res.status(200).json({
            success: true,
            tableName: "Donations",
            count: Donation.rows[0].count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Donation fetch failed",
        });
    }
};
