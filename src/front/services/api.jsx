import { getJwt } from './auth';


export const listOfApplications = async () => {
    const jwt = getJwt();
    if (!jwt) {
        return [];
    }

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
    if (!jwt) {
        return {};
    }

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
    if (!jwt) {
        return {};
    }

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