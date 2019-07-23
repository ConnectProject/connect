const util = require('util');
const exec = util.promisify(require('child_process').exec);

const listCollection = JSON.parse(process.argv[2]);

listCollection.forEach(async (collection) => {
    if (collection !== '_Session' && collection !== '_User') {
        const resultDump = await exec(`mongodump -d connect -c ${collection} --username connect --password connect`);
        console.log(`${collection}/resultDump:`, resultDump);
        const resutlRestore = await exec(`mongorestore -d connect-sandbox -c ${collection} dump/connect/${collection}.bson --username connect --password connect`);
        console.log(`${collection}/resutlRestore:`, resutlRestore);
    }

});
