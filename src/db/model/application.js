const mongoose = require('../apiClient');

const applicationSchema = new mongoose.Schema({
  developerId: mongoose.Schema.Types.ObjectId,
  name: String,
  token: String,
  create_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
