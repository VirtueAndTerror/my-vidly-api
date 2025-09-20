module.exports = function asyncMiddleware(routeHandler) {
  // Factory Function that returns asyncronous route handeling
  return async (req, res, next) => {
    try {
      await routeHandler(req, res);
    } catch (ex) {
      next(ex); // We pass the error to Express
    }
  };
};
