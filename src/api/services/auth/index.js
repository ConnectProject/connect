const jwt = require('jsonwebtoken');
const moment = require('moment');
const { AUTH_SECRET } = require('../../../config');
const Github = require('./github');
const mongoModel = require('../../../db/model');

class Auth {
  constructor() {
    this.model = mongoModel();
  }

  // Generate a token and send connect link by email
  async createUserIfNotExist(userGithub) {
    let developer = await this.model.Developer.findOne({
      github_id: userGithub.id,
    }).exec();

    if (!developer) {
      developer = new this.model.Developer({
        login: userGithub.login,
        github_id: userGithub.id,
        company_name: userGithub.company,
        email: userGithub.email,
        created_at: new Date(),
        updated_at: new Date(),
      });

      developer = await developer.save();
    }

    return developer;
  }

  // Valid a token and return the jwt session
  async connectUser(githubCode) {
    const githubToken = await Github.getAccessToken(githubCode);
    const userGithub = await Github.getUser(githubToken);
    const developer = await this.createUserIfNotExist(userGithub);

    return Auth.genJwtToken(developer, userGithub.name);
  }

  static genJwtToken(developer, name) {
    return jwt.sign(
      {
        login: developer.login,
        name,
        id: developer.github_id,
        iat: moment().valueOf(),
        exp: moment().add(1, 'days').valueOf(),
      },
      AUTH_SECRET,
    );
  }
}

module.exports = Auth;
