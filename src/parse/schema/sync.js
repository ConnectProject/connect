const Config = require('parse-server/lib/Config');
const { PARSE_APP_ID } = require('./../../config');
const logger = require('./../../logger');
const getClasses = require('./getClasses');
const sanitizeClass = require('./sanitizeClass');
const initClasses = require('./_initClasses');

// Retrieve the fields not already setup on the parse schema installed
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

// Create or Update the schema
async function applySchemaSync(schema, schemaClass) {
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

module.exports = async () => {
  const schemaClasses = await getClasses();
  const schema = await Config.get(PARSE_APP_ID).database.loadSchema();

  try {
    for (const schemaClass of initClasses) {
      await applySchemaSync(schema, schemaClass);
    }

    for (const schemaClass of schemaClasses) {
      // a schemaClass should have at least a className and a field
      if (!schemaClass.className && !schemaClass.fields) {
        continue;
      }

      sanitizeClass(schemaClass);
      await applySchemaSync(schema, schemaClass);
    }
  } catch (err) {
    if (err.code === 103) {
      logger(err.message);
    } else {
      throw err;
    }
  }
};
