const validate = require('validate.js');

module.exports = (data) =>
  validate(data, {
    name: {
      presence: true,
    },
    description: {
      presence: true,
    },
    appleStoreLink: {
      presence: false,
    },
    googleMarketLink: {
      presence: false,
    },
  });
