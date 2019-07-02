const { APP_PORT } = require('./config');
const express = require('express');
const parseApi = require('./middleware/parse');
const parseDashboard = require('./middleware/parseDashboard');
const path = require('path');
const api = require('./api');

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// Serve the Parse API at /parse URL prefix
app.use('/parse', parseApi);
app.use('/dashboard', parseDashboard);

// handle all routing for /api/*
api(app);

// Serve any static files
app.use(express.static(path.join(__dirname, './front/build')));

// Handle React routing, return all requests to React app
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, './front/build', 'index.html'));
});

const port = APP_PORT || 1337;

app.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});
