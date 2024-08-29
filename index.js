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
// app.use(cors({ origin: "http://localhost:3001" }));
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
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



const createBankDetailsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bankdetails (
      id CHAR(36) PRIMARY KEY NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ifsccode VARCHAR(11) NOT NULL,
      accountnumber VARCHAR(20) NOT NULL,
      branchname VARCHAR(255) NOT NULL,
      upiid VARCHAR(255) NOT NULL
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'bankdetails' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //connection.release(); // Release the connection back to the pool
  }
};
const createBannerTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banner (
      id CHAR(36) PRIMARY KEY NOT NULL,
      pagename VARCHAR(255) NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'banner' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //connection.release(); // Release the connection back to the pool
  }
};
const createCarousalTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS carousal (
      id CHAR(36) PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'carousal' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};
const createContactUsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contactus (
      id CHAR(36) PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'contactus' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createKeyContactTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS keycontact (
      id CHAR(36) PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      organization VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'keycontact' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createPropertiesAccessTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS propertiesaccess (
      id CHAR(36) PRIMARY KEY NOT NULL,
      Property VARCHAR(255) NOT NULL,
      isEnabled BOOLEAN NOT NULL
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'propertiesaccess' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createDonationTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS donations (
      id CHAR(36) PRIMARY KEY NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fullname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(20) NOT NULL,
      country VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      utrnumber VARCHAR(255) NOT NULL,
      donationdatetime TIMESTAMP,
      remarks TEXT
    );
  `;

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'donations' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createEventsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id CHAR(36) PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      shortdescription TEXT NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      eventsdatetime TIMESTAMP,
      link VARCHAR(255)
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'events' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createFundTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS fund (
      id CHAR(36) PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      raisedprice INT NOT NULL,
      goalprice INT NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'fund' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createImagesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS images (
      id CHAR(36) PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'images' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createNewsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS news (
      id CHAR(36) PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      shortdescription TEXT NOT NULL,
      longdescription TEXT NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      userid VARCHAR(255) NOT NULL,
      newsdatetime TIMESTAMP,
      link VARCHAR(255)
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'news' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createProjectsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id CHAR(36) PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'projects' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createTestimonialTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS testimonial (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'testimonial' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createVideoTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      url VARCHAR(255) NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'videos' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};

const createVolunteerTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS volunteer (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      username VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      facebookurl VARCHAR(255) NOT NULL,
      twitterurl VARCHAR(255) NOT NULL,
      instagramurl VARCHAR(255) NOT NULL,
      linkedinurl VARCHAR(255) NOT NULL,
      fileid VARCHAR(255) NOT NULL,
      fileurl VARCHAR(255) NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query(createTableQuery);
    console.log("Table 'volunteer' created successfully");
  } catch (err) {
    console.error('Error creating table', err.stack);
  } finally {
    //if (connection) connection.release(); // Release the connection back to the pool
  }
};




// createBankDetailsTable();
// createBannerTable();
// createCarousalTable();
// createContactUsTable();
// createKeyContactTable();
// createPropertiesAccessTable();
// createDonationTable();
// createEventsTable();
// createFundTable();
// createImagesTable();
// createNewsTable();
// createProjectsTable();
// createTestimonialTable();
// createVideoTable();
// createVolunteerTable();


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
