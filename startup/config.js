const morgan = require('morgan');
const config = require('config');

// Configuration settings
module.exports = function (app) {
  const privateKey =
    process.env.VIDLY_JWT_PRIVATE_KEY || config.get('jwtPrivateKey');

  if (!privateKey) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  }

  // Enable morgan only in development
  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
  }
};
