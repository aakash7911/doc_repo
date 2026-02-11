const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vault = require('../models/Vault');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cloudinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage Engine (Resize ke sath)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zobbly_docs',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    transformation: [{ width: 1000, crop: "limit" }] // Image resize taaki fast ho
  },
});
const upload = multer({ storage: storage });

// Fields Config
const vaultUploads = upload.fields([
  { name: 'doc-aadhar', maxCount: 1 },
  { name: 'doc-pan', maxCount: 1 },
  { name: 'doc-10th', maxCount: 1 },
  { name: 'doc-12th', maxCount: 1 },
  { name: 'doc-photo', maxCount: 1 },
  { name: 'doc-sign', maxCount: 1 },
  { name: 'doc-caste', maxCount: 1 },
  { name: 'doc-income', maxCount: 1 }
]);

// --- API ROUTES ---

// ✅ GET: Email ke zariye data lao (Unique Data)
router.get('/:email', async (req, res) => {
  try {
    const userEmail = req.params.email; // URL se email uthao
    const vault = await Vault.findOne({ email: userEmail });
    
    if (!vault) return res.status(200).json({ details: {}, documents: {} }); // Agar naya hai to khali bhejo
    
    res.json(vault);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ✅ POST: Email ke hisaab se Save karo (Unique Storage)
router.post('/', vaultUploads, async (req, res) => {
  try {
    let details = {};
    if (req.body.details) {
      details = JSON.parse(req.body.details);
    }

    // Email check karo (Zaroori hai)
    const userEmail = details.email;
    if (!userEmail) {
      return res.status(400).json({ msg: "Email is missing in details!" });
    }

    // Database mein is Email ko dhundo
    let vault = await Vault.findOne({ email: userEmail });

    // Agar nahi mila, to naya banao
    if (!vault) {
      vault = new Vault({ email: userEmail });
    }

    // Text Data Update
    vault.details = { ...vault.details, ...details };

    // Files Update
    // Hum files ka path store kar rahe hain
    if (req.files) {
      if (req.files['doc-aadhar']) vault.documents.aadharCard = req.files['doc-aadhar'][0].path;
      if (req.files['doc-pan']) vault.documents.panCard = req.files['doc-pan'][0].path;
      if (req.files['doc-10th']) vault.documents.markSheet10 = req.files['doc-10th'][0].path;
      if (req.files['doc-12th']) vault.documents.markSheet12 = req.files['doc-12th'][0].path;
      if (req.files['doc-photo']) vault.documents.photo = req.files['doc-photo'][0].path;
      if (req.files['doc-sign']) vault.documents.signature = req.files['doc-sign'][0].path;
      // Naye wale bhi
      if (req.files['doc-caste']) vault.documents.casteCert = req.files['doc-caste'][0].path;
      if (req.files['doc-income']) vault.documents.incomeCert = req.files['doc-income'][0].path;
    }

    await vault.save();
    res.json({ msg: 'Saved Successfully', vault });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
