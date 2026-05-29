const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 4000, // Mengonversi string '4000' dari .env menjadi angka
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

connection.connect((err) => {
  if (err) {
    console.log("Database gagal connect");
    console.error(err);
  } else {
    console.log("Database TiDB connected");
  }
});

// PASTIKAN YANG DIEKSPOR ADALAH connection, BUKAN db
module.exports = connection;