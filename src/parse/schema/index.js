const Config = require('parse-server/lib/Config');
const { PARSE_APP_ID, PUBLIC_URL } = require('./../../config');
const logger = require('./../../logger');

const schemaClasses = [require('./product')];

module.exports = async () => {
  const config = new Config(PARSE_APP_ID, `${PUBLIC_URL}/parse`);

  console.log(config);

  const schema = await config.database.loadSchema();

  try {
    for (const schemaClass of schemaClasses) {
      if (await schema.hasClass(schemaClass.className)) {
        await schema.updateClass(schemaClass.className, schemaClass.fields);
      } else {
        await schema.addClassIfNotExists(
          schemaClass.className,
          schemaClass.fields,
        );
      }
    }
  } catch (err) {
    if (err.code === 103) {
      logger(err.message);
    } else {
      throw err;
    }
  }
};
