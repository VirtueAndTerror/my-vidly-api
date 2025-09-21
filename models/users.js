const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    // keyword 'this' - References the calling function
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.VIDLY_JWT_PRIVATE_KEY || config.get('jwtPrivateKey')
  );
  return token;
};

const User = mongoose.model('User', userSchema);

// Validation function
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z-]+$/)
      .messages({
        'string.pattern.base':
          'Value must only contain alphanumeric characters and hyphens (-)',
        'string.empty': 'Value cannot be empty',
      })
      .min(3)
      .trim()
      .required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(12).max(255).required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
