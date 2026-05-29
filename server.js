require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const topsisRoutes = require("./routes/topsisRoutes");
const authRoutes = require("./routes/authRoutes");
const jurusanRoutes = require("./routes/jurusanRoutes");

// ======================================
// 1. MIDDLEWARE (Wajib di paling atas)
// ======================================

// Atur CORS agar secara spesifik mengizinkan domain frontend Anda
app.use(cors({
    origin: ["https://spkfrontend.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// ======================================
// 2. ROUTES DEFINITION
// ======================================

// Daftarkan rute API utama Anda di sini
app.use("/api/topsis", topsisRoutes);
app.use("/api/auth", authRoutes);
    app.use("/api/jurusan", jurusanRoutes);

// ======================================
// 3. ROOT HANDLING & FALLBACK (Dipindahkan ke bawah)
// ======================================

// Jika ada yang mengakses root GET (seperti browser biasa)
app.get("/", (req, res) => {
    res.json({ message: "Backend SPK Jurusan Aktif!" });
});

// Jalur Fallback: Jika frontend salah menembak ke URL https://spkbackend-gamma.vercel.app/ 
// menggunakan metode POST, kita arahkan langsung ke fungsi proses dari topsisRoutes secara aman.
app.post("/", async (req, res, next) => {
    // Mengalihkan request internal Express secara halus ke middleware /api/topsis
    req.url = "/api/topsis/proses"; 
    app.handle(req, res, next);
});

// ======================================
// 4. SERVER EXPORT
// ======================================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// WAJIB UNTUK VERCEL SERVERLESS
module.exports = app;