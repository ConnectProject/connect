/* eslint-disable no-undef */
const getOne = async function (name) {
  const Role = Parse.Object.extend('_Role');
  const query = new Parse.Query(Role);
  query.equalTo('name', name);
  const result = await query.first({ useMasterKey: true });

  return result;
};

module.exports = {
  getOne,
};
