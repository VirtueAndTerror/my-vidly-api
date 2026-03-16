const express = require('express');
const app = express();

require('./startup/config')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/prod')(app);

// Serve static files from 'public' directory.
app.use(express.static('public'));

// Only start the server locally, not on Vercel.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => console.info(`Listening on port ${PORT}...`));
}

module.exports = app;
