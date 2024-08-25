// index.js
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/config");
const app = express();
const PORT = config.PORT;
const { readdirSync } = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const os = require("os");
const host = os.hostname();
const pool = require("./db");
const cloudinary = require("cloudinary");

readdirSync("./routes").map((route) => app.use("/api", require("./routes/" + route)));
app.use("/public", express.static(path.join(__dirname, "public")));

// app.use(cors());
app.use(cors({ origin: "http://thepankh.info" }));
app.use(express.json({ limit: "50mb" }));

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/common", require("./routes/commonRoutes"));
app.use("/api/v1", require("./routes/videoRoutes"));
app.use("/api/v1", require("./routes/imagesRoutes"));
app.use("/api/v1", require("./routes/bannerRoutes"));
app.use("/api/v1", require("./routes/carousalRoutes"));
app.use("/api/v1", require("./routes/volunteerRoutes"));
app.use("/api/v1", require("./routes/testimonialRoutes"));
app.use("/api/v1", require("./routes/newsRoutes"));
app.use("/api/v1", require("./routes/eventsRoutes"));
app.use("/api/v1", require("./routes/fundDetailsRoutes"));
app.use("/api/v1", require("./routes/projectRoutes"));
app.use("/api/v1", require("./routes/donationRoutes.js"));
app.use("/api/v1", require("./routes/bankdetailsRoutes.js"));

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

// Use Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Database Connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Database connected:", result.rows);
  });
});
const createPropertiesAccessTable = async () => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS propertiesaccess (
    id UUID PRIMARY KEY NOT NULL,
    Property VARCHAR NOT NULL,
    isEnabled BOOLEAN NOT NULL
  );
`;
  try {
      const client = await pool.connect();
      await client.query(createTableQuery);
      // console.log("Table 'propertiesAccess' created successfully");
  } catch (err) {
      console.error("Error creating table", err.stack);
  } finally {
  }
};
const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username VARCHAR(40) UNIQUE NOT NULL,
      password VARCHAR NOT NULL,
      phonenumber VARCHAR NOT NULL,
      role VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'users' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
// createUsersTable();
// createPropertiesAccessTable();

// I want to delete all tables present in the database
const deleteAllTables = async () => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS bankdetails;
    DROP TABLE IF EXISTS banner;
    DROP TABLE IF EXISTS carousal;
    DROP TABLE IF EXISTS contactus;
    DROP TABLE IF EXISTS donations;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS fund;
    DROP TABLE IF EXISTS images;
    DROP TABLE IF EXISTS keycontact;
    DROP TABLE IF EXISTS news;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS propertiesaccess;
    DROP TABLE IF EXISTS testimonial;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS videos;
    DROP TABLE IF EXISTS volunteer;
  `;
  try {
    const client = await pool.connect();
    await client.query(deleteTableQuery);
    console.log("Tables deleted successfully");
  } catch (err) {
    console.error("Error deleting tables", err.stack);
  } finally {
  }
}
deleteAllTables();
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
const server = app.listen(PORT, (req, res) => {
  console.log(`Server is working on ${host}:${PORT}`);
});

// // unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shuting down the server due to unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
process.once("SIGUSR2", function () {
  console.log("nodemon restart");
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  console.log("App terminated");
  process.kill(process.pid, "SIGINT");
});
