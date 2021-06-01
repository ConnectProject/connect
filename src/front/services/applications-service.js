import Parse from 'parse';

const Application = Parse.Object.extend('OAuthApplication');

const listApplications = () => new Parse.Query(Application).find();

const findById = (id) => new Parse.Query(Application).get(id);

const create = (newApplication) => {
  const app = new Application(newApplication);

  return app.save();
};

export default {
  listApplications,
  findById,
  create,
};
