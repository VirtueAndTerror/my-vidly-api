const morgan = require('morgan');
const config = require('config');

// Configuration settings
module.exports = function (app) {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  }

  // Enable morgan only in development
  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));

    // Example code
    console.log('Application Name: ' + config.get('name'));
    console.log('Mail Server: ' + config.get('mail.host'));
    // console.log('Mail Password: ' + config.get('mail.password'));
  }
};
