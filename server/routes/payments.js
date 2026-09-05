const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();
const paymentsFile = path.join(__dirname, '../data/payments.json');
const invoicesFile = path.join(__dirname, '../data/invoices.json');

const getPayments = () => JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
const savePayments = (data) => fs.writeFileSync(paymentsFile, JSON.stringify(data, null, 2));

const getInvoices = () => JSON.parse(fs.readFileSync(invoicesFile, 'utf8'));
const saveInvoices = (data) => fs.writeFileSync(invoicesFile, JSON.stringify(data, null, 2));

router.get('/', auth, (req, res) => {
  res.json(getPayments());
});

router.post('/', auth, (req, res) => {
  const { invoiceId, customerId, amount, date, status, method } = req.body;
  
  const payments = getPayments();
  const newPayment = {
    id: payments.length ? Math.max(...payments.map(p => p.id)) + 1 : 1,
    invoiceId, customerId, amount, date, status, method
  };

  payments.push(newPayment);
  savePayments(payments);

  if (status === 'Paid') {
    const invoices = getInvoices();
    const invoiceIndex = invoices.findIndex(i => i.id == invoiceId);
    if (invoiceIndex !== -1) {
      invoices[invoiceIndex].status = 'Paid';
      saveInvoices(invoices);
    }
  }

  res.status(201).json(newPayment);
});

router.put('/:id', auth, (req, res) => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Payment not found' });

  const { status, method } = req.body;
  payments[index] = { ...payments[index], status, method };
  savePayments(payments);

  if (status === 'Paid') {
    const invoices = getInvoices();
    const invoiceIndex = invoices.findIndex(i => i.id == payments[index].invoiceId);
    if (invoiceIndex !== -1) {
      invoices[invoiceIndex].status = 'Paid';
      saveInvoices(invoices);
    }
  }

  res.json(payments[index]);
});

router.delete('/:id', auth, (req, res) => {
  let payments = getPayments();
  const index = payments.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Payment not found' });

  payments = payments.filter(p => p.id != req.params.id);
  savePayments(payments);
  res.json({ message: 'Payment deleted successfully' });
});

module.exports = router;
