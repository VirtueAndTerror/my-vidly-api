const router = require('express').Router();
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const auth = require('../middleware/auth');
const moment = require('moment');

router.post('/', auth, async (req, res) => {
  const { customerId, movieId } = req.body;

  if (!customerId)
    return res.status(400).send('Bad Request: customerId not provided');

  if (!movieId)
    return res.status(400).send('Bad Request: movieid not provided');

  // Making use of the custom static method 'lookup()'
  const rental = await Rental.lookup(customerId, movieId);

  if (!rental) return res.status(404).send('Not Found: Rental not found');

  if (rental.dateReturned)
    return res.status(400).send('Bad Request: Return already processed');

  // Calculate the rentalFee
  rental.return();

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  return res.status(200).send(rental);
});

// Todo:
function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.string().alphanum().min(3).required(),
    phone: Joi.string().alphanum().min(5).max(15).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(req);
}

module.exports = router;
