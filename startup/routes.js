const express = require('express');
const error = require('../middleware/error');

// Routers
const auth = require('../routes/auth');
const users = require('../routes/users');
const movies = require('../routes/movies');
const customers = require('../routes/customers');
const genres = require('../routes/genres');
const rentals = require('../routes/rentals');
const home = require('../routes/home');
const returns = require('../routes/returns');

module.exports = function (app) {
  // Middleware - Operates in the Request Processing Pipeline
  app.use(express.json()); // to parse incoming requests with JSON payloads

  app.use('/', home);
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);

  app.use(error);
};
