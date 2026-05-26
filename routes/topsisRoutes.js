// backend/routes/topsisRoutes.js

const express = require("express");

const router = express.Router();

const {

  saveUser,
  prosesTopsis,
  getHistory

} = require(
  "../controllers/topsisController"
);


// ======================================
// SIMPAN USER
// ======================================

router.post(
  "/save",
  saveUser
);


// ======================================
// PROSES TOPSIS
// ======================================

router.post(
  "/proses",
  prosesTopsis
);

router.get(
  "/history",
  getHistory
);


module.exports = router;