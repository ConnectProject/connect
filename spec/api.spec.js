/* eslint-disable */
const axios = require('axios');
const { bindAll, getJwtToken } = require(`${SPEC_PATH}/helper`)

process.env.TEST_SUITE = 'api-server';

describe("api server", () => {
  bindAll()

  it("Create Application", async () => {
    const jwtToken = await getJwtToken();

    const response = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/application',
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'application/json' },
      data: {
        "name": "toto",
        "description": "truc",
        "apple_store_link": "https://apple.fr",
        "google_market_link": "https://google.fr"
      }
    });

    expect(response.data.name).toBe('toto');
    expect(response.data.description).toBe('truc');
    expect(response.data.apple_store_link).toBe('https://apple.fr');
    expect(response.data.google_market_link).toBe('https://google.fr');
    expect(response.data.token).toBeDefined();
    expect(response.data.parse_name).toBeDefined();
  })

  it("List Application", async () => {
    const jwtToken = await getJwtToken();

    const response = await axios({
      method: 'get',
      url: 'http://localhost:3000/api/application',
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'application/json' }
    });

    expect(response.data.length).toBe(1);
    expect(response.data[0].name).toBe('toto');
  })

  it("Get Application", async () => {
    const jwtToken = await getJwtToken();

    const listResponse = await axios({
      method: 'get',
      url: 'http://localhost:3000/api/application',
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'application/json' }
    });

    const getResponse = await axios({
      method: 'get',
      url: `http://localhost:3000/api/application/${listResponse.data[0]._id}`,
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'application/json' }
    });

    expect(getResponse.data.name).toBe('toto');
  })

  it("Update Application", async () => {
    const jwtToken = await getJwtToken();

    const response = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/application',
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'application/json' },
      data: {
        "name": "toto-u",
        "description": "truc-u",
        "apple_store_link": "https://apple-u.fr",
        "google_market_link": "https://google-u.fr"
      }
    });

    expect(response.data.name).toBe('toto-u');
    expect(response.data.description).toBe('truc-u');
    expect(response.data.apple_store_link).toBe('https://apple-u.fr');
    expect(response.data.google_market_link).toBe('https://google-u.fr');
  })
})
