# Usage Documentation

This documentation is written to explain how to use the connect application and how to contribute.

## Table of content

- [Glossary](#glossary)
- [Table of content](#table-of-content)
- [Api usage](#api-usage)
  - [Session token Authentication](#authentication)
  - [OAuth Authentication](#oauth-authentication)
    - [OAuth Authentication Implementation](#oauth-authentication-implementation)
    - [Refreshing OAuth token](#oauth-authentication-refresh)
    - [OAuth Access token usage](#oauth-authentication-usage)
  - [Create object](#create-object)
  - [Update object](#update-object)
  - [Delete object](#delete-object)
  - [Get object](#get-object)
  - [Batch Operations](#batch-operations)
  - [Sandbox](#sandbox)
- [Schema Contribute](#schema-contribute)
  - [Add a new Class](#add-class)
  - [Update an existing Class](#update-class)
    - [Add new field](#add-field)
    - [Change field type](#update-field-type)
    - [Remove field](#remove-field)

## Glossary

User : The end user using an app created by a developer

Developer : It's the developer who want to consume the connect api

Application : An application developed by a developer, used by users

CRI : It's the organisation who manage the "connect" api and manage how it run and evolve.

## <a name="api-usage">Api usage</a>

This part of the documentation will explain how to consume the connect api.
A swagger documentation to explain each accessible endpoint can be found at `/swagger`.

Any request you do should have the following header : `x-parse-application-id: connect`

You can set bash variables like this:

```bash
CONNECT_URL=https://connect-project.io
PARSE_APPLICATION=connect
```

There is two way of authenticating against the API, depending on the request you want to perform:

- `Session Token`: available for any user with a Connect account
- `OAuth Token`: available for developers who have implemented the Connect OAuth flow in their app (and therefore have an access token for their users)

| Endpoint                        | Session Token | OAuth Token |
| ------------------------------- | :-----------: | :---------: |
| GET /classes/ClassName          |      ✅       |     ✅      |
| GET /classes/ClassName/objectId |      ✅       |     ✅      |
| POST /classes/ClassName         |      ❌       |     ✅      |
| PUT /classes/ClassName/objectId |      ❌       |     ✅      |

### <a name="authentication">Session token Authentication</a>

If you simply want to access data in a read only mode, you can use your personal access token that is presented to you from your Connect profile page. Copy the token and set it in a bash variable.

Then use it in header for all the "GET" methods, for example:

```bash
SESSION_TOKEN=r:xxxxxx
curl --request GET \
  --url $CONNECT_URL/parse/classes/GameScore \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  --header 'x-parse-session-token: '$SESSION_TOKEN
```

See [Get object](#get-object) for a list of all methods and example response.

### <a name="oauth-authentication">OAuth Authentication</a>

In order to send items (i.e. create or update objects in classes), you need to authenticate each of your users with the Connect OAuth Flow, so you can send items "in their name". The Connect OAuth flow follow standard OAuth best practice, and works like a "connect with Facebook" or "login with Github" flow you probably already encountered somewhere.

#### <a name="oauth-authentication-implementation">OAuth Authentication Implementation</a>

- First, create or login to a Connect account, and then from the dashboard create an Application
- Once your application is created, you'll obtain two keys:
  - a `publicKey`, which is used in your app to initiate the OAuth flow
  - a `secretKey`, which _should be kept secret_ and used only from your server (not the clientside app) at the end of the OAuth flow
- Still in the dashboard, update your application to enter one or multiple `redirectUris` (separated by a comma). Declaring your `redirectUris` let Connect knows where we can redirect the user after they grant access to your app. It could be something like `https://yourwebsite.com/connectOAuthRedirect` or for mobile apps `deeplinkscheme://connectOAuthRedirect`
- In your app, add a button somewhere (for example in your user's preference), that say "Link with Connect", and on click open a browser at the url `https://connect-project.io/authorize?client_id=[publicKey]&redirect_uri=[redirectUri]` (don't forget to replace the `publicKey` with yours, and the `redirectUri` with one from the list you declared in the dashboard)
- After opening the previous url in a browser, the user is guided by Connect to login and grant access to your app
- If the user grants you access, then we will redirect him to `[redirectUri]?authorization_code=[authorization_code]`
- Your app should get the `authorization_code`, send it to your own server, which will perform the secure call to get the access token:

```bash
curl --location --request POST 'https://connect-project.io/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id='$publicKey \
--data-urlencode 'client_secret='$secretKey \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'code='$authorization_code \
--data-urlencode 'redirect_uri'=$redirectUri

Response:
{
    "access_token": "XXXXXXXXXXXXXXXXXXXX",
    "token_type": "Bearer",
    "expires_in": 2591999,
    "refresh_token": "YYYYYYYYYYYYYYYYYY",
    "scope": []
}
```

To test it, there is a simple endpoint that get you the `userId` associated to this token:

```bash
curl --request GET \
  --url $CONNECT_URL/oauth/user \
  --header 'Authorization: Bearer '$access_token

Response:
{ "id": "xxxx" }
```

The token has a one month validity, and the refresh token is valid for one year (and you get a new one each time you refresh the token, see [Refreshing OAuth token](#oauth-authentication-refresh))

> ⚠️ while the access token can be used client side, the refresh token should only be stored on your server, and only used to refresh the token, still from your server. ⚠️

#### <a name="oauth-authentication-refresh">Refreshing OAuth token</a>

The OAuth token you obtain is valid for one month, and comes with a refresh token valid for one year.

When the access token expires, it cannot be used anymore to perform requests, and requests will fail.

When an access token expires, you can use the refresh token to ask for a new access token:

```bash
curl --location --request POST 'https://connect-project.io/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id='$publicKey \
--data-urlencode 'client_secret='$secretKey \
--data-urlencode 'grant_type=refresh_token' \
--data-urlencode 'refresh_token='$refresh_token

Response:
{
    "access_token": "XXXXXXXXXXXXXXXXXXXX",
    "token_type": "Bearer",
    "expires_in": 2591999,
    "refresh_token": "YYYYYYYYYYYYYYYYYY",
    "scope": []
}
```

This way, you will get both a new `access_token` and a new `refresh_token`, and can continue to send items in the name of your user, without intervention from them.

> ⚠️ If the refresh token fails with a forbidden or non authorized error, it means that your access to this user was revoked (either by him or by the Connect administrators), you should restart the OAuth flow for this user ⚠️

#### <a name="oauth-authentication-usage">OAuth Access token usage</a>

Once you get an access token from the previous flow, you can use it to authenticate methods to send data to the Connect system. Just use the `access_token` in an authorization header in every request: `Authorization: Bearer $access_token`

### <a name="create-object">Create object</a>

> ⚠️ Creation requests can only be performed with an [OAuth token](#oauth-authentication)

To create new object send a POST request to the endpoint `/parse/classes/:OBJECTNAME` :

```bash
curl --request POST \
  --url $CONNECT_URL/parse/classes/GameScore \
  --header 'content-type: application/json' \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  --header 'Authorization: Bearer '$access_token \
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
  "objectId": "DFwP7JXoa0",
  "applicationId": "[YOUR_APPLICATION_ID]"
}
```

### <a name="update-object">Update object</a>

> ⚠️ Update requests can only be performed with an [OAuth token](#oauth-authentication)

To update an object send a PUT request to the endpoint `/parse/classes/:OBJECTNAME/:OBJECTID` :

```bash
OBJECT_ID=DFwP7JXoa0
curl --request PUT \
  --url $CONNECT_URL/parse/classes/GameScore/$OBJECT_ID \
  --header 'content-type: application/json' \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  --header 'Authorization: Bearer '$access_token \
  --data '{
	"score":1338,
	"playerName":"sample",
	"cheatMode":false,
}'

Response :
{
  "score": 1338,
  "playerName": "sample",
  "cheatMode": false,
  "createdAt": "2019-07-15T14:06:53.659Z",
  "updatedAt": "2019-07-15T15:04:42.884Z",
  "objectId": "DFwP7JXoa0",
  "applicationId": "[YOUR_APPLICATION_ID]"
}
```

> ⚠️ **Only the owner of the data can update an object. If you did not create this object with the same user, you will have an error message** ⚠️

### <a name="delete-object">Delete object</a>

To delete an object send a DELETE request to the endpoint `/parse/classes/:OBJECTNAME/:OBJECTID` :

```bash
curl --request DELETE \
  --url $CONNECT_URL/parse/classes/GameScore/DFwP7JXoa0 \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  --header 'Authorization: Bearer '$access_token

Response:
{}
```

> ⚠️ **Like for update, only the owner of the data can delete an object. If you did not create this object you will have an error message** ⚠️

### <a name="get-object">Get object</a>

> 💡 Get requests can be performed either with an [OAuth token](#oauth-authentication) or with a [Session token](#authentication)

You can retrieve a specific object using the GET endpoint `/parse/classes/:OBJECTNAME/:OBJECTID` :

```bash
curl --request GET \
  --url $CONNECT_URL/parse/classes/GameScore/$OBJECT_ID \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  # one of the two authentication headers
  --header 'x-parse-session-token: '$SESSION_TOKEN \
  --header 'Authorization: Bearer '$access_token

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
  --url $CONNECT_URL/parse/classes/GameScore \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  # one of the two authentication headers
  --header 'x-parse-session-token: '$SESSION_TOKEN \
  --header 'Authorization: Bearer '$access_token

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
  --url $CONNECT_URL/parse/classes/GameScore \
  --header "X-Parse-Application-Id: "$PARSE_APPLICATION \
  --header 'x-parse-session-token: '$SESSION_TOKEN \
  --get \
  --data-urlencode 'where={"playerName":"Sean Plott","cheatMode":false}'
```

The values of the `where` parameter also support comparisons besides exact matching. Instead of an exact value, provide a hash with keys corresponding to the comparisons to do. The `where` parameter supports these options:

| Key          | Operation                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------ |
| \$lt         | Less Than                                                                                  |
| \$lte        | Less Than Or Equal To                                                                      |
| \$gt         | Greater Than                                                                               |
| \$gte        | Greater Than Or Equal To                                                                   |
| \$ne         | Not Equal To                                                                               |
| \$in         | Contained In                                                                               |
| \$nin        | Not Contained in                                                                           |
| \$exists     | A value is set for the key                                                                 |
| \$select     | This matches a value for a key in the result of a different query                          |
| \$dontSelect | Requires that a key's value not match a value for a key in the result of a different query |
| \$all        | Contains all of the given values                                                           |
| \$regex      | Requires that a key's value match a regular expression                                     |
| \$text       | Performs a full text search on indexed fields                                              |

In addition to `where`, there are several parameters you can use to configure what types of results are returned by the query.

| Parameter | Use                                                                             |
| --------- | ------------------------------------------------------------------------------- |
| order     | Specify a field to sort by                                                      |
| limit     | Limit the number of objects returned by the query (it can't be above 100 items) |
| skip      | Use with limit to paginate through results                                      |
| keys      | Restrict the fields returned by the query                                       |
| include   | Use on Pointer columns to return the full object                                |

You can use the `order` parameter to specify a field to sort by. Prefixing with a negative sign reverses the order. Thus, to retrieve scores in ascending order:

```bash
curl --request GET \
  --url $CONNECT_URL/parse/classes/GameScore \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  --header 'x-parse-session-token: '$SESSION_TOKEN \
  --get \
  --data-urlencode 'order=score'
```

If you are limiting your query, or if there are a very large number of results, and you want to know how many total results there are without returning them all, you can use the `count` parameter. For example, if you only care about the number of games played by a particular player:

```bash
curl --request GET \
  --url $CONNECT_URL/parse/classes/GameScore \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  --header 'x-parse-session-token: '$SESSION_TOKEN \
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

### <a name="app-details">Getting an app details from their ID</a>

When you consult data, each object will be returned with an attribute `applicationId`. If needed, it is possible to fetch the name and description of the app using the class `OAuthApplication`:

```bash
curl --request GET \
  --url $CONNECT_URL/parse/classes/OAuthApplication/$applicationId \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \
  --header 'x-parse-session-token: '$SESSION_TOKEN

Response:
{
    "objectId": "qD1tWbnjkK",
    "name": "App name",
    "description": "description !",
    "appleStoreLink": "https://apple.com",
    "googleMarketLink": "https://google.fr",
    "createdAt": "2021-06-16T16:43:45.089Z",
    "updatedAt": "2021-06-16T16:43:45.089Z"
}
```

### <a name="batch-operations">Batch Operations</a>

To reduce the amount of time spent on network round trips, you can create, update, or delete up to 50 objects in one call, using the batch endpoint.

Each command in a batch has `method`, `path`, and `body` parameters that specify the HTTP command that would normally be used for that command. The commands are run in the order they are given.

> ⚠️ Creation and Update requests can only be performed with an [OAuth token](#oauth-authentication), if you call a batch request with creation requests inside, without an OAuth access token, they will get rejected.

```bash
curl --request POST \
  --url $CONNECT_URL/parse/batch \
  --header 'content-type: application/json' \
  --header 'x-parse-application-id: '$PARSE_APPLICATION \

  # one of the two authentication headers
  --header 'x-parse-session-token: '$SESSION_TOKEN \
  --header 'Authorization: Bearer '$access_token \

  --header 'x-parse-session-token: '$SESSION_TOKEN \
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

### <a name="sandbox">Sandbox</a>

Before use the production database you can use the sanbox environnement.
Just add the following header to every requests you make to `/classes/*` or `/batch`:

`x-is-sandbox: true`

## <a name="schema-contribute">Schema Contribute</a>

The schema is a database model that will be use by everyone to get and set object.
Any User can contribute to the schema using Pull Request system. The CRI will accept or refuse the Pull Request after review of it.

When a Pull Request is accepted, the change (add or update) will be apply at the next deployment of the connect api (except for some specific change).

### <a name="add-class">Add a new Class</a>

A schema is the descriptor of a class. The name of class is the beggining of its file name, we use [JSON Schema](https://json-schema.org/) to describe the list of the fields.

You can create a Pull Request with for title `[Schema][New] ClassName`.
Write your schema file on `src/parse/schema/classes` folder with name `YOUR_CLASS_NAME.js`. A schema file should look like that :

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Game Score",
  "description": "A score obtained by a player and whether the player used the cheat mode",
  "type": "object",
  "properties": {
    "score": {
      "type": "number",
      "description": "The score obtained by the player"
    },
    "playerName": {
      "type": "string",
      "description": "The name of the player"
    },
    "cheatMode": {
      "type": "boolean",
      "description": "Whether the player used the cheat mode"
    }
  },
  "required": ["score", "playerName"],
  "additionalProperties": false
}
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
