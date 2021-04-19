const getClasses = require('../schema/getClasses');

module.exports = async (Parse) => {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.afterSave(schemaClass.className, (req) => {
      const jsonObject = req.object.toJSON();
      delete jsonObject.owner;
      delete jsonObject.ACL;

      // re-convert dates in JSON format
      for (const field of Object.keys(jsonObject)) {
        if (jsonObject[field].__type === 'Date') {
          jsonObject[field] = jsonObject[field].iso;
        }
      }

      return jsonObject;
    });
  }
};
