const Developer = require('./model/developer');
const Application = require('./model/application');
const mongoose = require('mongoose');

class MongoInstall {
  async init() {}

  async exec() {
    let developer = new Developer({
      login: 'sample',
      githubId: 12345,
      companyName: 'company',
      email: 'undefined@company.com',
      created_at: new Date(),
      updated_at: new Date(),
    });

    developer = await developer.save();

    let application = new Application({
      developerId: developer._id,
      name: 'sampleApp',
      token: 'superToken',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await application.save();

    return true;
  }
}

const install = new MongoInstall();
install.init().then(async () => await install.exec());
