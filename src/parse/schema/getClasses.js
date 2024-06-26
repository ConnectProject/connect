import getSchemas from './getSchemas.js';

const swaggerTypeToParseType = function swaggerTypeToParseType (element) {
  let parseType;
  switch (element.type) {
    case 'string':
      if (element.format === 'date-time') {
        parseType = 'Date';
      } else parseType = 'String';
      break;

    case 'number':
      parseType = 'Number';
      break;

    case 'boolean':
      parseType = 'Boolean';
      break;

    case 'array':
      parseType = 'Array';
      break;

    default:
      parseType = 'Object';
      break;
  }

  return parseType;
};

const getClass = function getClass (schema, isSandbox = false) {
  const className = isSandbox ? `Sandbox_${schema.className}` : schema.className;

  const parseClass = {
    className,
    fields: {},
  };
  for (const [key, element] of Object.entries(schema.schema.properties)) {
    parseClass.fields[key] = { type: swaggerTypeToParseType(element) };
  }

  return parseClass;
};

let classes;

export default async function getClasses() {
  if (typeof classes !== 'undefined') {
    return classes;
  }

  const schemas = await getSchemas();

  classes = [];
  for (const schema of schemas) {
    classes.push(getClass(schema));
    classes.push(getClass(schema, true));
  }

  return classes;
};
