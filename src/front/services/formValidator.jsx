const validate = require('validate.js');

export const validateFormField = (value, field) => {
  const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  switch (field) {
    case 'name':
    case 'description':
      return value.length > 0;

    case 'appleStoreLink':
    case 'googleMarketLink':
      return value.match(urlRegex) || value.length === 0;

    case 'redirectUris':
      return !value
        .split(',')
        .some(
          (uri) =>
            typeof validate(
              { uri: uri.trim() },
              { uri: { url: { schemes: ['.+'], allowLocal: true } } },
            ) !== 'undefined',
        );

    default:
      return false;
  }
};

export const checkValid = (errorState) => {
  let valid = true;
  Object.keys(errorState).forEach((element) => {
    if (errorState[element] === true) {
      valid = false;
    }
  });

  return valid;
};
