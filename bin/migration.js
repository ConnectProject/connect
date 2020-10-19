const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { MONGO_USERNAME, MONGO_PASSWORD } = require('../src/config');

const listCollection = JSON.parse(process.argv[2]);

/*
Will dump and restore each collection from connect to connect-sandbox
*/
listCollection.forEach(async (collection) => {
  if (collection !== '_Session' && collection !== '_User') {
    const resultDump = await exec(
      `mongodump -d connect -c ${collection} --username ${MONGO_USERNAME} --password ${MONGO_PASSWORD}`,
    );
    console.log(`${collection}/resultDump:`, resultDump);
    const resutlRestore = await exec(
      `mongorestore -d connect-sandbox -c ${collection} dump/connect/${collection}.bson --username ${MONGO_USERNAME} --password ${MONGO_PASSWORD}`,
    );
    console.log(`${collection}/resutlRestore:`, resutlRestore);
  }
});
