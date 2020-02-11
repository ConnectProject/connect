import { getJwt, logout } from './auth';

/*
Returns the headers used for any request.
*/
const headersWithJWT = () => {
  const jwt = getJwt();
  if (!jwt) {
    return null;
  }
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
  };
};

/*
Returns the list of applications created by the user
*/
export const listOfApplications = async () => {
  const headers = headersWithJWT();
  if (!headers) {
    return [];
  }

  const responses = await fetch(`${window._env_.API_URL}/api/application`, {
    headers,
    method: 'GET',
  });
  return responses.json();
};

/*
Returns details of one application
*/
export const getApplication = async appId => {
  const headers = headersWithJWT();
  if (!headers) {
    return {};
  }

  const responses = await fetch(
    `${window._env_.API_URL}/api/application/${appId}`,
    {
      headers,
      method: 'GET',
    },
  );
  return responses.json();
};

/*
Create a new application on the connected user
*/
export const createApplication = async newApplication => {
  const headers = headersWithJWT();
  if (!headers) {
    return {};
  }

  const responses = await fetch(`${window._env_.API_URL}/api/application`, {
    headers,
    method: 'POST',
    body: JSON.stringify(newApplication),
  });

  return responses.json();
};

/*
Update the application
*/
export const updateApplication = async (appId, application) => {
  const headers = headersWithJWT();
  if (!headers) {
    return {};
  }

  const responses = await fetch(
    `${window._env_.API_URL}/api/application/${appId}`,
    {
      headers,
      method: 'PUT',
      body: JSON.stringify(application),
    },
  );

  return responses.json();
};

/*
Delete an user profile and all the associated applications
*/
export const deleteUser = async () => {
  const headers = headersWithJWT();
  if (!headers) {
    return {};
  }

  const responses = await fetch(`${window._env_.API_URL}/api/developer`, {
    headers,
    method: 'DELETE',
  });

  logout();
  return responses.json();
};
