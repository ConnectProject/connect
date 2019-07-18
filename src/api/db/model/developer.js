const mongoose = require('../client');

const developerSchema = new mongoose.Schema({
  login: String,
  github_id: { type: Number, unique: true },
  company_name: String,
  email: String,
  create_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Developer', developerSchema);
