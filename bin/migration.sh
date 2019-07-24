#!/bin/bash
source .env
mongo --eval "var MONGO_HOST='$MONGO_HOST', MONGO_USERNAME='$MONGO_USERNAME', MONGO_PASSWORD='$MONGO_PASSWORD'" ./bin/migration_mongo.js
LIST_COLLECTIONS=$(mongo connect --quiet --eval "printjson(db.getCollectionNames())" --username $MONGO_USERNAME --password $MONGO_PASSWORD)

echo $LIST_COLLECTIONS
node ./bin/migration.js "$LIST_COLLECTIONS"

echo "Clearing dump directory"
rm -rf ./dump
