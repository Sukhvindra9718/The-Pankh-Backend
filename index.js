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
const createBankDetailsTable = async () => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS bankdetails (
    id UUID PRIMARY KEY NOT NULL,
    fileid VARCHAR NOT NULL,
    fileurl VARCHAR NOT NULL,
    createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ifsccode VARCHAR NOT NULL,
    accountnumber VARCHAR NOT NULL,
    branchname VARCHAR NOT NULL,
    upiid VARCHAR NOT NULL
  );
`;
  try {
      const client = await pool.connect();
      await client.query(createTableQuery);
      console.log("Table 'bankdetails' created successfully");
  } catch (err) {
      console.error("Error creating table", err.stack);
  } finally {
  }
};
const createBannerTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banner (
      id UUID PRIMARY KEY NOT NULL,
      pagename VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'banner' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createCarousalTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS carousal (
      id UUID PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'carousal' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createContactUsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contactus (
      id UUID PRIMARY KEY NOT NULL,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone VARCHAR NOT NULL,
      subject VARCHAR NOT NULL,
      message TEXT NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'contactus' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createKeyContactTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS keycontact (
      id UUID PRIMARY KEY NOT NULL,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone VARCHAR NOT NULL,
      organization VARCHAR NOT NULL,
      designation VARCHAR NOT NULL
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'keycontact' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
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
const createDonationTable = async () => {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS donations (
      id UUID PRIMARY KEY NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      fullname VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phonenumber VARCHAR NOT NULL,
      country VARCHAR NOT NULL,
      amount VARCHAR NOT NULL,
      utrnumber VARCHAR NOT NULL,
      donationdatetime TIMESTAMP WITHOUT TIME ZONE,
      remarks TEXT
  )`;
  try {
      const client = await pool.connect();
      await client.query(createTableQuery);
      console.log("Table 'donations' created successfully");
  } catch (err) {
      console.error("Error creating table", err.stack);
  } finally {
  }
};
const createEventsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      shortdescription TEXT NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      eventsdatetime TIMESTAMP WITHOUT TIME ZONE,
      link VARCHAR
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'events' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createFundTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS fund (
      id UUID PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      raisedprice INT NOT NULL,
      goalprice INT NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'fund' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createImagesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS images (
      id UUID PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      description TEXT NOT NULL,
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
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createNewsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS news (
      id UUID PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      shortdescription TEXT NOT NULL,
      longdescription TEXT NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      userid VARCHAR NOT NULL,
      newsdatetime TIMESTAMP WITHOUT TIME ZONE,
      link VARCHAR
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'news' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createProjectsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY,
      title VARCHAR NOT NULL,
      description TEXT NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'projects' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const createTestimonialTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS testimonial (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      name VARCHAR NOT NULL,
      role VARCHAR NOT NULL,
      comment TEXT NOT NULL,
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
const createVideoTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(40) PRIMARY KEY NOT NULL,
      title VARCHAR NOT NULL,
      description TEXT NOT NULL,
      url VARCHAR NOT NULL,
      fileid VARCHAR NOT NULL,
      fileurl VARCHAR NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'videos' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
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
 
  }
};

createBankDetailsTable();
createBannerTable();
createCarousalTable();
createContactUsTable();
createKeyContactTable();
createPropertiesAccessTable();
createDonationTable();
createEventsTable();
createFundTable();
createImagesTable();
createNewsTable();
createProjectsTable();
createTestimonialTable();
createUsersTable();
createVideoTable();
createVolunteerTable();



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
