const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/config')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/prod')(app);

const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // Serve static files from 'public' directory

const server = app.listen(PORT, () => {
  const address = server.address();
  let host = address?.address;
  if (host === '::' || host === '0.0.0.0') host = 'localhost';
  winston.info(`Server is running on http://${host}:${address?.port}`);
});

module.exports = server;

// module.exports = app;
