const getClasses = require('../schema/getClasses');

module.exports = async (Parse) => {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.afterFind(schemaClass.className, (req) => {
      if (req.master) {
        return;
      }

      const objects = [];

      for (const object of req.objects) {
        const newObject = object.toJSON();
        delete newObject.ACL;
        delete newObject.owner;

        // re-convert dates in JSON format
        for (const field of Object.keys(newObject)) {
          if (newObject[field].__type === 'Date') {
            newObject[field] = newObject[field].iso;
          }
        }

        objects.push({ toJSON: () => newObject });
      }

      req.objects = objects;
    });
  }
};
