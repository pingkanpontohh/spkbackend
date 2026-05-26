// backend/controllers/topsisController.js

const db = require("../config/db");


// ======================================
// SIMPAN USER
// ======================================

const saveUser = (req, res) => {

  const {

    nama,
    sekolah,
    nilai_ijazah,
    jenis_kelamin,
    minat_utama

  } = req.body;

  const sql = `

    INSERT INTO users
    (
      nama,
      sekolah,
      nilai_ijazah,
      jenis_kelamin,
      minat_utama
    )

    VALUES (?, ?, ?, ?, ?)

  `;

  db.query(

    sql,

    [

      nama,
      sekolah,
      nilai_ijazah,
      jenis_kelamin,
      minat_utama

    ],

    (err, result) => {

      if(err){

        return res.status(500).json({

          success:false,

          message:"Gagal menyimpan user",

          error:err

        });

      }

      res.json({

        success:true,

        message:"User berhasil disimpan",

        userId: result.insertId

      });

    }

  );

};


// ======================================
// PROSES TOPSIS
// ======================================

const prosesTopsis = (req, res) => {

  try{

    const {
      jawaban,
      nama
    } = req.body;

    const sql = `

      SELECT

      jurusan.id,
      jurusan.nama_jurusan,

      kriteria.id AS kriteria_id,

      penilaian.nilai

      FROM penilaian

      JOIN jurusan
      ON jurusan.id =
      penilaian.jurusan_id

      JOIN kriteria
      ON kriteria.id =
      penilaian.kriteria_id

      ORDER BY jurusan.id,
      kriteria.id

    `;

    db.query(sql, (err, result) => {

      if(err){

        return res.status(500).json({

          success:false,
          error:err

        });

      }

      // =========================
      // GROUPING
      // =========================

      const jurusanMap = {};

      result.forEach((item) => {

        if(!jurusanMap[item.id]){

          jurusanMap[item.id] = {

            nama:item.nama_jurusan,

            nilai:[]

          };

        }

        jurusanMap[item.id]
        .nilai
        .push(
          parseFloat(item.nilai)
        );

      });

      // =========================
      // HITUNG
      // =========================

      const ranking = [];

      Object.keys(jurusanMap)
      .forEach((id) => {

        const data =
        jurusanMap[id];

        let total = 0;

        data.nilai.forEach(
          (nilai,index) => {

            total +=
            nilai *
            parseFloat(
              jawaban[index]
            );

          }
        );

        ranking.push({

          jurusan_id:id,

          nama:data.nama,

          skor:parseFloat(
            total.toFixed(2)
          )

        });

      });

      // =========================
      // SORTING
      // =========================

      ranking.sort(
        (a,b) => b.skor - a.skor
      );

      // =========================
      // HASIL FINAL
      // =========================

      const hasilFinal =
      ranking.map((item,index)=>({

        ranking:index+1,

        ...item

      }));

      // =========================
      // SIMPAN HISTORY
      // =========================

      const terbaik =
      hasilFinal[0];

      const saveHistory = `

        INSERT INTO history_hasil
        (
          nama,
          jurusan,
          skor
        )

        VALUES (?, ?, ?)

      `;

      db.query(

        saveHistory,

        [

          req.body.nama,

          terbaik.nama,

          terbaik.skor

        ]

      );

      // =========================
      // RESPONSE
      // =========================

      res.json({

        success:true,

        hasil:hasilFinal

      });

    });

  }catch(error){

    res.status(500).json({

      success:false,

      error:error.message

    });

  }

};

const getHistory = (req,res) => {

  const sql = `

    SELECT *
    FROM history_hasil

    ORDER BY created_at DESC

  `;

  db.query(sql,(err,result)=>{

    if(err){

      return res.status(500).json(err);

    }

    res.json(result);

  });

};


// ======================================
// EXPORT
// ======================================

module.exports = {

  saveUser,

  prosesTopsis,

  getHistory

};