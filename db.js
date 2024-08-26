const mysql = require('mysql2/promise');
const config = require('./config/config');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: config.database.host, // Replace with your MySQL host
  user: config.database.user,     // Replace with your MySQL username
  password: config.database.password, // Replace with your MySQL password
  database: config.database.database,     // Replace with your MySQL database name
  waitForConnections: true,
  connectionLimit: 1000,          // Maximum number of connections in the pool
  queueLimit: 0                 // Maximum number of queued connection requests (0 means no limit)
});

module.exports = pool;
