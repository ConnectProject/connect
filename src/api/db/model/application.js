const mongoose = require('../client');

const applicationSchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
  },
  name: String,
  description: String,
  parse_name: { type: String, unique: true },
  token: String,
  token_sandbox: String,
  apple_store_link: String,
  google_market_link: String,
  create_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
