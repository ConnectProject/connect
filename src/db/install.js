const Developer = require('./model/developer');
const Application = require('./model/application');
const mongoose = require('mongoose');

class MongoInstall {
  async init() {}

  async exec() {
    let developer = new Developer({
      login: 'sample',
      github_id: 12345,
      company_name: 'company',
      email: 'undefined@company.com',
      created_at: new Date(),
      updated_at: new Date(),
    });

    developer = await developer.save();

    let application = new Application({
      developer_id: developer._id,
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
