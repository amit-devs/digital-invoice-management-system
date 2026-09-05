const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();
const invoicesFile = path.join(__dirname, '../data/invoices.json');

const getInvoices = () => JSON.parse(fs.readFileSync(invoicesFile, 'utf8'));
const saveInvoices = (data) => fs.writeFileSync(invoicesFile, JSON.stringify(data, null, 2));

router.get('/', auth, (req, res) => {
  res.json(getInvoices());
});

router.get('/:id', auth, (req, res) => {
  const invoices = getInvoices();
  const invoice = invoices.find(i => i.id == req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

router.post('/', auth, (req, res) => {
  const { invoiceNumber, customerId, date, dueDate, items, tax, discount } = req.body;
  
  const invoices = getInvoices();
  if (invoices.find(i => i.invoiceNumber === invoiceNumber)) {
    return res.status(400).json({ error: 'Invoice number must be unique' });
  }

  let subtotal = 0;
  const processedItems = items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    return { ...item, total: itemTotal };
  });

  const taxAmount = subtotal * ((tax || 0) / 100);
  const discountAmount = discount || 0;
  const total = subtotal + taxAmount - discountAmount;

  const newInvoice = {
    id: invoices.length ? Math.max(...invoices.map(i => i.id)) + 1 : 1,
    invoiceNumber,
    customerId,
    date,
    dueDate,
    items: processedItems,
    tax: tax || 0,
    discount: discountAmount,
    total,
    status: 'Pending'
  };

  invoices.push(newInvoice);
  saveInvoices(invoices);
  res.status(201).json(newInvoice);
});

router.put('/:id', auth, (req, res) => {
  const invoices = getInvoices();
  const index = invoices.findIndex(i => i.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Invoice not found' });

  const { invoiceNumber, customerId, date, dueDate, items, tax, discount, status } = req.body;
  
  if (invoiceNumber !== invoices[index].invoiceNumber && invoices.find(i => i.invoiceNumber === invoiceNumber)) {
    return res.status(400).json({ error: 'Invoice number must be unique' });
  }

  let subtotal = 0;
  const processedItems = items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    return { ...item, total: itemTotal };
  });

  const taxAmount = subtotal * ((tax || 0) / 100);
  const discountAmount = discount || 0;
  const total = subtotal + taxAmount - discountAmount;

  invoices[index] = {
    ...invoices[index],
    invoiceNumber, customerId, date, dueDate, items: processedItems, tax: tax || 0, discount: discountAmount, total,
    status: status || invoices[index].status
  };

  saveInvoices(invoices);
  res.json(invoices[index]);
});

router.delete('/:id', auth, (req, res) => {
  let invoices = getInvoices();
  const index = invoices.findIndex(i => i.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Invoice not found' });

  invoices = invoices.filter(i => i.id != req.params.id);
  saveInvoices(invoices);
  res.json({ message: 'Invoice deleted successfully' });
});

module.exports = router;
