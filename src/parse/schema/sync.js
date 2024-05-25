/* global Parse */
import initClasses from './_initClasses.js';
import getClasses from './getClasses.js';
import sanitizeClass from './sanitizeClass.js';

// Retrieve the fields not already setup on the parse schema installed
const getNewFields = function getNewFields (actualSchemaClass, schemaClass) {

  const newFields = {};
  for (const field of Object.keys(schemaClass.fields)) {
    if (!actualSchemaClass.fields[field]) {
      newFields[field] = schemaClass.fields[field];
    }
  }

  return newFields;
};

// Create or Update the schema
const applySchemaSync = async function applySchemaSync (actualSchemas, schemaClass) {
  const actualSchemaClass = actualSchemas.find((schema) => schema.className === schemaClass.className);
  const schemaObject = new Parse.Schema(schemaClass.className);
  if (actualSchemaClass) {
    const newFields = getNewFields(actualSchemaClass, schemaClass);
    schemaObject._fields = newFields;
    await schemaObject.update();
  } else {
    schemaObject._fields = schemaClass.fields;
    schemaObject.setCLP(schemaClass.classLevelPermissions);
    await schemaObject.save();
  }
};

export default async () => {
  const schemaClasses = await getClasses();
  const actualSchemas = await Parse.Schema.all();

  const schemaSyncs = [];
  for (const schemaClass of initClasses) {
    schemaSyncs.push(applySchemaSync(actualSchemas, schemaClass));
  }

  for (const schemaClass of schemaClasses) {
    // a schemaClass should have at least a className and a field
    if (schemaClass.className && schemaClass.fields) {
      schemaSyncs.push(applySchemaSync(actualSchemas, sanitizeClass(schemaClass)));
    }
  }

  await Promise.all(schemaSyncs);
};
