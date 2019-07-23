#!/bin/bash
source .env
mongo --eval "var MONGO_HOST='$MONGO_HOST', MONGO_USERNAME='$MONGO_USERNAME', MONGO_PASSWORD='$MONGO_PASSWORD'" ./bin/migration.js 
 
mongodump -d connect -c _Role --username $MONGO_USERNAME --password $MONGO_PASSWORD
mongorestore -d connect-sandbox -c _Role dump/connect/_Role.bson --username $MONGO_USERNAME --password $MONGO_PASSWORD

mongodump -d connect -c _SCHEMA --username $MONGO_USERNAME --password $MONGO_PASSWORD
mongorestore -d connect-sandbox -c _SCHEMA dump/connect/_SCHEMA.bson --username $MONGO_USERNAME --password $MONGO_PASSWORD

rm -rf ./dump
echo "Clearing dump directory"