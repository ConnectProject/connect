const Config = require('parse-server/lib/Config');
const { PARSE_APP_ID } = require('./../config');
const logger = require('./../logger');
const schemaClasses = require('./schema');

async function getNewFields(schema, schemaClass) {
  const actualSchemaClass = await schema.getOneSchema(schemaClass.className);

  const newFields = {};
  for (const field of Object.keys(schemaClass.fields)) {
    if (!actualSchemaClass.fields[field]) {
      newFields[field] = schemaClass.fields[field];
    }
  }

  return newFields;
}

module.exports = async () => {
  const schema = await Config.get(PARSE_APP_ID).database.loadSchema();

  try {
    for (const schemaClass of schemaClasses) {
      if (await schema.hasClass(schemaClass.className)) {
        const newFields = await getNewFields(schema, schemaClass);
        await schema.updateClass(
          schemaClass.className,
          newFields,
          schemaClass.classLevelPermissions,
        );
      } else {
        await schema.addClassIfNotExists(
          schemaClass.className,
          schemaClass.fields,
          schemaClass.classLevelPermissions,
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
