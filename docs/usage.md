# Usage Documentations

 This documentations is write in purpose to explain how to use the connect application and how to contribute.

## Sommaire

- [Api usage](#api-usage)
  - [Authentification](#authentification)
  - [Get object](#get-object)
  - [Create object](#create-object)
  - [Update object](#update-object)
  - [Delete object](#delete-object)
  - [Batch operations](#batch-operations)
- [Schema Contribute](#schema-contribute)
  - [Add a new Class](#add-class)
  - [Update an existing Class](#update-class)
    - [Add new field](#add-field)
    - [Change field type](#update-field-type)
    - [Remove field](#remove-field)

## Lexique

 User : It's the developer who want to consume the connect api

 CRI : It's the organisation who manage the "connect" api and manage how it run and evolve.

## <a name="api-usage">Api usage</a>

This part of the documentation will explain how to consume the connect api.
A swagger documentation to explain each accessible endpoint can be found at `/swagger`.

Any request you do should have the following header : `x-parse-application-id: connect`
And for any authentified endpoint add the header : `x-parse-session-token: r:xxxxxx` (see [Authentification](#authentification) section to get the sessionToken).

### <a name="authentification">Authentification</a>

In order to manipulate the connect api you need to identify each of your request with a `sessionToken`.

To get the sessionToken call `/parse/login` with you APP_TOKEN and APP_NAME like this :

```bash
curl --request GET \
  --url 'https://www.connect.com/parse/login?password=APP_TOKEN&username=APP_NAME&=' \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-revocable-session: 1'
  
Reponse : {
  "objectId": "xxxxx",
  "username": "j93mt7-xxxx",
  "createdAt": "2019-07-12T15:08:56.813Z",
  "updatedAt": "2019-07-12T15:08:57.120Z",
  "ACL": {
    "xxxx": {
      "read": true
    }
  },
  "sessionToken": "r:b003aae18ee536c94aeb07562a4af8e2"
}
```

### <a name="get-object">Get object</a>

You can retrieve a specific object using the GET endpoint `/parse/classes/:OBJECTNAME/:OBJECTID` :

```bash
curl --request GET \
  --url https://www.connect.com/parse/classes/GameScore/DFwP7JXoa0 \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2'
  
Response :
{
  "score": 1338,
  "playerName": "sample",
  "cheatMode": false,
  "createdAt": "2019-07-15T14:06:53.659Z",
  "updatedAt": "2019-07-15T15:04:42.884Z",
  "objectId": "DFwP7JXoa0"
}
```

To retrieve a list of an object you can directly call the GET endpoint `/parse/classes/:OBJECTNAME` :

```bash
curl --request GET \
  --url https://www.connect.com/parse/classes/GameScore \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2'
  
Response :
{
  "results": [
    {
      "score": 9999,
      "playerName": "top1",
      "cheatMode": true,
      "createdAt": "2019-07-14T15:14:30.680Z",
      "updatedAt": "2019-07-14T15:14:30.680Z",
      "objectId": "sfevQqRbHn"
    },
    {
      "score": 1338,
      "playerName": "sample",
      "cheatMode": false,
      "createdAt": "2019-07-15T14:06:53.659Z",
      "updatedAt": "2019-07-15T15:04:42.884Z",
      "objectId": "DFwP7JXoa0"
    },
    ...
  ]
}
```

There are several ways to put constraints on the objects found, using the `where` URL parameter. The value of the `where` parameter should be encoded JSON. Thus, if you look at the actual URL requested, it would be JSON-encoded, then URL-encoded. The simplest use of the `where` parameter is constraining the value for keys. For example, if we wanted to retrieve Sean Plott's scores that were not in cheat mode, we could do:

```bash
curl --request GET \
  --url https://www.connect.com/parse/classes/GameScore \
  --header "X-Parse-Application-Id: connect" \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2'
  --get \
  --data-urlencode 'where={"playerName":"Sean Plott","cheatMode":false}'
```

The values of the `where` parameter also support comparisons besides exact matching. Instead of an exact value, provide a hash with keys corresponding to the comparisons to do. The `where` parameter supports these options:

| Key         | Operation                        |
|------------------------------------------------|
| $lt         | Less Than                        |
| $lte        | Less Than Or Equal To            |
| $gt         | Greater Than                     |
| $gte        | Greater Than Or Equal To         |
| $ne         | Not Equal To                     |
| $in         | Contained In                     |
| $nin        | Not Contained in                 |
| $exists     | A value is set for the key       |
| $select     | This matches a value for a key in the result of a different query |
| $dontSelect | Requires that a key's value not match a value for a key in the result of a different query |
| $all        | Contains all of the given values |
| $regex      | Requires that a key's value match a regular expression |
| $text       | Performs a full text search on indexed fields |

In addition to `where`, there are several parameters you can use to configure what types of results are returned by the query.

| Parameter   | Use                                               |
|-----------------------------------------------------------------|-----------------------------------------------------------------|
| order       | Specify a field to sort by                        |
| limit       | Limit the number of objects returned by the query (it can't be above 100 items) |
| skip        | Use with limit to paginate through results        |
| keys        | Restrict the fields returned by the query         |
| include     | Use on Pointer columns to return the full object  |

You can use the `order` parameter to specify a field to sort by. Prefixing with a negative sign reverses the order. Thus, to retrieve scores in ascending order:

```bash
curl --request GET \
  --url https://www.connect.com/parse/classes/GameScore \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2' \
  --get \
  --data-urlencode 'order=score'
```

If you are limiting your query, or if there are a very large number of results, and you want to know how many total results there are without returning them all, you can use the `count` parameter. For example, if you only care about the number of games played by a particular player:

```bash
curl --request GET \
  --url https://www.connect.com/parse/classes/GameScore \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2' \
  --get \
  --data-urlencode 'where={"playerName":"Jonathan Walsh"}' \
  --data-urlencode 'count=1' \
  --data-urlencode 'limit=0'
  
Response:
{
  "results": [],
  "count": 1337
}
```

Since this requests a count as well as limiting to zero results, there will be a count but no results in the response. With a nonzero limit, that request would return results as well as the count.

### <a name="create-object">Create object</a>

To create new object send a POST request to the endpoint `/parse/classes/:OBJECTNAME` :

```bash
curl --request POST \
  --url https://www.connect.com/parse/classes/GameScore \
  --header 'content-type: application/json' \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2' \
  --data '{
	"score":1337,
	"playerName":"sample",
	"cheatMode":false
}'

Response :
{
  "score": 1337,
  "playerName": "sample",
  "cheatMode": false,
  "createdAt": "2019-07-15T14:06:53.659Z",
  "updatedAt": "2019-07-15T14:06:53.659Z",
  "objectId": "DFwP7JXoa0"
}
```

### <a name="update-object">Update object</a>

To update an object send a PUT request to the endpoint `/parse/classes/:OBJECTNAME/:OBJECTID` :

```bash
curl --request PUT \
  --url https://www.connect.com/parse/classes/GameScore/DFwP7JXoa0 \
  --header 'content-type: application/json' \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2' \
  --data '{
	"score":1338,
	"playerName":"sample",
	"cheatMode":false
}'

Response :
{
  "score": 1338,
  "playerName": "sample",
  "cheatMode": false,
  "createdAt": "2019-07-15T14:06:53.659Z",
  "updatedAt": "2019-07-15T15:04:42.884Z",
  "objectId": "DFwP7JXoa0"
}
```

⚠️ **Only the owner of the data can update an object. If you did not create this object you will have an error message** ⚠️

### <a name="delete-object">Delete object</a>

To delete an object send a DELETE request to the endpoint `/parse/classes/:OBJECTNAME/:OBJECTID` :

```bash
curl --request DELETE \
  --url https://www.connect.com/parse/classes/GameScore/DFwP7JXoa0 \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2'

Response:
{}
```

⚠️ **Like for update, only the owner of the data can delete an object. If you did not create this object you will have an error message** ⚠️

### <a name="batch-operations">Batch Operations</a>

To reduce the amount of time spent on network round trips, you can create, update, or delete up to 50 objects in one call, using the batch endpoint.

Each command in a batch has `method`, `path`, and `body` parameters that specify the HTTP command that would normally be used for that command. The commands are run in the order they are given.

```bash
curl --request POST \
  --url https://www.connect.com/parse/batch \
  --header 'content-type: application/json' \
  --header 'x-parse-application-id: connect' \
  --header 'x-parse-session-token: r:b003aae18ee536c94aeb07562a4af8e2' \
  --data '{
	"requests": [
		{
			"method": "POST",
			"path": "/parse/classes/GameScore",
			"body": {
				"score": 1337,
				"playerName": "Sean Plott"
			}
		},
		{
			"method": "PUT",
			"path": "/parse/classes/GameScore/JhKvT9HrWJ",
			"body": {
				"score": 1337,
				"playerName": "Sean Plott 2"
			}
		},
		{
			"method": "DELETE",
			"path": "/parse/classes/GameScore/RAdL53JiZV",
			"body": {}
		},
		{
			"method": "GET",
			"path": "/parse/classes/GameScore/JhKvT9HrWJ",
			"body": {}
		},
		{
			"method": "GET",
			"path": "/parse/classes/GameScore",
			"body": {}
		}
	]
}'
```

The response from batch will be a list with the same number of elements as the input list. Each item in the list with be a dictionary with either the `success` or `error` field set. The value of `success` will be the normal response to the equivalent REST command. The value of `error` will be an object with a numeric `code` and `error` string.

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
