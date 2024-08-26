const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Fund CRUD
exports.addFundDetails = async (req, res) => {
    try {
        const { title, description, raisedprice, goalprice, file } = req.body;
        console.log(title, description, raisedprice, goalprice);
        const created_at = new Date();
        const id = uuid.v4();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/fund",
            crop: "fill",
        });
        await pool.query(
            "INSERT INTO fund (id, title, raisedprice, goalprice, description, createdat, fileurl, fileid) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *",
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

exports.getAllFundDetails = async (req, res) => {
    try {
        const [funds] = await pool.query("SELECT * FROM fund");
        res.status(200).json({
            success: true,
            fund: funds,
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
        const [fund] = await pool.query("SELECT * FROM fund WHERE id = ?", [id]);
        if (fund.length === 0) {
            return res.status(404).json({ success: false, msg: "Fund not found" });
        }
        res.status(200).json({
            success: true,
            banner: fund[0],
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
        const [fund] = await pool.query("SELECT * FROM fund WHERE id = ?", [id]);

        if (fund.length === 0) {
            return res.status(404).json({ success: false, msg: "Fund Details not found" });
        } else {
            const fileid = fund[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM fund WHERE id = ?", [id]);
        }
        res.status(200).json({
            success: true,
            message: "Fund Details Deleted Successfully",
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
        const [fund] = await pool.query("SELECT * FROM fund WHERE id = ?", [id]);

        if (fund.length === 0) {
            return res.status(404).json({ success: false, msg: "Fund Details not found" });
        }
        if (file) {
            const fileid = fund[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/fund",
                crop: "fill",
            });
            await pool.query(
                "UPDATE fund SET fileid = ?, fileurl = ?, title = ?, description = ?, raisedprice = ?, goalprice = ? WHERE id = ?",
                [myCloud.public_id, myCloud.secure_url, title, description, raisedprice, goalprice, id]
            );
        } else {
            await pool.query(
                "UPDATE fund SET title = ?, description = ?, raisedprice = ?, goalprice = ? WHERE id = ?",
                [title, description, raisedprice, goalprice, id]
            );
        }
        res.status(200).json({
            success: true,
            message: "Fund Details Updated Successfully",
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
        const [[fundCount]] = await pool.query("SELECT COUNT(*) AS count FROM fund");
        res.status(200).json({
            success: true,
            tableName: "fund",
            count: fundCount.count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Fund Details count fetch failed",
        });
    }
};
