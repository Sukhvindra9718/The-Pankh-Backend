const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Add Banner
exports.addBanner = async (req, res) => {
    try {
        const { pagename, file } = req.body;
        const created_at = new Date();
        const id = uuid.v4();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/banner",
            crop: "fill",
        });
        await pool.query(
            "INSERT INTO banner (id, pagename, fileid, fileurl, createdat) VALUES (?, ?, ?, ?, ?)",
            [id, pagename, myCloud.public_id, myCloud.secure_url, created_at]
        );

        res.status(200).json({
            success: true,
            message: "Banner Uploaded Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            userError: "Server Error",
            error: error.message,
        });
    }
};

// Get All Banners
exports.getAllBanners = async (req, res) => {
    try {
        const [banners] = await pool.query("SELECT * FROM banner");
        res.status(200).json({
            success: true,
            banner: banners,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Banners fetch failed",
        });
    }
};

// Get Banner by Name
exports.getBannerByName = async (req, res) => {
    try {
        const { name } = req.params;
        const [banner] = await pool.query(
            "SELECT * FROM banner WHERE pagename = ?",
            [name]
        );
        if (banner.length === 0) {
            return res.status(404).json({ success: false, msg: "Banner not found" });
        }
        res.status(200).json({
            success: true,
            banner: banner[0],
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Banner fetch failed",
        });
    }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const [banner] = await pool.query("SELECT * FROM banner WHERE id = ?", [id]);

        if (banner.length === 0) {
            return res.status(404).json({ success: false, msg: "Banner not found" });
        } else {
            const fileid = banner[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM banner WHERE id = ?", [id]);
        }
        res.status(200).json({
            success: true,
            message: "Banner Deleted Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Banner delete failed",
        });
    }
};

// Update Banner
exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { pagename, file } = req.body;
        const [banner] = await pool.query("SELECT * FROM banner WHERE id = ?", [id]);
        if (banner.length === 0) {
            return res.status(404).json({ success: false, msg: "Banner not found" });
        }
        if (file) {
            const fileid = banner[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/banner",
                crop: "fill",
            });
            await pool.query(
                "UPDATE banner SET fileid = ?, fileurl = ?, pagename = ? WHERE id = ?",
                [myCloud.public_id, myCloud.secure_url, pagename, id]
            );
        } else {
            await pool.query("UPDATE banner SET pagename = ? WHERE id = ?", [
                pagename,
                id,
            ]);
        }
        res.status(200).json({
            success: true,
            message: "Banner Updated Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Banner update failed",
        });
    }
};

// Get All Banner Count
exports.getAllBannerCount = async (req, res) => {
    try {
        const [[bannerCount]] = await pool.query("SELECT COUNT(*) AS count FROM banner");
        res.status(200).json({
            success: true,
            tableName: "Banner",
            count: bannerCount.count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Banner fetch failed",
        });
    }
};
