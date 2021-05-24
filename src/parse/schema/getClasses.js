const glob = require('glob');
const path = require('path');
const fs = require('fs');

const swaggerTypeToParseType = function (element) {
  let parseType;
  switch (element.type) {
    case 'string':
      if (element.format === 'date-time') {
        parseType = 'Date';
      } else parseType = 'String';
      break;

    case 'number':
      parseType = 'Number';
      break;

    case 'boolean':
      parseType = 'Boolean';
      break;

    case 'array':
      parseType = 'Array';
      break;

    default:
      parseType = 'Object';
      break;
  }

  return parseType;
};

const getClass = function (file) {
  return new Promise((resolve, reject) => {
    const className = path.parse(file).base.replace(/.schema.json$/, '');
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const schema = JSON.parse(data);
        const parseClass = {
          className,
          fields: {},
        };
        for (const [key, element] of Object.entries(schema.properties)) {
          parseClass.fields[key] = { type: swaggerTypeToParseType(element) };
        }
        resolve(parseClass);
      }
    });
  });
};

var classes;

module.exports = function getClasses() {
  if (typeof classes !== 'undefined') {
    return classes;
  }

  return new Promise((resolve, reject) => {
    glob(`${__dirname}/classes/*.schema.json`, {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const promises = [];
        for (const file of files) {
          promises.push(getClass(file));
        }
        Promise.all(promises).then((result) => {
          classes = result;
          resolve(classes);
        });
      }
    });
  });
};
