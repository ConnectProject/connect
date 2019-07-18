const getClasses = require('./../schema/getClasses');

module.exports = async function(Parse) {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.afterFind(schemaClass.className, function(req) {
      if (req.master) {
        return;
      }

      const objects = [];

      for (const object of req.objects) {
        const newObject = object.toJSON();
        delete newObject.ACL;
        delete newObject.owner;

        objects.push({ toJSON: () => newObject });
      }

      req.objects = objects;
    });
  }
};
