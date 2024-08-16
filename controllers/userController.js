// userController.js
const pool = require('../db');

const getUserById = async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if(user.rows.length === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.status(200).json({success:true,user:user.rows[0]});
  } catch (error) {
    res.status(500).send({success: false,userError:'Server Error', error: error.message});
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [req.user.username]);
    if(user.rows.length === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.status(200).json({success:true,user:user.rows[0]});
  } catch (error) {
    res.status(500).send({success: false,userError:'Server Error', error: error.message});
  }
}


const updateUser = async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Get the user's current data
    const currentUser = user.rows[0];

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
    if (req.body.profile_picture) {
      currentUser.profile_picture = req.body.profile_picture;
    }

    if(req.body.role){
      currentUser.role = req.body.role;
    }

    // Construct the update query dynamically based on the updated fields
    const updateFields = [];
    const values = [];
    let i = 1;

    for (const key in currentUser) {
      if (currentUser[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = $${i}`);
        values.push(currentUser[key]);
        i++;
      }
    }

    // Update the user in the database
    const updateUserQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${i} RETURNING *`;
    const updatedUser = await pool.query(updateUserQuery, [...values, req.user.id]);

    res.status(200).json({success:true,user:updatedUser.rows[0]});
  } catch (error) {
    res.status(500).send({success: false,userError:'Server Error', error: error.message});
  }
};


const deleteUser = async (req, res) => {
  // Implement delete logic
  try {
    const { id } = req.params;
    const user = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (user.rowCount === 0) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.status(200).json({success:true,msg:`User with id ${id} was deleted`});
  } catch (error) {
    res.status(500).send({success: false,userError:'Server Error', error: error.message});
  }
}


const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users');
    res.status(200).json({success:true,users:allUsers.rows});
  } catch (error) {
    res.status(500).send({success: false,userError:'Server Error', error: error.message});
  }
};
// Implement other user functions like updateUser, deleteUser

const getAllUserCount = async (req, res) => {
  try {
    const users = await pool.query("SELECT count(*) FROM users");
    res.status(200).json({
      success: true,
      tableName: "Users",
      count: users.rows[0].count,
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
  getAllUserCount
  // Other functions...
};
