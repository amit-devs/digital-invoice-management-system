const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);

app.get('/api/dashboard', require('./middleware/auth'), (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const getJson = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
  
  const invoices = getJson('invoices.json');
  const customers = getJson('customers.json');
  const payments = getJson('payments.json');

  const totalInvoices = invoices.length;
  const totalCustomers = customers.length;
  const paidInvoices = invoices.filter(i => i.status === 'Paid').length;
  const pendingInvoices = invoices.filter(i => i.status !== 'Paid').length;
  
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);

  res.json({
    totalInvoices,
    totalCustomers,
    paidInvoices,
    pendingInvoices,
    totalRevenue,
    recentInvoices: invoices.slice(-5).reverse(),
    recentPayments: payments.slice(-5).reverse()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
