mongo -- "$MONGO_INITDB_PARSE_DATABASE" <<EOF
var user = '$MONGO_INITDB_ROOT_USERNAME';
var passwd = '$MONGO_INITDB_ROOT_PASSWORD';
var table = db.getSiblingDB('$MONGO_INITDB_PARSE_DATABASE');
table.auth(user, passwd); 
db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
EOF

mongo -- "$MONGO_INITDB_API_DATABASE" <<EOF
var user = '$MONGO_INITDB_ROOT_USERNAME';
var passwd = '$MONGO_INITDB_ROOT_PASSWORD';
var table = db.getSiblingDB('$MONGO_INITDB_API_DATABASE');
table.auth(user, passwd); 
db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
EOF

mongo -- "$MONGO_INITDB_SANDBOX_DATABASE" <<EOF
var user = '$MONGO_INITDB_ROOT_USERNAME';
var passwd = '$MONGO_INITDB_ROOT_PASSWORD';
var table = db.getSiblingDB('$MONGO_INITDB_SANDBOX_DATABASE');
table.auth(user, passwd); 
db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
EOF