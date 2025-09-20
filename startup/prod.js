const helmet = require('helmet');
const compression = require('compression');

module.exports = function (app) {
  app.use(helmet()); // For setting various HTTP Headers for app security
  app.use(compression()); // It compresses the body of the HTTP Request
};
