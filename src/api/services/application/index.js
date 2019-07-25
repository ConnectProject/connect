const uuidv4 = require('uuid/v4');
const Parse = require('./../../../parse');
const Naming = require('./naming');
const mongoModel = require('./../../../db/model');

class Application {
  constructor() {
    this.model = mongoModel;
    this.namingService = new Naming();
  }

  async list(developer) {
    return this.model.Application.find({ developer });
  }

  async get(developer, id) {
    return this.model.Application.findOne({ developer, _id: id });
  }

  async create(developer, input) {
    const token = uuidv4();
    const tokenSandbox = uuidv4();

    const parseName = await this.namingService.getUniqName(input.name);

    let application = new this.model.Application({
      developer,
      name: input.name,
      description: input.description,
      parse_name: parseName,
      token,
      token_sandbox: tokenSandbox,
      apple_store_link: input.apple_store_link,
      google_market_link: input.google_market_link,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await Parse.signUp(parseName, token);
    await Parse.signUp(parseName, tokenSandbox, true);

    application = await application.save();

    return application;
  }

  async update(id, developer, input) {
    const application = await this.model.Application.findOneAndUpdate(
      {
        _id: id,
        developer,
      },
      {
        name: input.name,
        description: input.description,
        apple_store_link: input.apple_store_link,
        google_market_link: input.google_market_link,
        updated_at: new Date(),
      },
      { new: true },
    ).exec();

    return application;
  }
}

module.exports = Application;
