const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebuger = require('debug')('app:startup');
const dbDebuger = require('debug')('app:db');
const logger = require('./middleware/logger');
const app = express();
const PORT = process.env.PORT || 3000;
const genres = require('./routes/genres');
const home = require('./routes/home');

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));
console.log(process.env.NODE_ENV);

// Enable morgan only in development
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebuger('Morgan enabled...');
}

// Middleware - Operates in the Request Processing Pipeline
app.use(express.json()); // to parse incoming requests with JSON payloads

app.use(express.urlencoded({ extended: true })); // To parse URL-encoded payloads

app.use(helmet()); // For setting various HTTP headers for app security

app.use(express.static('public')); // Serve static files from 'public' directory

app.use('/', home);
app.use('/api/genres', genres);

// Custom middleware for logging
// app.use(logger);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// DB Debugging
dbDebuger('Connected to the database...');

const server = app.listen(PORT, () => {
  const address = server.address();
  let host = address.address;
  if (host === '::' || host === '0.0.0.0') host = 'localhost';
  console.log(`Server is running on http://${host}:${address.port}`);
});
