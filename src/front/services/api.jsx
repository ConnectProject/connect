import { getJwt, logout } from './auth';


export const listOfApplications = async () => {
    const jwt = getJwt();
    if (!jwt) { return []; }

    const responses = await fetch(`${process.env.API_URL}/api/application`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        method: 'GET',
    });
    return responses.json();
}


export const getApplication = async (appId) => {
    const jwt = getJwt();
    if (!jwt) { return {}; }

    const responses = await fetch(`${process.env.API_URL}/api/application/${appId}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        method: 'GET',
    });
    return responses.json();
}


export const createApplication = async(newApplication) => {
    const jwt = getJwt();
    if (!jwt) { return {}; }

    const responses = await fetch(`${process.env.API_URL}/api/application`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        method: 'POST',
        body: JSON.stringify(newApplication)
    });

    return responses.json();
}

export const updateApplication = async(appId, application) => {
    const jwt = getJwt();
    if (!jwt) { return {}; }

    const responses = await fetch(`${process.env.API_URL}/api/application/${appId}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        method: 'PUT',
        body: JSON.stringify(application)
    });

    return responses.json();
}

export const deleteUser = async() => {
    const jwt = getJwt();
    if (!jwt) { return {}; }

    const responses = await fetch(`${process.env.API_URL}/api/developer`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        method: 'DELETE',
    });

    logout();
    return responses.json();
}