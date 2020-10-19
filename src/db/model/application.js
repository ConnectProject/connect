const mongoose = require('mongoose');

module.exports = (apiConnect) => {
  if (apiConnect.modelNames().includes('Application')) {
    return apiConnect.model('Application');
  }

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

  return apiConnect.model('Application', applicationSchema);
};
