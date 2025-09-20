const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);

// Validation function for Movie
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(movie);
}

// In a real world application your Joi schema can start to grow independently of your mongoose schema.
// Persistance mode vs input model
module.exports.Movie = Movie;
module.exports.validate = validateMovie;
