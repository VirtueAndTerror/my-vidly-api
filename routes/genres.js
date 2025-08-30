const express = require('express');
const router = express.Router();
const Joi = require('joi');

// In-memory data store
let genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Drama' },
];

// CREATE, READ, UPDATE, DELETE (CRUD) operations
router.get('/', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('Genre not found');
  res.send(genre);
});

router.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create new genre

  const newGenre = {
    id: genres.length + 1, // Simple ID generation
    name: req.body.name,
  };

  // Add to in-memory store
  genres.push(newGenre);
  // Return the newly created genre
  res.status(201).send(newGenre);
});

router.put('/:id', (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('Genre not found');

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

router.delete('/:id', (req, res) => {
  const genreIndex = genres.findIndex((g) => g.id === parseInt(req.params.id));
  if (genreIndex === -1) return res.status(404).send('Genre not found');
  const deletedGenre = genres.splice(genreIndex, 1);
  res.send(deletedGenre[0]);
});

// Validation function
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

module.exports = router;
