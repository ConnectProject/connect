/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

conn = new Mongo(MONGO_HOST);

dbSandbox = conn.getDB('connect-sandbox');
dbSandbox.auth(MONGO_USERNAME, MONGO_PASSWORD);
dbSandbox.getCollection('_Role').drop();
dbSandbox.getCollection('_SCHEMA').drop();
print("\nDelete previous collections")

dbSandbox.logout();
