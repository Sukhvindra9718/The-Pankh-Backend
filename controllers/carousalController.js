const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Images CRUD
exports.addCarousal = async (req, res) => {
    try {
        const { title, description, file } = req.body;
        const created_at = new Date();
        const id = uuid.v4();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/carousal",
            crop: "fill",
        });
        console.log(myCloud);
        await pool.query(
            "INSERT INTO carousal (id, fileid, fileurl, createdat, title, description) VALUES (?, ?, ?, ?, ?, ?)",
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
            message: "Carousal Uploaded Successfully",
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
    try {
        console.log("get all carousals");
        const [carousals] = await pool.query("SELECT * FROM carousal");
        res.status(200).json({
            success: true,
            carousal: carousals,
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
        const [carousal] = await pool.query("SELECT * FROM carousal WHERE id = ?", [id]);
        if (carousal.length === 0) {
            return res
                .status(404)
                .json({ success: false, msg: "Carousal not found" });
        }
        res.status(200).json({
            success: true,
            carousal: carousal[0],
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
        const [carousal] = await pool.query("SELECT * FROM carousal WHERE id = ?", [id]);
        if (carousal.length === 0) {
            return res
                .status(404)
                .json({ success: false, msg: "Carousal not found" });
        } else {
            const fileid = carousal[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM carousal WHERE id = ?", [id]);
        }
        res.status(200).json({
            success: true,
            message: "Carousal Deleted Successfully",
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
        const [carousal] = await pool.query("SELECT * FROM carousal WHERE id = ?", [id]);

        if (carousal.length === 0) {
            return res
                .status(404)
                .json({ success: false, msg: "Carousal not found" });
        }
        if (file) {
            const fileid = carousal[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/carousal",
                crop: "fill",
            });
            await pool.query(
                "UPDATE carousal SET title = ?, description = ?, fileid = ?, fileurl = ? WHERE id = ?",
                [title, description, myCloud.public_id, myCloud.secure_url, id]
            );
        } else {
            await pool.query(
                "UPDATE carousal SET title = ?, description = ? WHERE id = ?",
                [title, description, id]
            );
        }

        res.status(200).json({
            success: true,
            message: "Carousal Updated Successfully",
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
        const [[carousalCount]] = await pool.query("SELECT COUNT(*) AS count FROM carousal");
        res.status(200).json({
            success: true,
            tableName: "Carousal",
            count: carousalCount.count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Carousal fetch failed",
        });
    }
};
