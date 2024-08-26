const pool = require("../db");
const uuid = require("uuid");
const cloudinary = require("cloudinary");

// Events CRUD
exports.createEvents = async (req, res) => {
    try {
        const { title, shortdescription, file, eventsdatetime, link } = req.body;
        const created_at = new Date();
        const id = uuid.v4();
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "thepankh/events",
            crop: "fill",
        });
        await pool.query(
            "INSERT INTO events (id, title, shortdescription, fileid, fileurl, createdat, eventsdatetime, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *",
            [
                id,
                title.toLowerCase(),
                shortdescription,
                myCloud.public_id,
                myCloud.secure_url,
                created_at,
                eventsdatetime,
                link
            ]
        );

        res.status(200).json({
            success: true,
            message: "Events Uploaded Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            userError: "Server Error",
            error: error.message,
        });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await pool.query("SELECT * FROM events");
        res.status(200).json({
            success: true,
            events: events,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Events fetch failed",
        });
    }
};

exports.deleteEvents = async (req, res) => {
    try {
        const { id } = req.params;
        const [events] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);

        if (events.length === 0) {
            return res.status(404).json({ success: false, msg: "Events not found" });
        } else {
            const fileid = events[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            await pool.query("DELETE FROM events WHERE id = ?", [id]);
        }
        res.status(200).json({
            success: true,
            message: "Events Deleted Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Events delete failed",
        });
    }
};

exports.updateEvents = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, shortdescription, file, eventsdatetime, link } = req.body;

        const [events] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);

        if (events.length === 0) {
            return res.status(404).json({ success: false, msg: "Events not found" });
        }
        if (file) {
            const fileid = events[0].fileid;
            await cloudinary.v2.uploader.destroy(fileid);
            const myCloud = await cloudinary.v2.uploader.upload(file, {
                folder: "thepankh/events",
                crop: "fill",
            });
            await pool.query(
                "UPDATE events SET fileid = ?, fileurl = ?, title = ?, shortdescription = ?, eventsdatetime = ?, link = ? WHERE id = ?",
                [myCloud.public_id, myCloud.secure_url, title, shortdescription, eventsdatetime, link, id]
            );
        } else {
            await pool.query(
                "UPDATE events SET title = ?, shortdescription = ?, eventsdatetime = ?, link = ? WHERE id = ?",
                [title, shortdescription, eventsdatetime, link, id]
            );
        }
        res.status(200).json({
            success: true,
            message: "Events Updated Successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Events update failed",
        });
    }
};

exports.getAllEventsCount = async (req, res) => {
    try {
        const [[eventsCount]] = await pool.query("SELECT COUNT(*) AS count FROM events");
        res.status(200).json({
            success: true,
            tableName: "Events",
            count: eventsCount.count,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: "Events fetch failed",
        });
    }
};
