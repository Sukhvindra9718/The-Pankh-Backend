// authController.js
const bcrypt = require("bcryptjs");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const uuid = require("uuid");

const registerUser = async (req, res) => {
  try {
    // Process user registration
    const { username, password, phonenumber, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const imagePath = "";
    const filename = "";
    const id = uuid.v4();
    const newUser = await pool.query(
      "INSERT INTO users (id,username,password,phonenumber,role, profile_picture_name,profile_picture_path) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *",
      [id, username, hashedPassword, phonenumber, role, filename, imagePath]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the user exists in the database
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (!user.rows.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        role: user.rows[0].role,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, {
          httpOnly: true, // Accessible only by web server
          secure: process.env.NODE_ENV === "production", // HTTPS in production
          maxAge: 3600000, // 1 hour in milliseconds
        });

        res.json({ success: true, message: "Logged in successfully", token });
      }
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify the current password
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    const dbUser = user.rows[0];
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      dbUser.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Incorrect current password" });
    }
    console.log(req.body, req.user.id);
    // Update the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      req.user.id,
    ]);

    res.json({ success: true, msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a temporary token for password reset
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Update the user record with the reset token and expiration time
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE email = $2",
      [resetToken, email]
    );

    // Send the reset token to the user (e.g., via email)

    res.json({ success: true, msg: "Password reset token sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserPassword,
  forgotPassword,
};
