#!/bin/bash
source .env
DOCKER_ID=$(docker ps --filter="name=connect_mongo_1" -q )

docker cp ./bin/migration_mongo.js $DOCKER_ID:/migration_mongo.js
docker cp ./bin/migration.js $DOCKER_ID:/migration.js

docker exec $DOCKER_ID mongo --eval "var MONGO_HOST='$MONGO_HOST', MONGO_USERNAME='$MONGO_USERNAME', MONGO_PASSWORD='$MONGO_PASSWORD'" ./migration_mongo.js

docker exec $DOCKER_ID mongo --eval "var MONGO_HOST='$MONGO_HOST', MONGO_USERNAME='$MONGO_USERNAME', MONGO_PASSWORD='$MONGO_PASSWORD'" ./bin/migration_mongo.js
LIST_COLLECTIONS=$(docker exec $DOCKER_ID mongo connect --quiet --eval "printjson(db.getCollectionNames())" --username $MONGO_USERNAME --password $MONGO_PASSWORD)

echo $LIST_COLLECTIONS
node ./bin/migration.js "$LIST_COLLECTIONS"

echo "Clearing dump directory"
rm -rf ./dump
