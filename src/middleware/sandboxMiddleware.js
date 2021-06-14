/* eslint-disable max-statements */

const changeUrl = (req, toReplace, replacement) => {
  req.url = req.url.replace(toReplace, replacement);
  req.originalUrl = req.originalUrl.replace(toReplace, replacement);
  req.path = req.path.replace(toReplace, replacement);
};

const transformPathForSandbox = (originalPath) => {
  const regexpResult = originalPath.match(/\/parse\/classes\/([a-zA-Z_]+)/);
  if (regexpResult.length > 1) {
    return '/parse/classes/Sandbox_' + regexpResult[1];
  }
};

module.exports = (req, res, next) => {
  if (req.headers['x-is-sandbox'] === 'true') {
    const matchClass = req.originalUrl.match(/\/parse\/classes\/([a-zA-Z_]+)/);
    if (matchClass.length > 1) {
      const className = matchClass[1];
      if (!className.startsWith('Sandbox_')) {
        changeUrl(req, className, `Sandbox_${className}`);
      }

      return next();
    }
    if (
      req.method === 'POST' &&
      req.originalUrl.startsWith('/parse/batch') &&
      req.body &&
      Array.isArray(req.body.requests)
    ) {
      req.body.requests = req.body.requests.map((elt) => ({
        ...elt,
        path: transformPathForSandbox(elt.path) || elt.path,
      }));
    }
  }

  return next();
};
