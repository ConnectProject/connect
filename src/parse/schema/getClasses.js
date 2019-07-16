const glob = require('glob');

module.exports = function getClasses() {
  return new Promise(function(resolve, reject) {
    glob(__dirname + '/classes/**/*.js', {}, function(err, files) {
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
