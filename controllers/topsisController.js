// backend/controllers/topsisController.js
const db = require("../config/db"); // Menggunakan db.js berbasis Promise Pool

const saveUser = async (req, res) => {
  try {
    const { nama, sekolah, nilai_ijazah, jenis_kelamin, minat_utama } = req.body;
    
    // Sesuaikan nama tabel dan kolom dengan database Anda
    const sql = `INSERT INTO users (nama, sekolah, nilai_ijazah, jenis_kelamin, minat_utama) VALUES (?, ?, ?, ?, ?)`;
    await db.query(sql, [nama, sekolah, nilai_ijazah, jenis_kelamin, minat_utama]);

    res.status(201).json({ success: true, message: "Biodata berhasil disimpan" });
  } catch (error) {
    console.error("Error saveUser:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const prosesTopsis = async (req, res) => {
  try {
    const { jawaban, nama } = req.body;

    // =========================
    // VALIDASI INPUT
    // =========================
    if (!jawaban || jawaban.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Jawaban kosong"
      });
    }

    const sql = `
      SELECT
        jurusan.id,
        jurusan.nama_jurusan,
        kriteria.id AS kriteria_id,
        penilaian.nilai
      FROM penilaian
      JOIN jurusan ON jurusan.id = penilaian.jurusan_id
      JOIN kriteria ON kriteria.id = penilaian.kriteria_id
      ORDER BY jurusan.id, kriteria.id
    `;

    // MENGGUNAKAN AWAIT UNTUK ASYNC POOL DB
    const [result] = await db.query(sql);

    console.log("DATA DB:", result);
    console.log("JAWABAN:", jawaban);

    // =========================
    // VALIDASI DATA DB
    // =========================
    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data penilaian kosong di database"
      });
    }

    // =========================
    // GROUPING
    // =========================
    const jurusanMap = {};
    result.forEach((item) => {
      if (!jurusanMap[item.id]) {
        jurusanMap[item.id] = {
          nama: item.nama_jurusan,
          nilai: []
        };
      }
      jurusanMap[item.id].nilai.push(parseFloat(item.nilai));
    });

    // =========================
    // HITUNG SKOR
    // =========================
    const ranking = [];
    Object.keys(jurusanMap).forEach((id) => {
      const data = jurusanMap[id];
      let total = 0;

      data.nilai.forEach((nilai, index) => {
        const bobot = parseFloat(jawaban[index]);

        // Jika bobot tidak valid, lewati langkah ini
        if (isNaN(bobot)) return;

        total += nilai * bobot;
      });

      ranking.push({
        jurusan_id: id,
        nama: data.nama,
        skor: parseFloat(total.toFixed(2))
      });
    });

    // =========================
    // SORTING & RANKING
    // =========================
    ranking.sort((a, b) => b.skor - a.skor);

    const hasilFinal = ranking.map((item, index) => ({
      ranking: index + 1,
      ...item
    }));

    console.log("HASIL FINAL:", hasilFinal);

    if (hasilFinal.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Hasil perhitungan kosong"
      });
    }

    const terbaik = hasilFinal[0];

    // =========================
    // SIMPAN HISTORY KE DB (MENGGUNAKAN AWAIT)
    // =========================
    const saveHistorySql = `
      INSERT INTO history_hasil (nama, jurusan, skor) 
      VALUES (?, ?, ?)
    `;
    
    try {
      await db.query(saveHistorySql, [nama, terbaik.nama, terbaik.skor]);
      console.log("History berhasil disimpan ke database");
    } catch (dbErr) {
      console.error("Gagal menyimpan history ke DB:", dbErr);
    }

    // =========================
    // RESPONSE BALIKAN KE FRONTEND
    // =========================
    res.json({
      success: true,
      hasil: hasilFinal // Akan dibaca oleh localStorage di frontend
    });

  } catch (error) {
    console.error("Error pada fungsi prosesTopsis:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const sql = "SELECT * FROM history_hasil ORDER BY id DESC";
    const [rows] = await db.query(sql);
    res.json({ success: true, history: rows });
  } catch (error) {
    console.error("Error getHistory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================================
// WAJIB DIEKSPOR SEMUANYA
// ======================================
module.exports = {
  saveUser,
  prosesTopsis,
  getHistory
};