const mongoose = require('mongoose');
const getClasses = require('./../parse/schema/getClasses');
const connectClient = require('./client');

const modelMapping = new Map();
const modeSandboxMapping = new Map();

// Generate all mongoose schema and model for the parse db
async function getParseModel(sandbox) {
  const schemaClasses = await getClasses();
  const { parseConnect, parseSandboxConnect } = connectClient();
  const connect = sandbox ? parseSandboxConnect : parseConnect;
  const models = sandbox ? modeSandboxMapping : modelMapping;

  if (models.size > 0) {
    return models;
  }

  for (const schemaClass of schemaClasses) {
    const schema = new mongoose.Schema({
      _p_owner: String,
    });

    models.set(
      schemaClass.className,
      connect.model(schemaClass.className, schema, schemaClass.className),
    );
  }

  const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
  });

  models.set('_User', connect.model('_User', userSchema, '_User'));

  const sessionSchema = new mongoose.Schema({
    _p_user: String,
  });

  models.set('_Session', connect.model('_Session', sessionSchema, '_Session'));

  const joinUsersSchema = new mongoose.Schema({
    relatedId: String,
  });

  models.set(
    '_Join:users:_Role',
    connect.model('_Join:users:_Role', joinUsersSchema, '_Join:users:_Role'),
  );

  return models;
}

module.exports = getParseModel;
