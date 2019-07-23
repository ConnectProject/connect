module.exports = schemaClass => {
  const newSchemaClass = schemaClass;

  // even if it's set on the schema classes we remove it to be sure the great type an properties is setup
  if (newSchemaClass.fields.owner) {
    delete newSchemaClass.fields.owner;
  }
  // setup the field to know who has setup the row
  newSchemaClass.fields.owner = { type: 'Pointer', targetClass: '_User' };

  newSchemaClass.classLevelPermissions = {
    find: { 'role:Developer': true, 'role:Administrator': true },
    get: { 'role:Developer': true, 'role:Administrator': true },
    create: { 'role:Developer': true, 'role:Administrator': true },
    update: { 'role:Developer': true, 'role:Administrator': true },
    delete: { 'role:Developer': true, 'role:Administrator': true },
    protectedFields: { '*': ['owner'] },
  };

  return newSchemaClass;
};
