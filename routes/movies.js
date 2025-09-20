const { Movie, validate } = require('../models/movies');
const { Genre } = require('../models/genres');
const router = require('express').Router();
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().select('-__v').sort('title');
  res.send(movies);
});

// Get a specific movie by ID
router.get('/:id', validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send('No movie with the given ID has been found');

  res.send(movie);
});

// Create a new movie
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { genreId, title, numberInStock, dailyRentalRate } = req.body;

  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = new Movie({
    title,
    genre: {
      // Selectively pick fields from the genre object (the embedded subdocument has less properties that the model)
      _id: genre._id,
      name: genre.name,
    },
    numberInStock,
    dailyRentalRate,
  });

  await movie.save();
  res.status(201).send(movie);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id, title, genre, numberInStock, dailyRentalRate } = req.body;

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title,
      genre,
      numberInStock,
      dailyRentalRate,
    },
    { new: true }
  );

  res.send(movie);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send('No movie with the given ID has been found');

  res.send(movie);
});

module.exports = router;
