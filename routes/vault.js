const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vault = require('../models/Vault');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cloudinary Setup (Free Storage)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zobbly_docs', // Cloudinary me is naam ka folder banega
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  },
});
const upload = multer({ storage: storage });

// Fields Config (Kaunsi file kahan jayegi)
const vaultUploads = upload.fields([
  { name: 'doc-aadhar', maxCount: 1 },
  { name: 'doc-pan', maxCount: 1 },
  { name: 'doc-10th', maxCount: 1 },
  { name: 'doc-12th', maxCount: 1 },
  { name: 'doc-photo', maxCount: 1 },
  { name: 'doc-sign', maxCount: 1 }
]);

// --- API ROUTES ---

// GET: User ka saved data laane ke liye
router.get('/', async (req, res) => {
  try {
    // Note: req.user._id tabhi milega jab aapne Auth middleware lagaya ho
    const vault = await Vault.findOne({ userId: req.user._id });
    if (!vault) return res.status(200).json({ details: {}, documents: {} });
    res.json(vault);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST: Data aur Files save karne ke liye
router.post('/', vaultUploads, async (req, res) => {
  try {
    let details = {};
    if (req.body.details) {
      details = JSON.parse(req.body.details);
    }

    let vault = await Vault.findOne({ userId: req.user._id });
    if (!vault) {
      vault = new Vault({ userId: req.user._id });
    }

    // Text Data Update
    vault.details = { ...vault.details, ...details };

    // Files Update (Agar nayi upload hui hai to hi change karo)
    if (req.files) {
      if (req.files['doc-aadhar']) vault.documents.aadharCard = req.files['doc-aadhar'][0].path;
      if (req.files['doc-pan']) vault.documents.panCard = req.files['doc-pan'][0].path;
      if (req.files['doc-10th']) vault.documents.markSheet10 = req.files['doc-10th'][0].path;
      if (req.files['doc-12th']) vault.documents.markSheet12 = req.files['doc-12th'][0].path;
      if (req.files['doc-photo']) vault.documents.photo = req.files['doc-photo'][0].path;
      if (req.files['doc-sign']) vault.documents.signature = req.files['doc-sign'][0].path;
    }

    await vault.save();
    res.json({ msg: 'Saved Successfully', vault });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;