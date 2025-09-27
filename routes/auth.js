const router = require('express').Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/users');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email } = req.body;

  // Check whether the user is already registred
  let user = await User.findOne({ email });

  // 400 - Bad Request - We don't want to tell the client why the authentication failed
  if (!user) return res.status(400).send('Invalid email or password');

  // Compare a plain text password with a hashed password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  // JWT - Token
  const token = user.generateAuthToken();

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(12).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
