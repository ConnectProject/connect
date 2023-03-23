import Parse from 'parse';
import PubSub from '../utils/pub-sub';

const PubSubEvents = {
  AUTH_STATUS_UPDATED: 'AUTH_STATUS_UPDATED',
};

const getCurrentUser = () => Parse.User.current();
const getCurrentUserAsync = () => Parse.User.currentAsync();

const loginWithEmail = async ({ email, password }) => {
  const newlyLoggedInUser = await Parse.User.logIn(email, password);

  PubSub.publish(PubSubEvents.AUTH_STATUS_UPDATED);

  return newlyLoggedInUser;
};

const registerWithEmail = async ({ email, password }) => {
  const user = new Parse.User();
  user.set('username', email);
  user.set('email', email);
  user.set('password', password);

  const newlyLoggedInUser = await user.signUp();

  PubSub.publish(PubSubEvents.AUTH_STATUS_UPDATED);

  return newlyLoggedInUser;
};

const resetPassword = ({email}) => Parse.User.requestPasswordReset(email)

const verifyEmail = ({email}) => Parse.User.requestEmailVerification(email)


const confirmGithubAuth = async ({ code }) => {
  const authData = await Parse.Cloud.run('get-github-auth-data', {
    code: code,
  });

  const newlyLoggedInUser = await Parse.User.logInWith('github', { authData });
  PubSub.publish(PubSubEvents.AUTH_STATUS_UPDATED);

  return newlyLoggedInUser;
};

const logout = async () => {
  await Parse.User.logOut();
  PubSub.publish(PubSubEvents.AUTH_STATUS_UPDATED);
};

const deleteCurrentUser = async () => {
  await Parse.User.current().destroy();
  PubSub.publish(PubSubEvents.AUTH_STATUS_UPDATED);
};

export default {
  PubSubEvents,
  getCurrentUser,
  getCurrentUserAsync,
  loginWithEmail,
  registerWithEmail,
  confirmGithubAuth,
  logout,
  deleteCurrentUser,
  resetPassword,
  verifyEmail
};
