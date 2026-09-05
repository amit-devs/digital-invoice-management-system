const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();
const customersFile = path.join(__dirname, '../data/customers.json');

const getCustomers = () => JSON.parse(fs.readFileSync(customersFile, 'utf8'));
const saveCustomers = (data) => fs.writeFileSync(customersFile, JSON.stringify(data, null, 2));

router.get('/', auth, (req, res) => {
  res.json(getCustomers());
});

router.get('/:id', auth, (req, res) => {
  const customers = getCustomers();
  const customer = customers.find(c => c.id == req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

router.post('/', auth, (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const customers = getCustomers();
  const newCustomer = {
    id: customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1,
    name, email, phone, address
  };
  customers.push(newCustomer);
  saveCustomers(customers);
  res.status(201).json(newCustomer);
});

router.put('/:id', auth, (req, res) => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });

  const { name, email, phone, address } = req.body;
  customers[index] = { ...customers[index], name, email, phone, address };
  saveCustomers(customers);
  res.json(customers[index]);
});

router.delete('/:id', auth, (req, res) => {
  let customers = getCustomers();
  const index = customers.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });

  customers = customers.filter(c => c.id != req.params.id);
  saveCustomers(customers);
  res.json({ message: 'Customer deleted successfully' });
});

module.exports = router;
