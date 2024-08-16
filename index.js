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
app.use(cors({ origin: "https://thepankh.info" }));
app.use(express.json({ limit: "50mb" }));

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
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
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
// });

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

const createDonationTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS donations (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      fullname VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phonenumber VARCHAR NOT NULL,
      country VARCHAR NOT NULL,
      amount BIGINT NOT NULL,
      utrnumber VARCHAR NOT NULL,
      donationdatetime TIMESTAMP WITHOUT TIME ZONE,
      remarks VARCHAR,
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'donations' created successfully");
  } catch (err) {
    console.error('Error creating table', err.stack);
  } finally {

  }
};
const createBankDetailsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bankdetails (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ifsccode VARCHAR NOT NULL,
      accountnumber VARCHAR NOT NULL,
      upiid VARCHAR NOT NULL,
      branchname VARCHAR NOT NULL,
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'bankdetails' created successfully");
  } catch (err) {
    console.error('Error creating table', err.stack);
  } finally {

  }
};

const createFundTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS fund (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      title VARCHAR NOT NULL,
      raisedprice VARCHAR NOT NULL,
      goalprice VARCHAR NOT NULL,
      description VARCHAR NOT NULL,
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'fund' created successfully");
  } catch (err) {
    console.error('Error creating table', err.stack);
  } finally {

  }
};
createDonationTable();
// createBankDetailsTable();
// createFundTable();
// Delete video table
const deleteTable = async (table) => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${table};
  `;
  try {
    const client = await pool.connect();
    await client.query(deleteTableQuery);
    console.log("Table 'video' deleted successfully");
  } catch (err) {
    console.error('Error deleting table', err.stack);
  } finally {

  }
};
deleteTable("news");
deleteTable("events");
// const createVideoTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS videos (
//       id VARCHAR(40) PRIMARY KEY NOT NULL,
//       title VARCHAR NOT NULL,
//       description VARCHAR NOT NULL,
//       url VARCHAR NOT NULL,
//       fileid VARCHAR NOT NULL,
//       fileurl VARCHAR NOT NULL,
//       createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   try {
//     const client = await pool.connect();
//     await client.query(createTableQuery);
//     console.log("Table 'videos' created successfully");
//   } catch (err) {
//     console.error('Error creating table', err.stack);
//   } finally {

//   }
// };
// createVideoTable();
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
