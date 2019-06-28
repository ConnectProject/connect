const { APP_PORT } = require('./config');
const express = require('express');
const parseApi = require('./middleware/parse');
const parseDashboard = require('./middleware/parseDashboard');

const app = express();

// Serve the Parse API at /parse URL prefix
app.use('/parse', parseApi);
app.use('/dashboard', parseDashboard);

const port = APP_PORT || 1337;

app.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});
