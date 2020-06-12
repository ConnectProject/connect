/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const glob = require('glob');

const classes = [];

module.exports = function getClasses() {
  if (classes.length > 0) {
    return classes;
  }

  return new Promise((resolve, reject) => {
    glob(`${__dirname}/classes/**/*.js`, {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        for (const file of files) {
          classes.push(require(file));
        }
        resolve(classes);
      }
    });
  });
};
