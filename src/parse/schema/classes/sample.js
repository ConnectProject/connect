module.exports = {
  className: 'Sample',
  fields: {
    name: { type: 'String' },
    activationDate: { type: 'Date' },
    isActive: { type: 'Boolean' },
    owner: { type: 'Pointer', targetClass: '_User' },
  },
};
