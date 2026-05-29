// backend/controllers/jurusanController.js
const db = require("../config/db"); // Menggunakan db.js berbasis Promise Pool

// ======================================
// 1. AMBIL SEMUA DATA JURUSAN (GET)
// ======================================
const getJurusan = async (req, res) => {
  try {
    const sql = `SELECT * FROM jurusan ORDER BY id ASC`;
    
    // Menggunakan await karena db.js Anda berbasis Promise
    const [result] = await db.query(sql);

    // Kembalikan dalam format objek dengan properti 'data' agar dibaca lancar oleh frontend
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error getJurusan:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================================
// 2. TAMBAH JURUSAN BARU (POST)
// ======================================
const addJurusan = async (req, res) => {
  try {
    const { nama_jurusan } = req.body;

    if (!nama_jurusan) {
      return res.status(400).json({ success: false, message: "Nama jurusan wajib diisi" });
    }

    const sql = `INSERT INTO jurusan (nama_jurusan) VALUES (?)`;
    await db.query(sql, [nama_jurusan]);

    res.status(201).json({
      success: true,
      message: "Jurusan baru berhasil ditambahkan!"
    });
  } catch (error) {
    console.error("Error addJurusan:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================================
// 3. UBAH DATA JURUSAN (PUT)
// ======================================
const updateJurusan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_jurusan } = req.body;

    if (!nama_jurusan) {
      return res.status(400).json({ success: false, message: "Nama jurusan baru wajib diisi" });
    }

    const sql = `UPDATE jurusan SET nama_jurusan = ? WHERE id = ?`;
    await db.query(sql, [nama_jurusan, id]);

    res.json({
      success: true,
      message: "Data jurusan berhasil diperbarui!"
    });
  } catch (error) {
    console.error("Error updateJurusan:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================================
// 4. HAPUS DATA JURUSAN (DELETE)
// ======================================
const deleteJurusan = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM jurusan WHERE id = ?`;
    await db.query(sql, [id]);

    res.json({
      success: true,
      message: "Jurusan berhasil dihapus dari sistem!"
    });
  } catch (error) {
    console.error("Error deleteJurusan:", error);
    res.status(500).json({ 
      success: false, 
      message: "Gagal menghapus. Data ini kemungkinan masih terikat dengan tabel penilaian/kriteria.",
      error: error.message 
    });
  }
};

// WAJIB DIEKSPOR SEMUANYA
module.exports = {
  getJurusan,
  addJurusan,
  updateJurusan,
  deleteJurusan
};