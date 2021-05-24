const mongoModel = require('../../../db/model');

class Naming {
  constructor() {
    this.model = mongoModel();
  }

  async getUniqName(name) {
    let genName = Naming.genParseName(name);

    // eslint-disable-next-line no-await-in-loop
    while (!(await this.isUniqName(genName))) {
      genName = Naming.genParseName(name);
    }

    return genName;
  }

  async isUniqName(name) {
    const application = await this.model.Application.findOne({
      parse_name: name,
    }).exec();

    return application === null;
  }

  static genParseName(name) {
    const clearName = name.replace(/[^a-zA-Z0-9 ]/g, '');
    const uid = Naming.generateUID();

    return `${uid}-${clearName}`;
  }

  static generateUID() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = `000${firstPart.toString(36)}`.slice(-3);
    secondPart = `000${secondPart.toString(36)}`.slice(-3);

    return firstPart + secondPart;
  }
}

module.exports = Naming;
