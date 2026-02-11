const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
  
  // 👇 CHANGE: userId hata diya, ab EMAIL hi main ID hai
  email: {
    type: String,
    required: true,
    unique: true, // Har email ka ek alag vault hoga
    trim: true,
    lowercase: true
  },

  details: {
    fullName: { type: String, default: '' },
    fatherName: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    aadharNo: { type: String, default: '' },
    panNo: { type: String, default: '' },
    bodyMark: { type: String, default: '' },   // New Field
    nationality: { type: String, default: '' } // New Field
  },

  documents: {
    aadharCard: { type: String, default: '' },
    panCard: { type: String, default: '' },
    markSheet10: { type: String, default: '' },
    markSheet12: { type: String, default: '' },
    photo: { type: String, default: '' },
    signature: { type: String, default: '' },
    // 👇 Ye naye documents bhi add kar diye hain
    casteCert: { type: String, default: '' },
    incomeCert: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Vault', vaultSchema);
