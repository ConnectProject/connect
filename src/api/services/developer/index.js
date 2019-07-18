class Developer {
  constructor({ applicationModel, developerModel }) {
    this.applicationModel = applicationModel;
    this.developerModel = developerModel;
  }

  async delete(developer) {
    await this.applicationModel.deleteMany({ developer });
    return this.developerModel.deleteOne({ _id: developer._id });
  }
}

module.exports = Developer;
