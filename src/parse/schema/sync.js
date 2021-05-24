const Config = require('parse-server/lib/Config');
const getClasses = require('./getClasses');
const sanitizeClass = require('./sanitizeClass');
const initClasses = require('./_initClasses');

// Retrieve the fields not already setup on the parse schema installed
const getNewFields = async function (schema, schemaClass) {
  const actualSchemaClass = await schema.getOneSchema(schemaClass.className);

  const newFields = {};
  for (const field of Object.keys(schemaClass.fields)) {
    if (!actualSchemaClass.fields[field]) {
      newFields[field] = schemaClass.fields[field];
    }
  }

  return newFields;
};

// Create or Update the schema
const applySchemaSync = async function (schema, schemaClass) {
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
};

module.exports = async (appId) => {
  const schemaClasses = await getClasses();
  const schema = await Config.get(appId).database.loadSchema();

  const schemaSyncs = [];
  for (const schemaClass of initClasses) {
    schemaSyncs.push(applySchemaSync(schema, schemaClass));
  }

  for (const schemaClass of schemaClasses) {
    // a schemaClass should have at least a className and a field
    if (schemaClass.className || schemaClass.fields) {
      schemaSyncs.push(applySchemaSync(schema, sanitizeClass(schemaClass)));
    }
  }

  await Promise.all(schemaSyncs);
};
