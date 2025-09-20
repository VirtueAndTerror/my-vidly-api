const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
  const token = req.header('X-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (err) {
    // We either terminate the req-res lifecycle or pass control to the next funciton
    res.status(400).send('Invalid token.');
  }
};
