require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes aur Middleware import
const vaultRoutes = require('./routes/vault');
const { protect } = require('./middleware/auth');

// --- YEH LINE MISSING THI (App Initialize) ---
const app = express();

// Middleware (Zaroori settings)
app.use(express.json()); // JSON data samajhne ke liye
app.use(cors());         // Frontend ko allow karne ke liye

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Routes Setup
// 'protect' lagaya hai taaki sirf logged-in user hi access kare
app.use('/api/vault', protect, vaultRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});