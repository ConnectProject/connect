export default (schemaClass) => {
  const newSchemaClass = schemaClass;
  // even if it's set on the schema classes we remove it to be sure the correct type an properties is setup
  if (newSchemaClass.fields.userId) {
    delete newSchemaClass.fields.userId;
  }
  if (newSchemaClass.fields.applicationId) {
    delete newSchemaClass.fields.applicationId;
  }
  // setup the field to know who has setup the row
  newSchemaClass.fields.userId = { type: 'String', required: true };
  newSchemaClass.fields.applicationId = { type: 'String', required: true };

  newSchemaClass.classLevelPermissions = {
    find: { 'role:Developer': true, 'role:Administrator': true },
    get: { 'role:Developer': true, 'role:Administrator': true },
    count: { 'role:Developer': true, 'role:Administrator': true },
    create: { 'role:Developer': true, 'role:Administrator': true },
    update: { 'role:Developer': true, 'role:Administrator': true },
    delete: { 'role:Developer': true, 'role:Administrator': true },
  };

  return newSchemaClass;
};
