const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 4000,
  // WAJIB TAMBAHKAN BAGIAN INI
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal connect");
    console.log(err);
  } else {
    console.log("Database TiDB connected");
  }
});

module.exports = db;