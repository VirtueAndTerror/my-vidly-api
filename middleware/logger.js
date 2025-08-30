const log = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  // Call the next middleware function in the pipeline
  next();
};

module.exports = log;
