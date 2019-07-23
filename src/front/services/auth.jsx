import * as Cookie from 'js-cookie';
import * as jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

const COOKIENAME = 'jwt-connect';
export const connectedState = new BehaviorSubject(false);

export const logout = () => {
  Cookie.remove(COOKIENAME);
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

export const setAuthToken = token => {
  if (!isJwtValid(token)) {
    connectedState.next(false);
    return false;
  }

  Cookie.set(COOKIENAME, token);
  connectedState.next(true);
  return true;
};

export const getJwt = () => {
  const jwt = Cookie.get(COOKIENAME);
  const valid = jwt && isJwtValid(jwt) ? jwt : null;
  connectedState.next(!!valid);
  return valid;
};

export const getUser = () => {
  const jwt = getJwt();
  try {
    const decoded = jwtDecode(jwt);
    return decoded;
  } catch (e) {
    return null;
  }
};

export const hasJwt = () => !!getJwt();

hasJwt();
