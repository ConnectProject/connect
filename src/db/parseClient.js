const mongoose = require('mongoose');
const logger = require('./../logger');
const {
  MONGO_DB_NAME,
  MONGO_HOST,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
} = require('./../config');

mongoose.connect(
  `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
  { useNewUrlParser: true },
);

const db = mongoose.connection;

db.on('error', err => {
  logger(`mongo connect error : ${err}`);
});

db.once('open', () => {
  logger(`mongo connected on ${MONGO_DB_NAME}`);
});

module.exports = mongoose;
