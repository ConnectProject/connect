const mongoModel = require('./../../../db/model');
const clearParseUser = require('./clearParse');

class Developer {
  constructor() {
    this.model = mongoModel;
  }

  async delete(developer) {
    const deleteOps = [];
    const applications = await this.model.Application.find({ developer });

    for (const application of applications) {
      deleteOps.push(clearParseUser(application.parse_name));
      deleteOps.push(clearParseUser(application.parse_name, true));
    }

    // deleteOps.push(this.model.Application.deleteMany({ developer }));
    // deleteOps.push(this.model.Developer.deleteOne({ _id: developer._id }));

    return Promise.all(deleteOps);
  }
}

module.exports = Developer;
