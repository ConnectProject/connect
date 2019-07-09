# Usage Documentations

​ This documentations is write in purpose to explain how to use the connect application and how to contribute.

## Sommaire

- [Api usage](#api-usage)
  - [Authentification](#authentification)
  - [Get object](#get-object)
  - [Create object](#create-object)
  - [Update object](#update-object)
  - [Delete object](#delete-object)
- [Schema Contribute](#schema-contribute)
  - [Add a new Class](#add-class)
  - [Update an existing Class](#update-class)
    - [Add new field](#add-field)
    - [Change field type](#update-field-type)
    - [Remove field](#remove-field)

## Lexique

​ User : It's the developer who want to consume the connect api

​ CRI : It's the organisation who manage the "connect" api and manage how it run and evolve.

## <a name="api-usage">Api usage</a>

This part of the documentation will explain how to consume the connect api.
A swagger documentation to explain each accessible endpoint can be found at `/swagger`.

### <a name="authentification">Authentification</a>

### <a name="get-object">Get object</a>

### <a name="create-object">Create object</a>

### <a name="update-object">Update object</a>

### <a name="delete-object">Delete object</a>

## <a name="schema-contribute">Schema Contribute</a>

The schema is a database model that will be use by everyone to get and set object.
Any User can contribute to the schema using Pull Request system. The CRI will accept or refuse the Pull Request after review of it.

When a Pull Request is accepted, the change (add or update) will be apply at the next deployment of the connect api (except for some specific change).

### <a name="add-class">Add a new Class</a>

A schema is a group of classes. A class have a name, a list of fields and some permissions.

You can create a Pull Request with for title `[Schema][New] ClassName`.
Write your schema file on `src/parse/schema/classes` folder with name `YOUR_CLASS_NAME.js`. A schema file should look like that :

```javascript
module.exports = {
  className: YOUR_CLASS_NAME,
  fields: {
    aNumber: { type: 'Number' },
    aString: { type: 'String' },
    aBool: { type: 'Boolean' },
    aDate: { type: 'Date' },
    aObject: { type: 'Object' },
    aArray: { type: 'Array' },
    aGeoPoint: { type: 'GeoPoint' },
    aPolygon: { type: 'Polygon' },
    aFile: { type: 'File' },
  },
};
```

### <a name="update-class">Update an existing Class</a>

#### <a name="add-field">Add new field</a>

Like for the creation you can do a Pull Request with title `[Schema][Add-Field] ClassName`.

You can only add new field. For that edit the schema of the class and add the field you want.

#### <a name="update-field-type">Change field type</a>

Same as before do a Pull Request with title `[Schema][Type-Field] ClassName`.

**The system will not do the update automatically.** Only the CRI can do the manipulation because it mean to delete the field data include and recreate the field with the new type. This update have a risk to loose data and should be avoid.

#### <a name="remove-field">Remove field</a>

Same as before do a Pull Request with title `[Schema][Delete-Field] ClassName`.

**The system will not do the update automatically.** Only the CRI can do the manipulation because it mean to delete the field and data associet to it. This update have a risk to loose data for other contributor and should be avoid.
