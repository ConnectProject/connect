/**
 * Cast parse type to swagger type
 * no longer used
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
 * @param {*} schema schema
 * @returns {Object} path
 */
const getPath = function (schema) {
  return {
    get: {
      security: [{ ParseAppId: [], ParseSessionId: [], OAuth2BearerToken: [] }],
      summary: `Get ${schema.className} data`,
      description:
        'Find queries documentation here https://docs.parseplatform.org/rest/guide/#queries',
      tags: [`${schema.className}`],
      responses: {
        200: {
          description: `Return ${schema.className} data`,
          schema: {
            $ref: `#/components/schemas/${schema.className}`,
          },
        },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
        406: { description: 'Not Acceptable' },
        500: { description: 'Server Internal error' },
      },
    },
    post: {
      security: [{ ParseAppId: [], OAuth2BearerToken: [] }],
      summary: 'Add object instance',
      description: 'Happy to access The System',
      tags: [`${schema.className}`],
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'object that needs to be added to the store',
          required: true,
          schema: {
            $ref: `#/components/schemas/${schema.className}`,
          },
        },
      ],
      responses: {
        200: {
          description: `Returns ${schema.className} data`,
          schema: {
            $ref: `#/components/schemas/${schema.className}`,
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
 * @param {Object} schema schema
 * @returns {Object} path
 */
const getPathById = function (schema) {
  return {
    get: {
      security: [
        {
          ParseAppId: [],
          ParseSessionId: [],
          OAuth2BearerToken: [],
        },
      ],
      summary: `Get ${schema.className} by id`,
      description: 'Happy to access The System',
      tags: [`${schema.className}`],
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
            $ref: `#/components/schemas/${schema.className}`,
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
          OAuth2BearerToken: [],
        },
      ],
      summary: 'Update instance',
      description: 'Happy to access The System',
      tags: [`${schema.className}`],
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
            $ref: `#/components/schemas/${schema.className}`,
          },
        },
      ],
      responses: {
        200: {
          description: 'Returns instance data',
          schema: {
            $ref: `#/components/schemas/${schema.className}`,
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
          OAuth2BearerToken: [],
        },
      ],
      summary: 'Delete instance',
      description: 'Happy to access The System',
      tags: [`${schema.className}`],
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
 * no longer used
 * @param {Object} oneClass server class
 * @returns {Object} schema
 */
const transformClasseToSchema = function (oneClass) {
  const schema = { type: 'object', properties: {} };

  Object.entries(oneClass.fields).forEach(([key, element]) => {
    if (key !== 'ACL') {
      schema.properties[key] = schemaTypeToSwaggerType(element.type);
    }
  });

  return schema;
};

/**
 * Transform Parse Server schema.json to swagger.json
 * no longer used
 * @param {object} spec spec
 * @param {object} schemas schemas
 * @param {array} excludes exclude list
 * @returns {Object} spec
 */
export const parseSchemaToSwagger = (spec, schemas, excludes) => {

  for (const schema of schemas) {
    if (
      !excludes.includes(schema.className) &&
      !schema.className.startsWith('Sandbox_')
    ) {
      spec.components.schemas[schema.className] =
        transformClasseToSchema(schema);
      spec.paths[`/parse/classes/${schema.className}`] = getPath(schema);
      spec.paths[`/parse/classes/${schema.className}/{id}`] =
        getPathById(schema);
    }
  }

  return spec;
};

/**
 * Transform JSON schemas.json to swagger.json
 * @param {object} spec spec
 * @param {object} schemas schemas
 * @param {array} excludes exclude list
 * @returns {Object} spec
 */
export const jsonSchemasToSwagger = (spec, schemas, excludes) => {

  for (const schema of schemas) {
    if (
      !excludes.includes(schema.className) &&
      !schema.className.startsWith('Sandbox_')
    ) {
      spec.components.schemas[schema.className] = schema.schema;
      spec.paths[`/parse/classes/${schema.className}`] = getPath(schema);
      spec.paths[`/parse/classes/${schema.className}/{id}`] =
        getPathById(schema);
    }
  }

  return spec;
};
