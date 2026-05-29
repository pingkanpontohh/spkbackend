// backend/routes/topsisRoutes.js
const express = require("express");
const router = express.Router();

const {
  saveUser,
  prosesTopsis,
  getHistory,
  getKriteria // <-- Ditambahkan di sini
} = require("../controllers/topsisController");

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

// ======================================
// ROUTE BARU: LIHAT DATA KRITERIA
// ======================================
router.get(
  "/kriteria",
  getKriteria // <-- Ditambahkan di sini
);

module.exports = router;