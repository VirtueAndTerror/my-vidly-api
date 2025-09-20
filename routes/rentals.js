const router = require('express').Router();
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rentals');
const { Customer } = require('../models/customers');
const { Movie } = require('../models/movies');
const auth = require('../middleware/auth');

// TODOS - Improve implemetation as posted in:
// https://github.com/VirtueAndTerror/vidly-api-node/blob/master/routes/rentals.js

// Get all rentals
router.get('/', auth, async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

// Get rental by ID
router.get('/:id', auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('Rental not found');

  res.send(rental);
});

// Create new rental
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Input validation
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid Customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid Movie');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock ');

  const { _id: customerID, name, phone } = customer;
  const { _id: movieID, title, dailyRentalRate } = movie;

  // Here we have 2 separeted operations: We need a transaction.

  try {
    const session = await mongoose.startSession();
    const currentSession = { session };
    session.startTransaction();

    // Operation #1
    const rental = Rental({
      customer: {
        _id: customerID,
        name,
        phone,
      },
      movie: {
        _id: movieID,
        title,
        dailyRentalRate,
      },
    });

    await rental.save(currentSession);

    // Operation #2
    await movie.updateOne({ $inc: { numberInStock: -1 } });
    await movie.save(currentSession);
    // Commit Transaction
    session.commitTransaction();
    // Send the rental to the client
    res.send(rental);
  } catch (error) {
    session.abortTransaction();
    console.error('Transaction Filed: ', error);

    res.status(500).send('Something failed in the server.');
  } finally {
    await session.endSession();
  }
});

// Delete
router.delete('/:id', auth, (req, res) => {
  const rental = Rental.findByIdAndDelete(req.params.id);
  if (!rental) return res.status(404).res.send('Rental not found');
  res.send(rental);
});

module.exports = router;
