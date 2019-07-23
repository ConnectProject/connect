const mongoModel = require('./../../db/model');

class Developer {
  constructor() {
    this.model = mongoModel;
  }

  async delete(developer) {
    await this.model.Application.deleteMany({ developer });
    return this.model.Developer.deleteOne({ _id: developer._id });
  }
}

module.exports = Developer;
