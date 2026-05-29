// backend/controllers/jurusanController.js
const db = require("../config/db");

// 1. GET
const getJurusan = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM jurusan ORDER BY id ASC");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. POST
const addJurusan = async (req, res) => {
  try {
    const { kategori_id, nama_jurusan, deskripsi } = req.body;
    const finalKategori = kategori_id || 1;
    const finalDesc = deskripsi || "Deskripsi belum diisi";
    
    await db.query(
      "INSERT INTO jurusan (kategori_id, nama_jurusan, deskripsi, gambar) VALUES (?, ?, ?, 'default.png')",
      [finalKategori, nama_jurusan, finalDesc]
    );
    res.status(201).json({ success: true, message: "Jurusan berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. PUT
const updateJurusan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_jurusan, deskripsi, kategori_id } = req.body;
    await db.query(
      "UPDATE jurusan SET nama_jurusan = ?, deskripsi = ?, kategori_id = ? WHERE id = ?",
      [nama_jurusan, deskripsi, kategori_id, id]
    );
    res.json({ success: true, message: "Jurusan berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. DELETE
const deleteJurusan = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM jurusan WHERE id = ?", [id]);
    res.json({ success: true, message: "Jurusan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PERIKSA BAGIAN INI: Pastikan nama fungsi di sini sama persis dengan yang di atas
module.exports = { 
  getJurusan, 
  addJurusan, 
  updateJurusan, 
  deleteJurusan 
};