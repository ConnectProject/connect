/* eslint-disable */

/*
This file is directly executed by MongoDB and drops the previous tables of connect-sandbox.
*/

conn = new Mongo(MONGO_HOST);

dbSandbox = conn.getDB('connect-sandbox');
dbSandbox.auth(MONGO_USERNAME, MONGO_PASSWORD);
dbSandbox.getCollectionNames().forEach((collection) => {
  if (collection !== '_Session' && collection !== '_User') {
    dbSandbox.getCollection(collection).drop();
  }
});

print('\nDelete previous collections');

dbSandbox.logout();
