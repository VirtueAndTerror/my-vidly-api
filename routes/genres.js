const router = require('express').Router();
const { Genre, validate } = require('../models/genres');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// In-memory data store
/* let genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Drama' },
]; */

// CREATE, READ, UPDATE, DELETE (CRUD) operations

router.get('/', async (req, res) => {
  const genres = await Genre.find().select('-__v').sort('name');
  // Return the list of genres
  res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).select('-__v');

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

// This endpoint should only be called by an authenticated user.
router.post('/', auth, async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create new genre
  let genre = new Genre({
    name: req.body.name,
  });

  // Save to database
  genre = await genre.save();

  // Return the newly created genre
  res.status(201).send(genre);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    // Returns the updated document
    { new: true }
  );

  if (!genre) return res.status(404).send('Genre not found');

  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) return res.status(404).send('Genre not found');

  res.send(genre);
});

module.exports = router;
