const express = require('express');
const cors = require('cors');

const logger = require('./logger');
const { SANDBOX_PORT } = require('./config');
const parseSandbox = require('./middleware/parseSandbox');

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Serve the Parse API at /parse URL prefix
app.use('/parse-sandbox', parseSandbox);

app.listen(SANDBOX_PORT, () => {
  logger(`connect sandbox running on port ${SANDBOX_PORT}.`);
});
