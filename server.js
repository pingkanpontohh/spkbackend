require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const topsisRoutes = require("./routes/topsisRoutes");
const authRoutes = require("./routes/authRoutes");
const jurusanRoutes = require("./routes/jurusanRoutes");

// ======================================
// MIDDLEWARE
// ======================================

// Atur CORS agar secara spesifik mengizinkan domain frontend Anda
app.use(cors({
    origin: ["https://spkfrontend.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Tambahkan route dasar (fallback) agar jika diakses langsung di browser tidak 404
app.get("/", (req, res) => {
    res.json({ message: "Backend SPK Jurusan Aktif!" });
});

// ======================================
// ROUTES
// ======================================

app.use("/api/topsis", topsisRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jurusan", jurusanRoutes);

// ======================================
// SERVER
// ======================================

// Gunakan process.env.PORT yang disediakan oleh platform hosting (seperti Vercel)
const PORT = process.env.PORT || 5000;

// Jalankan server hanya jika tidak berada di lingkungan serverless Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// WAJIB DIKASIH INI AGAR VERCEL SERVERLESS BISA MEMBACA EXPRESS ANDA
module.exports = app;