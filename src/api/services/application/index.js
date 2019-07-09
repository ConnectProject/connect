const ApplicationModel = require('../../../db/model/application');
const Parse = require('./../../../parse');
const naming = require('./naming');
const uuidv4 = require('uuid/v4');
const logger = require('./../../../logger');

class Application {
  async list(developer) {
    return ApplicationModel.find({ developer });
  }

  async get(developer, id) {
    return ApplicationModel.findOne({ developer, _id: id });
  }

  async create(developer, input) {
    const token = uuidv4();
    const tokenSandbox = uuidv4();

    const parseName = await naming.getUniqName(input.name);

    let application = new ApplicationModel({
      developer,
      name: input.name,
      description: input.description,
      parse_name: parseName,
      token,
      token_sandbox: tokenSandbox,
      apple_store_link: input.appleStoreLink,
      google_market_link: input.googleMarketLink,
      created_at: new Date(),
      updated_at: new Date(),
    });

    application = await application.save();

    try {
      const user = new Parse.User();
      user.set('username', parseName);
      user.set('password', token);
      await user.signUp({}, { useMasterKey: true });
    } catch (error) {
      logger('Error: ' + error.code + ' ' + error.message);
    }

    return application;
  }

  async update(id, developer, input) {
    const application = await ApplicationModel.findOneAndUpdate(
      {
        _id: id,
        developer,
      },
      {
        name: input.name,
        description: input.description,
        apple_store_link: input.appleStoreLink,
        google_market_link: input.googleMarketLink,
        updated_at: new Date(),
      },
      { new: true },
    ).exec();

    return application;
  }
}

module.exports = new Application();
