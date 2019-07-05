module.exports = {
  className: 'Sample2',
  fields: {
    name: { type: 'String' },
    fieldBoolean: { type: 'Boolean' },
    updateName: { type: 'String' },
    another: { type: 'Number' },
    owner: { type: 'Pointer', targetClass: '_User' },
  },
  classLevelPermissions: {
    find: { '*': true },
    get: { '*': true },
    create: { '*': true },
    update: { '*': true },
    delete: { '*': true },
    addField: { '*': true },
    protectedFields: { '*': [] },
  },
};
