/**
 * Cast parse type to swagger type
 * @param {string} type Parse type
 * @returns {string} swagger type
 */
const schemaTypeToSwaggerType = function (type) {
  let swaggerType;
  switch (type) {
    case 'String':
      swaggerType = { type: 'string' };
      break;

    case 'Number':
      swaggerType = { type: 'number' };
      break;

    case 'Boolean':
      swaggerType = { type: 'boolean' };
      break;

    case 'Array':
      swaggerType = { type: 'array', items: { type: 'object' } };
      break;

    case 'Object':
      swaggerType = { type: 'object' };
      break;

    case 'File':
      swaggerType = { type: 'object' };
      break;

    case 'Pointer':
      swaggerType = { type: 'object' };
      break;

    case 'Relation':
      swaggerType = { type: 'object' };
      break;

    default:
      swaggerType = { type: 'string' };
      break;
  }

  return swaggerType;
};

/**
 * Get swagger configuration (CREATE, READ) for parse endpoint
 * @param {*} classes classes
 * @returns {Object} path
 */
const getPath = function (classes) {
  return {
    get: {
      security: [{ ParseAppId: [], ParseSessionId: [] }],
      summary: `Get ${classes.className} data`,
      description:
        'Find queries documentation here https://docs.parseplatform.org/rest/guide/#queries',
      tags: [`${classes.className}`],
      responses: {
        200: {
          description: `Return ${classes.className} data`,
          schema: {
            $ref: `#/components/schemas/${classes.className}`,
          },
        },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
        406: { description: 'Not Acceptable' },
        500: { description: 'Server Internal error' },
      },
    },
    post: {
      security: [{ ParseAppId: [], ParseSessionId: [] }],
      summary: 'Add object instance',
      description: 'Happy to access The System',
      tags: [`${classes.className}`],
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'object that needs to be added to the store',
          required: true,
          schema: {
            $ref: `#/components/schemas/${classes.className}`,
          },
        },
      ],
      responses: {
        200: {
          description: `Returns ${classes.className} data`,
          schema: {
            $ref: `#/components/schemas/${classes.className}`,
          },
        },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
        406: { description: 'Not Acceptable' },
        500: { description: 'Server Internal error' },
      },
    },
  };
};

/**
 * Get swagger configuration (UPDATE, READ, DELETE) for parse endpoint
 * @param {*} classes classes
 * @returns {Object} path
 */
const getPathById = function (classes) {
  return {
    get: {
      security: [
        {
          ParseAppId: [],
          ParseSessionId: [],
        },
      ],
      summary: `Get ${classes.className} by id`,
      description: 'Happy to access The System',
      tags: [`${classes.className}`],
      parameters: [
        {
          in: 'path',
          name: 'id',
          type: 'string',
          description: 'The id of the element you want to get.',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'Returns data',
          schema: {
            $ref: `#/components/schemas/${classes.className}`,
          },
        },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
        406: { description: 'Not Acceptable' },
        500: { description: 'Server Internal error' },
      },
    },
    put: {
      security: [
        {
          ParseAppId: [],
          ParseSessionId: [],
        },
      ],
      summary: 'Update instance',
      description: 'Happy to access The System',
      tags: [`${classes.className}`],
      parameters: [
        {
          in: 'path',
          name: 'id',
          type: 'string',
          description: 'The id of the element you want to update.',
          required: true,
        },
        {
          in: 'body',
          name: 'movie',
          description: 'The element you want update with.',
          required: true,
          schema: {
            $ref: `#/components/schemas/${classes.className}`,
          },
        },
      ],
      responses: {
        200: {
          description: 'Returns instance data',
          schema: {
            $ref: `#/components/schemas/${classes.className}`,
          },
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
        406: {
          description: 'Not Acceptable',
        },
        500: {
          description: 'Server Internal error',
        },
      },
    },
    delete: {
      security: [
        {
          ParseAppId: [],
          ParseSessionId: [],
        },
      ],
      summary: 'Delete instance',
      description: 'Happy to access The System',
      tags: [`${classes.className}`],
      parameters: [
        {
          in: 'path',
          name: 'id',
          type: 'string',
          description: 'The id of the element you want to delete.',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'Returns a confirmation message',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'Id not found',
          schema: {
            $ref: '#/components/schemas/notfound',
          },
        },
        406: {
          description: 'Not Acceptable',
        },
        500: {
          description: 'Server Internal error',
        },
      },
    },
  };
};

/**
 *
 * @param {Object} classe server classes
 * @returns {Object} schema
 */
const transformClasseToSchema = function (classe) {
  const schema = { type: 'object', properties: {} };

  classe.forEach((element, key) => {
    if (key !== 'ACL') {
      schema.properties[key] = schemaTypeToSwaggerType(element.type);
    }
  });

  return schema;
};

/**
 * Transform Parse Server schema.json to swagger.json
 * @param {object} spec spec
 * @param {object} schemas schemas
 * @param {array} excludes exclude list
 * @returns {Object} spec
 */
exports.parseSchemaToSwagger = (spec, schemas, excludes) => {
  const newSpec = spec;

  for (const classes of schemas) {
    if (!excludes.includes(classes.className)) {
      newSpec.components.schemas[classes.className] = transformClasseToSchema(
        classes,
      );
      newSpec.paths[`/parse/classes/${classes.className}`] = getPath(classes);
      newSpec.paths[`/parse/classes/${classes.className}/{id}`] = getPathById(
        classes,
      );
    }
  }

  return spec;
};
