const db = require("../config/db");

exports.getJurusan = (req, res) => {
    const sql = "SELECT * FROM jurusan";

    db.query(sql, (err, result) => {
        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

exports.prosesTopsis = (req, res) => {

    const {
        matematika,
        logika,
        minat,
        ekonomi
    } = req.body;

    // contoh sederhana
    const nilaiUser = (
        matematika +
        logika +
        minat +
        ekonomi
    ) / 4;

    let rekomendasi = "Teknik Informatika";

    if(nilaiUser < 70){
        rekomendasi = "Akuntansi";
    }

    res.json({
        nilai: nilaiUser,
        rekomendasi
    });
};