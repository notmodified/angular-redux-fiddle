const Validator = require('jsonschema').Validator;
const ValidatorResult = require('jsonschema').ValidatorResult;
const v = new Validator();

v.attributes.recommended = (instance, schema, options, ctx) => {
  var result = new ValidatorResult(instance, schema, options, ctx);
  if (instance === undefined && schema.recommended === true) {
    result.addError({
      name: 'recommended',
      message: "is recommended"
    });
  } else if (instance && typeof instance==='object' && Array.isArray(schema.recommended)) {
    schema.recommended.forEach(function(n){
      if(instance[n]===undefined){
        result.addError({
          name: 'recommended',
          argument: n,
          message: "recommends property " + JSON.stringify(n),
        });
      }
    });
  }
  return result;
};

const one = {
  "id": "/one",
  "type": "object",
  "properties": {
    "afield": {"type": "string"},
    "anotherfield": {"type": "string"},
  },
  "recommended": ["afield", "anotherfield"]
};

const two = {
  "id": "/two",
  "type": "object",
  "properties": {
    "dropdown": {
      "ident": {"type": "number"},
      "label": {"type": "string"}
    },
    "step2field": {"type": "string"},
    "anotherStep2field": {"type": "string"}
  },
  "recommended": ["anotherStep2field"],
  "required": ["step2field"]
};

const three = {
  "id": "/three",
  "type": "object",
  "properties": {
    "step3field": {"type": "string"}
  },
  "required": ["step3field"],
};

const schema = {
  "id": "/schema",
  "type": "object",
  "allOf": [
    {"$ref": "/one"},
    {"$ref": "/two"},
    {"$ref": "/three"}
  ]
};

v.addSchema(one, '/one');
v.addSchema(two, '/two');
v.addSchema(three, '/three');

export default data => v.validate(data, schema);
