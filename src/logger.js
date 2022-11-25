const winston = require('winston');
const flow = require('lodash.flow');

const { combine, timestamp, json } = winston.format;

const createFormatMessage = function (name) {
  /**
   * Format params to return an unique object that matches willing format
   * JSDoc not verified
   * @param {Object|String} params message parameters
   * @param {?String} message message to be formatted
   * @returns {Object} formatted message
   */
  const formatMessage = function formatMessage(params, message) {
    // INPUT
    if (params instanceof Error) {
      const err = {
        message: params.message,
        name: params.name,
        stack: params.stack,
      };

      return {
        message: message || err.message,
        err,
      };
    }

    if (typeof params === 'object') {
      if (params.err && params.err instanceof Error) {
        const err = {
          message: params.err.message,
          name: params.err.name,
          stack: params.err.stack,
        };

        return {
          name,
          ...params,
          message: message || params.message || err.message,
          err,
        };
      }

      if (message) {
        return { name, ...params, message };
      }

      return { name, ...params };
    }

    return { name, message: params };
  };

  return formatMessage;
};

/**
 * Adds a custom severity field to an object
 * @param {*} severity custom severity
 * @returns {Object} object with severity
 */
const addSeverity = function (severity) {
  return (params) => ({
    ...params,
    severity,
  });
};

/**
 * Create a new logger for the app named appName
 * @param {string} appName app name
 * @returns {Object} logger
 */
const createLogger = function (appName) {
  const systemLogger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: combine(timestamp(), json()),
  });

  return {
    info: flow([
      createFormatMessage(appName),
      addSeverity('INFO'),
      systemLogger.info.bind(systemLogger),
    ]),
    warn: flow([
      createFormatMessage(appName),
      addSeverity('WARNING'),
      systemLogger.warn.bind(systemLogger),
    ]),
    error: flow([
      createFormatMessage(appName),
      addSeverity('ERROR'),
      systemLogger.error.bind(systemLogger),
    ]),
  };
};

const connectServerLog = createLogger('connect');

module.exports = connectServerLog;
