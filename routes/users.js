const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/users');
const auth = require('../middleware/auth');

// Get All Users
router.get('/', async (req, res) => {
  const users = await User.find().sort('email');
  res.send(users);
});

router.get('/me', auth, async (req, res) => {
  const user = User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;

  // Check whether the user is already registred
  let user = await User.findOne({ email });
  if (user) return res.status(400).send('User already registered.');

  user = new User({
    name,
    email,
    password,
  });

  // Hashes password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // Strips the password property from the user object
  const { password: pass, ...rest } = user.toObject();

  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .status(201)
    .send({ ...rest });
});

module.exports = router;
