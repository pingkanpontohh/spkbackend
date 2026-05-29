// backend/config/db.js
const mysql = require('mysql2');

// Menggunakan createPool, bukan createConnection biasa agar koneksi lebih stabil di Vercel
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Menggunakan promise wrapper agar query database berjalan asinkronus dengan baik
const db = pool.promise();

console.log("Database TiDB Pool Initialized");

module.exports = db;