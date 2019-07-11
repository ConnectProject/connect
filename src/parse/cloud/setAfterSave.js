const getClasses = require('./../schema/getClasses');

module.exports = async function(Parse) {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.afterSave(schemaClass.className, function(req) {
      const jsonObject = req.object.toJSON();
      delete jsonObject.owner;
      delete jsonObject.ACL;

      req.object = {
        toJSON: () => jsonObject,
        equals: () => false,
      };

      return req.object;
    });
  }
};
