const prosesTopsis = (req, res) => {

  try {

    const { jawaban, nama } = req.body;

    // =========================
    // VALIDASI
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

      JOIN jurusan
      ON jurusan.id = penilaian.jurusan_id

      JOIN kriteria
      ON kriteria.id = penilaian.kriteria_id

      ORDER BY jurusan.id, kriteria.id

    `;

    db.query(sql, (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          error: err
        });

      }

      console.log("DATA DB:", result);
      console.log("JAWABAN:", jawaban);

      // =========================
      // VALIDASI DATA DB
      // =========================

      if (result.length === 0) {

        return res.status(400).json({
          success: false,
          message: "Data penilaian kosong"
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

        jurusanMap[item.id]
          .nilai
          .push(parseFloat(item.nilai));

      });

      // =========================
      // HITUNG
      // =========================

      const ranking = [];

      Object.keys(jurusanMap).forEach((id) => {

        const data = jurusanMap[id];

        let total = 0;

        data.nilai.forEach((nilai, index) => {

          const bobot = parseFloat(jawaban[index]);

          console.log(
            "nilai:",
            nilai,
            "bobot:",
            bobot
          );

          // kalau bobot tidak valid
          if (isNaN(bobot)) {
            return;
          }

          total += nilai * bobot;

        });

        ranking.push({

          jurusan_id: id,

          nama: data.nama,

          skor: parseFloat(total.toFixed(2))

        });

      });

      // =========================
      // SORTING
      // =========================

      ranking.sort((a, b) => b.skor - a.skor);

      // =========================
      // HASIL FINAL
      // =========================

      const hasilFinal = ranking.map((item, index) => ({

        ranking: index + 1,

        ...item

      }));

      console.log("HASIL FINAL:", hasilFinal);

      // =========================
      // VALIDASI HASIL
      // =========================

      if (hasilFinal.length === 0) {

        return res.status(400).json({
          success: false,
          message: "Hasil TOPSIS kosong"
        });

      }

      const terbaik = hasilFinal[0];

      // =========================
      // SIMPAN HISTORY
      // =========================

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

          nama,

          terbaik.nama,

          terbaik.skor

        ],

        (err) => {

          if (err) {

            console.log("Gagal simpan history");
            console.log(err);

          }

        }

      );

      // =========================
      // RESPONSE
      // =========================

      res.json({

        success: true,

        hasil: hasilFinal

      });

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};