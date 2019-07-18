/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const glob = require('glob');

module.exports = function getClasses() {
  return new Promise((resolve, reject) => {
    glob(`${__dirname}/classes/**/*.js`, {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const classes = [];
        for (const file of files) {
          classes.push(require(file));
        }
        resolve(classes);
      }
    });
  });
};
