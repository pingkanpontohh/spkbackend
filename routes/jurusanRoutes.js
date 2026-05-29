// backend/routes/jurusanRoutes.js
const express = require("express");
const router = express.Router();

// Import semua fungsi yang baru saja kita buat di controller
const {
  getJurusan,
  addJurusan,
  updateJurusan,
  deleteJurusan
} = require("../controllers/jurusanController");

// 1. Route mengambil data (Diakses oleh frontend lewat API.get("/api/jurusan"))
router.get("/", getJurusan);

// 2. Route menambah data (Diakses oleh frontend lewat API.post("/api/jurusan"))
router.post("/", addJurusan);

// 3. Route mengubah data berdasarkan ID (Diakses lewat API.put(`/api/jurusan/${id}`))
router.put("/:id", updateJurusan);

// 4. Route menghapus data berdasarkan ID (Diakses lewat API.delete(`/api/jurusan/${id}`))
router.delete("/:id", deleteJurusan);

module.exports = router;