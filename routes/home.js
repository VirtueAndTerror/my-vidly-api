const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ title: 'My Express App', message: 'Hello there!' });
});

module.exports = router;
