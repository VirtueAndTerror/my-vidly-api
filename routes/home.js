const router = require('express').Router();

app.get('/', (req, res) => {
  res.render({ title: 'My Express App', message: 'Hello there!' });
});

module.exports = router;
