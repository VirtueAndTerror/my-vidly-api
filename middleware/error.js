const winston = require('winston');

// Centralized error handling middleware
// This function catches any errro in the Requiest Processing Pipeline
module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send('Something failed');
};
