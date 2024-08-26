const pool = require('../db');
const bcrypt = require("bcryptjs");


const getUserById = async (req, res) => {
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.status(200).json({ success: true, user: user[0] });
  } catch (error) {
    res.status(500).send({ success: false, userError: 'Server Error', error: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [req.user.username]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.status(200).json({ success: true, user: user[0] });
  } catch (error) {
    res.status(500).send({ success: false, userError: 'Server Error', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);

    if (user.length === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Get the user's current data
    const currentUser = user[0];

    // Update user's data with the provided fields from the request body
    if (req.body.username) {
      currentUser.username = req.body.username;
    }
    if (req.body.password) {
      currentUser.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.phonenumber) {
      currentUser.phonenumber = req.body.phonenumber;
    }
    if (req.body.role) {
      currentUser.role = req.body.role;
    }

    // Construct the update query dynamically based on the updated fields
    const updateFields = [];
    const values = [];
    let i = 1;

    for (const key in currentUser) {
      if (currentUser[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = ?`);
        values.push(currentUser[key]);
        i++;
      }
    }

    // Update the user in the database
    const updateUserQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const [updatedUser] = await pool.query(updateUserQuery, [...values, req.user.id]);

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).send({ success: false, userError: 'Server Error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [user] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (user.affectedRows === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.status(200).json({ success: true, msg: `User with id ${id} was deleted` });
  } catch (error) {
    res.status(500).send({ success: false, userError: 'Server Error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [allUsers] = await pool.query('SELECT * FROM users');
    if (allUsers.length === 0) {
      return res.status(404).json({ success: false, msg: 'No users found' });
    }
    res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
    res.status(500).send({ success: false, userError: 'Server Error', error: error.message });
  }
};

const getAllUserCount = async (req, res) => {
  try {
    const [[userCount]] = await pool.query("SELECT COUNT(*) AS count FROM users");
    res.status(200).json({
      success: true,
      tableName: "Users",
      count: userCount.count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Users fetch failed",
    });
  }
};

module.exports = {
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllUserCount,
};
