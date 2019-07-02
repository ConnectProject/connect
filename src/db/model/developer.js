const mongoose = require('../apiClient');

const developerSchema = new mongoose.Schema({
  login: String,
  githubId: { type: Number, unique: true },
  companyName: String,
  email: String,
  create_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Developer', developerSchema);
