// backend/routes/jurusanRoutes.js
const express = require("express");
const router = express.Router();

// Pastikan tujuannya ke folder controllers, bukan file terselip di folder routes
const { 
  getJurusan, 
  addJurusan, 
  updateJurusan, 
  deleteJurusan 
} = require("../controllers/jurusanController"); 

// Definisikan rute secara hati-hati
router.get("/", getJurusan);
router.post("/", addJurusan);
router.put("/:id", updateJurusan);     // <-- Baris ini yang sebelumnya crash jika updateJurusan bernilai undefined
router.delete("/:id", deleteJurusan);

module.exports = router;