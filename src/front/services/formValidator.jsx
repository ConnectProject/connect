export const validateFormField = (value, field) => {
  let validated = false;
  const urlRegex = new RegExp(
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi,
  );
  switch (field) {
    case 'name':
    case 'description':
      if (value.length === 0) {
        validated = false;
      } else {
        validated = true;
      }
      break;

    case 'apple_store_link':
    case 'google_market_link':
      if (value.match(urlRegex) || value.length === 0) {
        validated = true;
      } else {
        validated = false;
      }
      break;

    default:
      validated = false;
      break;
  }

  return validated;
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
