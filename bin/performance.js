/* eslint-disable import/no-extraneous-dependencies */
/*
Script to monitor the I/O speed of an Application.
The output will be written in ../perf.csv
*/

const axios = require('axios');
const { performance } = require('perf_hooks');
const fs = require('fs');
const json2csv = require('json2csv');

// To be changed with the Application to Monitor
const APP_NAME = '7n3k8m-Test';
const APP_TOKEN = 'f81eda23-3bab-466e-89bb-627a96ba3991';

function getHeaderWithToken(sessionToken) {
  return {
    'x-parse-application-id': 'connect',
    'x-parse-session-token': sessionToken,
    'content-type': 'application/json',
  };
}

function writeToCSV(task, quantity, time) {
  const newLine = '\r\n';
  const fields = ['date', 'task', 'quantity', 'time'];
  const data = {
    date: new Date(),
    task,
    quantity,
    time,
  };

  fs.stat('perf.csv', (err) => {
    if (err === null) {
      // write the actual data and end with newline
      const csv = json2csv.parse(data, { header: false }) + newLine;

      fs.appendFile('perf.csv', csv, (errW) => {
        if (errW) throw errW;
      });
    } else {
      // write the headers and newline
      console.log('New file, just writing headers');
      const csv = json2csv.parse({}, { fields }) + newLine;

      fs.appendFile('perf.csv', csv, (errW) => {
        if (errW) throw errW;
        writeToCSV(task, quantity, time);
      });
    }
  });
}

async function createObjects(numberOfObject, sessionToken) {
  const t0 = performance.now();
  // eslint-disable-next-line no-unused-vars
  for (const _ of Array(numberOfObject).keys()) {
    // eslint-disable-next-line no-await-in-loop
    await axios.post(
      'http://127.0.0.1:1337/parse/classes/GameScore',
      {
        score: 1337,
        playerName: 'sample',
        cheatMode: false,
      },
      {
        headers: getHeaderWithToken(sessionToken),
      },
    );
  }
  const t1 = performance.now();
  console.log(
    `Creation of ${numberOfObject} objects took ${t1 - t0} milliseconds.`,
  );
  writeToCSV('POST /classes', numberOfObject, t1 - t0);
}

async function readObjects(numberOfObject, sessionToken) {
  const t0 = performance.now();
  // eslint-disable-next-line no-unused-vars
  for (const _ of Array(numberOfObject).keys()) {
    // eslint-disable-next-line no-await-in-loop
    await axios.get('http://127.0.0.1:1337/parse/classes/GameScore', {
      headers: getHeaderWithToken(sessionToken),
    });
  }
  const t1 = performance.now();
  console.log(
    `Reading of ${numberOfObject} bacthes took ${t1 - t0} milliseconds.`,
  );
  writeToCSV('GET /classes', numberOfObject, t1 - t0);
}

async function readObjectsWithCondition(numberOfObject, sessionToken) {
  const t0 = performance.now();
  // eslint-disable-next-line no-unused-vars
  for (const i of Array(numberOfObject).keys()) {
    // eslint-disable-next-line no-await-in-loop
    await axios.get('http://127.0.0.1:1337/parse/classes/GameScore', {
      params: {
        where: { playerName: 'sample', cheatMode: false },
        skip: i * 100,
      },
      headers: getHeaderWithToken(sessionToken),
    });
  }
  const t1 = performance.now();
  console.log(
    `Reading of ${numberOfObject} bacthes with condition took ${
      t1 - t0
    } milliseconds.`,
  );
  writeToCSV('GET /classes w/ condition', numberOfObject, t1 - t0);
}

async function checkAdd() {
  try {
    const response = await axios.get('http://127.0.0.1:1337/parse/login', {
      params: {
        password: APP_TOKEN,
        username: APP_NAME,
      },
      headers: {
        'x-parse-application-id': 'connect',
        'x-parse-revocable-session': '1',
      },
    });

    const { sessionToken } = response.data;

    await createObjects(100, sessionToken);
    await readObjects(100, sessionToken);
    await readObjectsWithCondition(100, sessionToken);
  } catch (error) {
    return console.error(error);
  }

  return 0;
}

checkAdd();
