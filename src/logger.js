const winston = require('winston');
const flow = require('lodash.flow');
const debug = require('debug');
const { DEBUG } = require('./config');

const { combine, timestamp, json } = winston.format;

function createFormatMessage(name) {
  /**
   * Format params to return an unique object that matches willing format
   * @param {Object|String} params
   * @param {?String} message
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
}

/**
 * Adds a custom severity field to an object
 * @param {*} severity
 */
function addSeverity(severity) {
  return params => ({
    ...params,
    severity,
  });
}

function createDebugLogger(appName) {
  if (!appName) {
    throw new Error('Missing mandatory parameters appName');
  }

  return {
    info: debug(`${appName}::info`),
    warn: debug(`${appName}::warn`),
    error: debug(`${appName}::error`),
  };
}

/**
 * Create a new logger for the app named appName
 * @param {string} appName
 * @returns {Object} logger
 */
function createLogger(appName) {
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
}

const connectServerLog =
  DEBUG === true ? createDebugLogger('connect') : createLogger('connect');

module.exports = connectServerLog;
