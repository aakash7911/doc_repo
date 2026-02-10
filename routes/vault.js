const express = require('express');
const router = express.Router();
const Vault = require('../models/Vault');
const { protect } = require('../middleware/auth');

// --- 1. CLOUDINARY & MULTER SETUP ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary Config (Environment Variables se lega)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zobbly_docs', // Cloudinary me folder ka naam
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // PDF bhi allow kiya
    resource_type: 'auto' // PDF aur Image dono chalega
  },
});

const upload = multer({ storage: storage });

// --- 2. GET ROUTE (Data dekhne ke liye) ---
router.get('/', protect, async (req, res) => {
  try {
    let vault = await Vault.findOne({ user: req.user.id });
    if (!vault) {
      return res.status(200).json({ msg: 'No data found', details: {} });
    }
    res.json({ details: vault });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- 3. POST ROUTE (Upload & Save) ---
// 'upload.fields' batata hai ki kaunsi file kahan jayegi
const uploadFields = upload.fields([
  { name: 'doc-photo', maxCount: 1 },
  { name: 'doc-aadhar', maxCount: 1 },
  { name: 'doc-pan', maxCount: 1 },
  { name: 'doc-10th', maxCount: 1 },
  { name: 'doc-12th', maxCount: 1 },
  { name: 'doc-caste', maxCount: 1 },
  { name: 'doc-income', maxCount: 1 },
  { name: 'doc-residence', maxCount: 1 },
  { name: 'doc-sign', maxCount: 1 }
]);

router.post('/', protect, uploadFields, async (req, res) => {
  try {
    // 1. Text Data nikalo
    let details = {};
    if (req.body.details) {
      details = JSON.parse(req.body.details);
    }

    // 2. Files ke Links nikalo (Agar upload hui hain to)
    const files = req.files || {};

    if (files['doc-photo']) details.photoUrl = files['doc-photo'][0].path;
    if (files['doc-aadhar']) details.aadharCardUrl = files['doc-aadhar'][0].path;
    if (files['doc-pan']) details.panCardUrl = files['doc-pan'][0].path;
    if (files['doc-10th']) details.tenthMarkUrl = files['doc-10th'][0].path;
    if (files['doc-12th']) details.twelfthMarkUrl = files['doc-12th'][0].path;
    if (files['doc-caste']) details.casteCertUrl = files['doc-caste'][0].path;
    if (files['doc-income']) details.incomeCertUrl = files['doc-income'][0].path;
    if (files['doc-residence']) details.residenceCertUrl = files['doc-residence'][0].path;
    if (files['doc-sign']) details.signUrl = files['doc-sign'][0].path;

    // 3. Database me Save/Update karo
    // upsert: true ka matlab, agar data nahi hai to naya banao, hai to update karo
    const vault = await Vault.findOneAndUpdate(
      { user: req.user.id },
      { $set: details },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ msg: 'Saved Successfully', details: vault });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

module.exports = router;
