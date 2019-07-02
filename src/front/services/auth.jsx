import * as Cookie from 'js-cookie';
import * as jwtDecode from 'jwt-decode';

export const logout = () => {
  Cookie.remove('jwt');
};

export const setAuthToken = token => {
  if (!isJwtValid(token)) {
    return false;
  }

  Cookie.set('jwt', token);
  return true;
};

const isJwtValid = jwt => {
  if (!jwt) {
    return false;
  }

  let decoded;

  try {
    decoded = jwtDecode(jwt);
  } catch (e) {
    return false;
  }

  if (!decoded || !decoded.exp) {
    return false;
  }

  const exp = new Date(decoded.exp * 1000);
  const now = new Date();

  return now < exp;
};

export const getJwt = () => {
  const jwt = Cookie.get('jwt');
  return jwt && isJwtValid(jwt) ? jwt : null;
};

export const hasJwt = () => !!getJwt();
