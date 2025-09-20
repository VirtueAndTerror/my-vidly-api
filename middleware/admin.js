module.exports = function (req, res, next) {
  // 403 - Forbbiden
  if (!req.user.isAdmin) return res.status(403).send('Access denied');
  next();
};
