// authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const authenticationMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');


  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    // Add user from token payload
    req.user = decoded.user;
    next();
  } catch (err) {
    // Clear cookie
    res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: false, sameSite: 'Lax' });
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


const superAdminMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    // Check if the user is a superadmin
    if (decoded.user.role !== 'superadmin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    // Add user from token payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const adminMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');
  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    // Check if the user is an admin
    if (decoded.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    // Add user from token payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const verifyToken = (req, res, next) => {

  // Get token from header
  const token = req.header('Authorization');
 
  // Check if token doesn't exist
  if (!token) {
    return res.status(200).json({ success:false,msg: 'Authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    res.status(200).json({ success:true,msg: 'User is authorized' });
  } catch (err) {
    res.status(200).json({ success:false,msg: 'Token is not valid' });
  }
};

module.exports = {
  authenticationMiddleware,
  superAdminMiddleware,
  adminMiddleware,
  verifyToken
}

