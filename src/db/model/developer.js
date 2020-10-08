const mongoose = require('mongoose');

module.exports = (apiConnect) => {
  if (apiConnect.modelNames().includes('Developer')) {
    return apiConnect.model('Developer');
  }

  const developerSchema = new mongoose.Schema({
    login: String,
    github_id: { type: Number, unique: true },
    company_name: String,
    email: String,
    create_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });

  return apiConnect.model('Developer', developerSchema);
};
