import Parse from 'parse';

import UserService from './user-service';

const Application = Parse.Object.extend('OAuthApplication');

const listApplications = async () => {
  const currentUser = await UserService.getCurrentUserAsync();
  if (!currentUser) {
    return [];
  }

  return new Parse.Query(Application).equalTo('owner', currentUser).find();
};

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
