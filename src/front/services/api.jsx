import { getJwt, logout } from './auth';


const headersWithJWT = () => {
  const jwt = getJwt();
  if (!jwt) { return null; }
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt}`
  };
}


export const listOfApplications = async () => {
  const headers = headersWithJWT();
  if (!headers) { return []; }

  const responses = await fetch(`${process.env.API_URL}/api/application`, {
    headers,
    method: 'GET',
  });
  return responses.json();
}


export const getApplication = async (appId) => {
  const headers = headersWithJWT();
  if (!headers) { return {}; }

  const responses = await fetch(`${process.env.API_URL}/api/application/${appId}`, {
    headers,
    method: 'GET',
  });
  return responses.json();
}


export const createApplication = async (newApplication) => {
  const headers = headersWithJWT();
  if (!headers) { return {}; }

  const responses = await fetch(`${process.env.API_URL}/api/application`, {
    headers,
    method: 'POST',
    body: JSON.stringify(newApplication)
  });

  return responses.json();
}

export const updateApplication = async (appId, application) => {
  const headers = headersWithJWT();
  if (!headers) { return {}; }

  const responses = await fetch(`${process.env.API_URL}/api/application/${appId}`, {
    headers,
    method: 'PUT',
    body: JSON.stringify(application)
  });

  return responses.json();
}

export const deleteUser = async () => {
  const headers = headersWithJWT();
  if (!headers) { return {}; }

  const responses = await fetch(`${process.env.API_URL}/api/developer`, {
    headers,
    method: 'DELETE',
  });

  logout();
  return responses.json();
}

export const getUser = async () => {
  const headers = headersWithJWT();
  if (!headers) { return {}; }

  // const responses = await fetch(`${process.env.API_URL}/api/application/${appId}`, {
  //     headers,
  //     method: 'GET',
  // });
  // return responses.json();

  return {
    lastName: 'Bernos',
    firstName: 'Guillaume',
    email: 'guillaume.bernos@matters.tech',
  }
}

export const updateUser = async () => {
  const headers = headersWithJWT();
  if (!headers) { return {}; }

  // const responses = await fetch(`${process.env.API_URL}/api/application/${appId}`, {
  //     headers,
  //     method: 'GET',
  // });
  // return responses.json();

  // TODO: WAITING FOR BACKEND

  return {
    lastName: 'Bernos',
    firstName: 'Guillaume',
    email: 'guillaume.bernos@matters.tech',
  }
}

