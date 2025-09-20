const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    trim: true,
    required: true,
  },
});

const Genre = mongoose.model('Genre', genreSchema);

// Validation function
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z1-9-]+$/)
      .messages({
        'string.pattern.base':
          'Value must only contain alphanumeric characters and hyphens (-)',
        'string.empty': 'Value cannot be empty',
      })
      .min(5)
      .max(50)
      .trim()
      .required(),
  });

  return schema.validate(genre);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;
