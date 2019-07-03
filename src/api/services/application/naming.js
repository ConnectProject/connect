const Application = require('./../../../db/model/application');

class Naming {
  async getUniqName(name) {
    let genName = this.genParseName(name);

    while (!(await this.isUniqName(genName))) {
      genName = this.genParseName(name);
    }

    return genName;
  }

  async isUniqName(name) {
    const application = await Application.findOne({ parseName: name }).exec();

    return application === null;
  }

  genParseName(name) {
    const clearName = name.replace(/[^a-zA-Z0-9 ]/g, '');
    const uid = this.generateUID();

    return `${uid}-${clearName}`;
  }

  generateUID() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = ('000' + firstPart.toString(36)).slice(-3);
    secondPart = ('000' + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }
}

module.exports = new Naming();
