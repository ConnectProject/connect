const ApplicationModel = require('../../../db/model/application');
const DeveloperModel = require('../../../db/model/developer');

class Developer {
  async delete(developer) {
    await ApplicationModel.deleteMany({ developer });
    return DeveloperModel.deleteOne({ _id: developer._id });
  }
}

module.exports = new Developer();
