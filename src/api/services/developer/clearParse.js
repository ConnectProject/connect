const getParseModel = require('./../../../db/parse');
const getClasses = require('./../../../parse/schema/getClasses');
const logger = require('./../../../logger');

// Remove all data related to an application (user in parse)
async function clearParseUser(username, sandbox) {
  const schemaClasses = await getClasses();
  const parseModel = await getParseModel(sandbox);

  const userModel = parseModel.get('_User');
  const user = await userModel.findOne({ username }).exec();

  if (!user) {
    logger(`No user found for '${username}'`);
    return null;
  }

  const deleteOps = [];

  for (const schemaClass of schemaClasses) {
    const model = parseModel.get(schemaClass.className);

    deleteOps.push(model.deleteMany({ _p_owner: `_User$${user._id}` }));
  }

  const sessionModel = parseModel.get('_Session');
  deleteOps.push(sessionModel.deleteMany({ _p_user: `_User$${user._id}` }));

  const joinUsersModel = parseModel.get('_Join:users:_Role');
  deleteOps.push(joinUsersModel.deleteMany({ relatedId: user._id }));

  deleteOps.push(userModel.deleteOne({ _id: user._id }));

  return Promise.all(deleteOps);
}

module.exports = clearParseUser;
