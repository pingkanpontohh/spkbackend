// backend/controllers/jurusanController.js
const db = require("../config/db");

// 1. AMBIL DATA JURUSAN
const getJurusan = async (req, res) => {
  try {
    const sql = `SELECT * FROM jurusan ORDER BY id ASC`;
    const [result] = await db.query(sql);

    // Kirim response dalam bentuk object dengan key 'data'
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error getJurusan:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. TAMBAH DATA JURUSAN BARU
const addJurusan = async (req, res) => {
  try {
    // Tangkap semua parameter sesuai kolom di database Anda
    const { kategori_id, nama_jurusan, deskripsi, gambar } = req.body;

    if (!nama_jurusan) {
      return res.status(400).json({ success: false, message: "Nama jurusan wajib diisi" });
    }

    // Gunakan nilai default jika frontend tidak mengirimkan field opsional
    const finalKategoriId = kategori_id || 1; 
    const finalDeskripsi = deskripsi || "Deskripsi jurusan belum ditambahkan";
    const finalGambar = gambar || "default.png";

    const sql = `INSERT INTO jurusan (kategori_id, nama_jurusan, deskripsi, gambar) VALUES (?, ?, ?, ?)`;
    await db.query(sql, [finalKategoriId, nama_jurusan, finalDeskripsi, finalGambar]);

    res.status(201).json({
      success: true,
      message: "Jurusan baru berhasil ditambahkan!"
    });
  } catch (error) {
    console.error("Error addJurusan:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getJurusan,
  addJurusan
};