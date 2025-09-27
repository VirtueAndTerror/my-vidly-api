const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customers');

// Get All Customers
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  // Return the list of customers
  res.send(customers);
});

// Get Customer by Id
router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('Customer not found');

  res.send(customer);
});

// Create a new customer
router.post('/', async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, phone, isGold } = req.body;

  // Create new genre
  let customer = new Customer({
    name,
    phone,
    isGold,
  });

  // Save to database
  customer = await customer.save();

  // Return the newly created genre
  res.status(201).send(customer);
});

// Update a customer
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, phone, isGold } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name,
      phone,
      isGold,
    },
    { new: true }
  );

  if (!customer) return res.status(404).send('Customer not found');
  res.send(customer);
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) return res.status(404).send('Customer not found');
  res.send(customer);
});

module.exports = router;
