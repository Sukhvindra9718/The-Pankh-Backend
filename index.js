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
