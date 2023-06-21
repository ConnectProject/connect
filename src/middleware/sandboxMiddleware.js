import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const changeUrl = (req, toReplace, replacement) => {
  req.url = req.url.replace(toReplace, replacement);
  // req.originalUrl = req.originalUrl.replace(toReplace, replacement);
  // req.path = req.path.replace(toReplace, replacement);
};

const transformPathForSandbox = (originalPath) => {
  const regexpResult = originalPath.match(/\/parse\/classes\/([a-zA-Z_]+)/);
  if (regexpResult.length > 1) {
    const className = regexpResult[1];
    if (!className.startsWith('Sandbox_')) {
      return '/parse/classes/Sandbox_' + className;
    }
  }
};

export default (req, res, next) => {
  if (req.headers['x-is-sandbox'] === 'true') {
    const matchClass = req.originalUrl.match(/\/parse\/classes\/([a-zA-Z_]+)/);
    if (matchClass && matchClass.length > 1) {
      const className = matchClass[1];
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      if (!className.startsWith('Sandbox_')) {
        fs.access(
          `${__dirname}/../parse/schema/classes/${className}.schema.json`,
          fs.constants.F_OK,
          (err) => {
            if (!err) {
              changeUrl(req, className, `Sandbox_${className}`);
            }

            return next();
          },
        );

        return;
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
