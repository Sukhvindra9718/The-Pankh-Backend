const pool = require('../db');
const fs = require('fs');
const uuid = require('uuid');


exports.addVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const videoPath = req.file.path;
        const filename = req.file.filename;
        const id = uuid.v4();
        await pool.query('INSERT INTO videos (id,title,description,filename,videopath) VALUES ($1, $2, $3,$4,$5) RETURNING *', [id, title, description, filename, videoPath]);

        res.status(200).json({
            success: true,
            message: 'Video Uploaded Succesfully',
        })
    } catch (error) {
        res.status(500).send({ success: false, userError: 'Server Error', error: error.message });
    }
}

exports.getAllVideos = async (req, res) => {
    try {
        const videos = await pool.query('SELECT * FROM videos');
        res.status(200).json({
            success: true,
            videos:videos.rows
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: 'Videos fetch failed'
        })
    }
}

exports.getVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
        if(video.rows.length === 0) {
            return res.status(404).json({ success: false, msg: 'Video not found' });
        }
        res.status(200).json({
            success: true,
            video:video.rows[0]
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: 'Video fetch failed'
        })
    }
}

exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
        const videoPath = video.rows[0].videopath;
        fs.unlinkSync(videoPath);
        await pool.query('DELETE FROM videos WHERE id = $1', [id]);
        res.status(200).json({
            success: true,
            message: 'Video Deleted Succesfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            userError: 'Video delete failed'
        })
    }
}


exports.getAllVideosCount = async (req, res) => {
    try {
      const videos = await pool.query("SELECT count(*) FROM videos");
      res.status(200).json({
        success: true,
        tableName: "Videos",
        count: videos.rows.length,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
        userError: "Videos fetch failed",
      });
    }
  };