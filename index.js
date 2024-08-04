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

readdirSync("./routes").map((route) =>
  app.use("/api", require("./routes/" + route))
);
app.use("/public", express.static(path.join(__dirname, "public")));

// app.use(cors());
app.use(cors({ origin: "http://localhost:3001" }));
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

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
const server = app.listen(PORT, (req, res) => {
  console.log(`Server is working on ${host}:${PORT}`);
});
// const createBannerTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS banner (
//       id VARCHAR(40) PRIMARY KEY NOT NULL,
//       pagename VARCHAR NOT NULL,
//       fileid VARCHAR NOT NULL,
//       fileurl VARCHAR NOT NULL,
//       createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   try {
//     const client = await pool.connect();
//     await client.query(createTableQuery);
//     console.log("Table 'banner' created successfully");
//   } catch (err) {
//     console.error('Error creating table', err.stack);
//   } finally {
//     pool.end();
//   }
// };
// const createCarousalTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS carousal (
//       id VARCHAR(40) PRIMARY KEY NOT NULL,
//       title VARCHAR NOT NULL,
//       description VARCHAR NOT NULL,
//       fileid VARCHAR NOT NULL,
//       fileurl VARCHAR NOT NULL,
//       createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   try {
//     const client = await pool.connect();
//     await client.query(createTableQuery);
//     console.log("Table 'carousal' created successfully");
//   } catch (err) {
//     console.error('Error creating table', err.stack);
//   } finally {
//     pool.end();
//   }
// };
// const createContactUsTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS contactus (
//       id VARCHAR(40) PRIMARY KEY NOT NULL,
//       name VARCHAR NOT NULL,
//       email VARCHAR NOT NULL,
//       phone VARCHAR NOT NULL,
//       subject VARCHAR NOT NULL,
//       message VARCHAR NOT NULL,
//       createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   try {
//     const client = await pool.connect();
//     await client.query(createTableQuery);
//     console.log("Table 'contactus' created successfully");
//   } catch (err) {
//     console.error('Error creating table', err.stack);
//   } finally {
//     pool.end();
//   }
// };
const createImageTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS images (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      description VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'images' created successfully");
  } catch (err) {
    console.error('Error creating table', err.stack);
  } finally {
    // pool.end();
  }
};
// const createKeyContactUsTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS keycontact (
//       id VARCHAR(40) PRIMARY KEY NOT NULL,
//       name VARCHAR NOT NULL,
//       email VARCHAR NOT NULL,
//       phone VARCHAR NOT NULL,
//       organization VARCHAR NOT NULL,
//       designation VARCHAR NOT NULL,
//       createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//   try {
//     const client = await pool.connect();
//     await client.query(createTableQuery);
//     console.log("Table 'keycontact' created successfully");
//   } catch (err) {
//     console.error('Error creating table', err.stack);
//   } finally {
//     pool.end();
//   }
// };
const createTestimonialTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS testimonial (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      name VARCHAR NOT NULL,
      role VARCHAR NOT NULL,
      comment VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'testimonial' created successfully");
  } catch (err) {
    console.error('Error creating table', err.stack);
  } finally {
    // pool.end();
  }
};
// const createVideosTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS videos (
//       id VARCHAR(40) PRIMARY KEY NOT NULL,
//       title VARCHAR NOT NULL,
//       description VARCHAR NOT NULL,
//       filename VARCHAR NOT NULL,
//       videopath VARCHAR NOT NULL,
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
//     pool.end();
//   }
// };
const createVolunteerTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS volunteer (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      username VARCHAR NOT NULL,
      phonenumber VARCHAR NOT NULL,
      role VARCHAR NOT NULL,
      facebookurl VARCHAR NOT NULL,
      twitterurl VARCHAR NOT NULL,
      instagramurl VARCHAR NOT NULL,
      linkedinurl VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'volunteer' created successfully");
  } catch (err) {
    console.error('Error creating table', err.stack);
  } finally {
    pool.end();
  }
};
// createBannerTable(); // Banner Done
// createCarousalTable(); // Carousal Done
// createContactUsTable(); // Contact Us Done
createImageTable();
// createKeyContactUsTable(); // Key Contact Done
createTestimonialTable();
// createVideosTable(); // Videos Done
createVolunteerTable();
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
