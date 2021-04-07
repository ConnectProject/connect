/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const glob = require('glob');
const path = require('path');
const fs = require('fs');

function swaggerTypeToParseType(element) {
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
}

const classes = [];

module.exports = function getClasses() {
  if (classes.length > 0) {
    return classes;
  }

  return new Promise((resolve, reject) => {
    glob(`${__dirname}/classes/*.schema.json`, {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        for (const file of files) {
          const className = path.parse(file).base.replace(/.schema.json$/, '');
          const schema = JSON.parse(fs.readFileSync(file));
          const parseClass = {
            className,
            fields: {},
          };
          for (const [key, element] of Object.entries(schema.properties)) {
            parseClass.fields[key] = { type: swaggerTypeToParseType(element) };
          }
          classes.push(parseClass);
        }
        resolve(classes);
      }
    });
  });
};
