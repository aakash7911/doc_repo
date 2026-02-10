const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  details: {
    fullName: { type: String, default: '' },
    fatherName: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    aadharNo: { type: String, default: '' },
    panNo: { type: String, default: '' }
  },
  documents: {
    aadharCard: { type: String, default: '' },
    panCard: { type: String, default: '' },
    markSheet10: { type: String, default: '' },
    markSheet12: { type: String, default: '' },
    photo: { type: String, default: '' },
    signature: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Vault', vaultSchema);