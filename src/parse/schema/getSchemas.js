
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import glob from 'glob-promise';

let schemas;

export default async function getSchemas() {
  if (typeof schemas !== 'undefined') {
    return schemas;
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const files = await glob(`${__dirname}/classes/*.schema.json`);

  const promises = [];
  for (const file of files) {
    promises.push(new Promise((resolve, reject) => {
      const className = path.parse(file).base.replace(/.schema.json$/, '');
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const schema = JSON.parse(data);
          resolve({
            className,
            schema
          });
        }
      });
    }));
  }

  schemas = await Promise.all(promises);

  return schemas;
}
