const mongoose = require('mongoose');

const VaultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // --- Personal Details ---
  fullName: { type: String, default: '' },
  fatherName: { type: String, default: '' },
  dob: { type: String, default: '' },
  nationality: { type: String, default: 'Indian' },
  gender: { type: String, default: '' },
  bodyMark: { type: String, default: '' }, // Naya Field
  email: { type: String, default: '' },
  mobile: { type: String, default: '' },
  address: { type: String, default: '' },
  aadharNo: { type: String, default: '' },
  panNo: { type: String, default: '' },

  // --- Document Links (Cloudinary URLs) ---
  photoUrl: { type: String, default: '' },       // Photo
  aadharCardUrl: { type: String, default: '' },  // Aadhar File
  panCardUrl: { type: String, default: '' },     // PAN File
  tenthMarkUrl: { type: String, default: '' },   // 10th
  twelfthMarkUrl: { type: String, default: '' }, // 12th
  casteCertUrl: { type: String, default: '' },   // Jati
  incomeCertUrl: { type: String, default: '' },  // Aay (Income)
  residenceCertUrl: { type: String, default: '' }, // Niwas
  signUrl: { type: String, default: '' }         // Signature

}, { timestamps: true });

module.exports = mongoose.model('Vault', VaultSchema);
