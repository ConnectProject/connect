const Parse = require('./../../../parse');
const Naming = require('./naming');
const uuidv4 = require('uuid/v4');
const logger = require('./../../../logger');

class Application {
  constructor({ applicationModel }) {
    this.applicationModel = applicationModel;
    this.namingService = new Naming({ applicationModel });
  }

  async list(developer) {
    return this.applicationModel.find({ developer });
  }

  async get(developer, id) {
    return this.applicationModel.findOne({ developer, _id: id });
  }

  async create(developer, input) {
    const token = uuidv4();
    const tokenSandbox = uuidv4();

    const parseName = await this.namingService.getUniqName(input.name);

    let application = new this.applicationModel({
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
    const application = await this.applicationModel
      .findOneAndUpdate(
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
      )
      .exec();

    return application;
  }
}

module.exports = Application;
