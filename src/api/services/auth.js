const jwt = require('jsonwebtoken');
const moment = require('moment');
const { AUTH_SECRET } = require('../../config');
const github = require('./github');
const Developer = require('./../../db/model/developer');

class Auth {
  // Generate a token and send connect link by email
  async createUserIfNotExist(userGithub) {
    let developer = await Developer.findOne({ githubId: userGithub.id }).exec();

    if (!developer) {
      developer = new Developer({
        login: userGithub.login,
        githubId: userGithub.id,
        companyName: userGithub.company,
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
    const githubToken = await github.getAccessToken(githubCode);
    const userGithub = await github.getUser(githubToken);
    const developer = await this.createUserIfNotExist(userGithub);

    const jwtToken = jwt.sign(
      {
        login: developer.login,
        name: userGithub.name,
        iat: moment().valueOf(),
        exp: moment()
          .add(1, 'days')
          .valueOf(),
      },
      AUTH_SECRET,
    );

    return jwtToken;
  }
}

module.exports = new Auth();
