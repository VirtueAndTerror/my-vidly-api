const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');

// Define the custom Joi extension
const objectIdExtension = (joi) => ({
  type: 'objectId',
  base: joi.string(),
  messages: {
    'objectId.base': '"{{#label}}" must be a valid ObjectId',
  },
  validate(value, helpers) {
    if (!ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId.base') };
    }
  },
});

// Extend Joi with the custom ObjectId validator
const customJoi = Joi.extend(objectIdExtension);

// Usage example
const schema = Joi.object({
  userId: customJoi.objectId().required(),
});

// Validate sample data
const dataToValidate = { userId: '507f191e810c19729de860ea' }; // valid example
const result = schema.validate(dataToValidate);

if (result.error) {
  console.error('Validation error:', result.error.details);
} else {
  console.log('Validation succeeded:', result.value);
}

module.exports.customJoi = customJoi;
