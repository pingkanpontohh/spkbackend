// backend/server.js
require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();

const topsisRoutes =
require("./routes/topsisRoutes");

const authRoutes =
require("./routes/authRoutes");

const jurusanRoutes =
require("./routes/jurusanRoutes");


// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json());


// ======================================
// ROUTES
// ======================================

app.use(
  "/api/topsis",
  topsisRoutes
);

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/jurusan",
  jurusanRoutes
);

// ======================================
// SERVER
// ======================================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});