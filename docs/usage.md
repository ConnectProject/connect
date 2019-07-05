# Usage Documentations

​ This documentations is write in purpose to explain who to use the connect application and who to contribute.

## Lexique

​ User : It's the developer how want to consume the connect api

​ CRI : It's the organisme how manage the connect api and controle who it run and evolve.

## Api usage

This part of the documentation will explain who to consume the connect api.

### Authentification

### Get object

### Create object

### Update object

### Delete object

## Schema Contribute

The schema is a database model that will be use by everyone to get and set object.
Any User can contribute to the schema using Pull Request system. The CRI will accept or refuse the Pull Request after review of it.

When a Pull Request is accepted, the change (add or update) will be apply at the next deployment of the connect api (except for some specific change).

### Add a new Class

A schema is the group of classes. A class is compose of a name, a list of field and a permission.

You can create a Pull Request with for title `[Schema][New] ClassName`.
Write your schema file on `src/parse/schema` folder with name `YOUR_CLASS_NAME.js`. A schema file should look like that :

```javascript
module.exports = {
  className: YOUR_CLASS_NAME,
  fields: {
    name: { type: 'String' },
    activationDate: { type: 'Date' },
    isActive: { type: 'Boolean' },
    owner: { type: 'Pointer', targetClass: '_User' },
  },
  classLevelPermissions: {
    find: { '*': true },
    get: { '*': true },
    create: { '*': true },
    update: { '*': true },
    delete: { '*': true },
    addField: {},
    protectedFields: { '*': [] },
  },
};
```

Add your file to the schema class list on `src/parse/schema/index.js` to make the synch system aknowledge of it's presence :

```javascript
module.exports = [require('./sample'), require('./YOUR_CLASS_NAME')];
```

### Update an existing Class

#### Add new field

Like for the creation you can do a Pull Request with title `[Schema][Add-Field] ClassName`.

You can only add new field. For that edit the schema of the class and add the field you want.

#### Change field type

Same as before do a Pull Request with title `[Schema][Type-Field] ClassName`.

**The system will not do the update automatically.** Only the CRI can do the manipulation because it mean to delete the field data include and recreate the field with the new type. This update have a risk to loose data and should be avoid.

#### Remove field

Same as before do a Pull Request with title `[Schema][Delete-Field] ClassName`.

**The system will not do the update automatically.** Only the CRI can do the manipulation because it mean to delete the field and data associet to it. This update have a risk to loose data for other contributor and should be avoid.
