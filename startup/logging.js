const winston = require('winston');

module.exports = function () {
  // Logging Uncaught Exceptions
  winston.exceptions.handle(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      filename: 'uncaughtExceptions.log',
      format: winston.format.combine(winston.format.prettyPrint()),
    })
  );

  // General Logging
  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );

  process.on('unhandledRejection', (ex) => {
    throw new Error(ex);
  });
};
