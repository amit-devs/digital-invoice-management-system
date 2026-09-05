const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();
const productsFile = path.join(__dirname, '../data/products.json');

const getProducts = () => {
  try {
    return JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  } catch (e) {
    return [];
  }
};
const saveProducts = (data) => fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));

router.get('/', auth, (req, res) => {
  res.json(getProducts());
});

router.post('/', auth, (req, res) => {
  const { name, description, price, tax } = req.body;
  if (!name || price === undefined) return res.status(400).json({ error: 'Name and price are required' });

  const products = getProducts();
  const newProduct = {
    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name, description, price: Number(price), tax: Number(tax || 0)
  };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

router.put('/:id', auth, (req, res) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const { name, description, price, tax } = req.body;
  products[index] = { ...products[index], name, description, price: Number(price), tax: Number(tax || 0) };
  saveProducts(products);
  res.json(products[index]);
});

router.delete('/:id', auth, (req, res) => {
  let products = getProducts();
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products = products.filter(p => p.id != req.params.id);
  saveProducts(products);
  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;
