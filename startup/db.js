const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  const db = process.env.DB || config.get('db');
  // Connect to MongoDB
  mongoose
    .connect(db)
    .then(() => winston.info(`Connected to ${db}...`))
    .catch((err) => console.error('Could not connect to MongoDB...', err));
};
